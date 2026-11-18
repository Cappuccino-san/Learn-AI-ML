#!/usr/bin/env python3
"""Module 02 Verification Harness: Enterprise RAG & Reliable Agent Orchestration.

Zero external dependencies (Python 3 standard library only).
Verifies incremental document sync, stale data prevention, fine-grained ACL
permission isolation, root-cause error attribution traces, and idempotent ReAct
agent checkpoint recovery.
"""

from __future__ import annotations

import argparse
from dataclasses import asdict, dataclass, field
import hashlib
import json
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class CheckResult:
    name: str
    passed: bool
    detail: str


@dataclass
class ChunkRecord:
    chunk_id: str
    doc_id: str
    version: int
    content_hash: str
    text: str
    allowed_roles: frozenset[str]


class InMemoryVectorStore:
    """Minimal ACL-aware, versioned vector store stub for contract verification."""

    def __init__(self) -> None:
        self._doc_hashes: dict[str, str] = {}
        self._chunks: dict[str, ChunkRecord] = {}

    def sync_document(
        self,
        doc_id: str,
        version: int,
        chunks: list[str],
        allowed_roles: set[str],
    ) -> str:
        combined = "\n".join(chunks)
        digest = hashlib.sha256(f"{version}:{combined}".encode("utf-8")).hexdigest()
        if self._doc_hashes.get(doc_id) == digest:
            return "unchanged"

        # Evict stale chunks for this document before indexing the new revision.
        stale_ids = [cid for cid, rec in self._chunks.items() if rec.doc_id == doc_id]
        for cid in stale_ids:
            del self._chunks[cid]

        roles = frozenset(allowed_roles)
        for idx, text in enumerate(chunks):
            cid = f"{doc_id}:v{version}:c{idx}"
            self._chunks[cid] = ChunkRecord(
                chunk_id=cid,
                doc_id=doc_id,
                version=version,
                content_hash=digest,
                text=text,
                allowed_roles=roles,
            )
        self._doc_hashes[doc_id] = digest
        return "updated"

    def delete_document(self, doc_id: str) -> int:
        to_delete = [cid for cid, rec in self._chunks.items() if rec.doc_id == doc_id]
        for cid in to_delete:
            del self._chunks[cid]
        self._doc_hashes.pop(doc_id, None)
        return len(to_delete)

    def query(self, keyword: str, user_roles: set[str]) -> list[ChunkRecord]:
        needle = keyword.lower()
        return [
            rec
            for rec in self._chunks.values()
            if needle in rec.text.lower() and bool(rec.allowed_roles & user_roles)
        ]


@dataclass
class AgentCheckpointStore:
    """Simulates durable checkpointing + idempotency keys for side-effecting tools."""

    committed_steps: dict[str, dict[str, Any]] = field(default_factory=dict)
    tool_invocations: int = 0

    def execute_idempotent_tool(
        self,
        idempotency_key: str,
        tool_name: str,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        if idempotency_key in self.committed_steps:
            return self.committed_steps[idempotency_key]

        self.tool_invocations += 1
        result = {
            "status": "committed",
            "tool": tool_name,
            "idempotency_key": idempotency_key,
            "payload": payload,
        }
        self.committed_steps[idempotency_key] = result
        return result


def check_incremental_sync_and_staleness() -> CheckResult:
    store = InMemoryVectorStore()
    status_v1 = store.sync_document(
        "pricing-policy",
        version=1,
        chunks=["Standard plan costs $49/month."],
        allowed_roles={"public"},
    )
    status_noop = store.sync_document(
        "pricing-policy",
        version=1,
        chunks=["Standard plan costs $49/month."],
        allowed_roles={"public"},
    )
    status_v2 = store.sync_document(
        "pricing-policy",
        version=2,
        chunks=["Standard plan costs $79/month (effective 2026)."],
        allowed_roles={"public"},
    )
    store.sync_document(
        "deprecated-faq",
        version=1,
        chunks=["Legacy plan is still active."],
        allowed_roles={"public"},
    )
    deleted_count = store.delete_document("deprecated-faq")

    hits = store.query("plan", {"public"})
    no_stale_price = all("$49" not in hit.text for hit in hits)
    only_latest = len(hits) == 1 and hits[0].version == 2
    passed = (
        status_v1 == "updated"
        and status_noop == "unchanged"
        and status_v2 == "updated"
        and deleted_count == 1
        and no_stale_price
        and only_latest
    )
    return CheckResult(
        name="incremental_sync_and_staleness",
        passed=passed,
        detail=f"sync_states=({status_v1},{status_noop},{status_v2}), evicted_deleted={deleted_count}, hits={len(hits)}",
    )


def check_acl_permission_isolation() -> CheckResult:
    store = InMemoryVectorStore()
    store.sync_document(
        "exec-comp",
        version=1,
        chunks=["Confidential compensation matrix for VP engineering."],
        allowed_roles={"hr-admin", "executive"},
    )
    store.sync_document(
        "handbook",
        version=1,
        chunks=["Engineering onboarding checklist and PTO policy."],
        allowed_roles={"employee", "hr-admin"},
    )

    employee_hits = store.query("engineering", {"employee"})
    hr_hits = store.query("engineering", {"hr-admin"})
    leaked = any(hit.doc_id == "exec-comp" for hit in employee_hits)
    passed = len(employee_hits) == 1 and not leaked and len(hr_hits) == 2
    return CheckResult(
        name="acl_permission_isolation",
        passed=passed,
        detail=f"employee_hits={len(employee_hits)}, hr_hits={len(hr_hits)}, secret_leaked={leaked}",
    )


def attribute_rag_failure(trace_spans: list[dict[str, Any]]) -> str:
    """Identify the earliest failing stage in a RAG pipeline trace."""
    stage_order = ("chunking", "retrieval", "reranking", "generation")
    by_stage = {span["stage"]: span for span in trace_spans}
    for stage in stage_order:
        span = by_stage.get(stage)
        if span and not span.get("passed", False):
            return stage
    return "none"


def check_root_cause_attribution() -> CheckResult:
    retrieval_fail_trace = [
        {"stage": "chunking", "passed": True, "chunks": 42},
        {"stage": "retrieval", "passed": False, "recall_at_5": 0.2},
        {"stage": "reranking", "passed": True, "ndcg": 0.0},
        {"stage": "generation", "passed": False, "reason": "missing_ground_truth"},
    ]
    root_cause = attribute_rag_failure(retrieval_fail_trace)
    passed = root_cause == "retrieval"
    return CheckResult(
        name="root_cause_error_attribution",
        passed=passed,
        detail=f"attributed_stage={root_cause}",
    )


def check_idempotent_agent_recovery() -> CheckResult:
    checkpoints = AgentCheckpointStore()
    # Step 1 commits before simulated crash.
    first = checkpoints.execute_idempotent_tool(
        idempotency_key="wf-99-step-1-charge",
        tool_name="billing.create_invoice",
        payload={"amount_usd": 250},
    )
    # Simulated worker crash & replay of step 1, then step 2 executes.
    replayed = checkpoints.execute_idempotent_tool(
        idempotency_key="wf-99-step-1-charge",
        tool_name="billing.create_invoice",
        payload={"amount_usd": 250},
    )
    step2 = checkpoints.execute_idempotent_tool(
        idempotency_key="wf-99-step-2-notify",
        tool_name="notifier.send_receipt",
        payload={"invoice_id": "inv_99"},
    )

    passed = (
        first == replayed
        and checkpoints.tool_invocations == 2
        and step2["status"] == "committed"
    )
    return CheckResult(
        name="idempotent_agent_recovery",
        passed=passed,
        detail=f"unique_tool_executions={checkpoints.tool_invocations}, replay_identical={first == replayed}",
    )


def check_docs_presence() -> CheckResult:
    readme_exists = (Path(__file__).resolve().parent / "README.md").is_file()
    return CheckResult(
        name="module_documentation",
        passed=readme_exists,
        detail=f"readme_exists={readme_exists}",
    )


def run_all_checks() -> list[CheckResult]:
    return [
        check_incremental_sync_and_staleness(),
        check_acl_permission_isolation(),
        check_root_cause_attribution(),
        check_idempotent_agent_recovery(),
        check_docs_presence(),
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify Module 02 RAG & Agent invariants.")
    parser.add_argument("--json", action="store_true", help="Emit JSON report.")
    args = parser.parse_args()

    results = run_all_checks()
    all_passed = all(r.passed for r in results)

    if args.json:
        print(
            json.dumps(
                {
                    "module": "02-system-architecture",
                    "passed": all_passed,
                    "checks": [asdict(r) for r in results],
                },
                indent=2,
            )
        )
    else:
        print("=== 02-system-architecture Verification Harness ===")
        for r in results:
            tag = "PASS" if r.passed else "FAIL"
            print(f"[{tag}] {r.name}: {r.detail}")
        print(f"Summary: {sum(r.passed for r in results)}/{len(results)} checks passed.")

    return 0 if all_passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
