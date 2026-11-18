#!/usr/bin/env python3
"""Module 01 Verification Harness: Foundations & LLM Mechanics.

Zero external dependencies (Python 3 standard library only).
Verifies token budgeting, HTTP retry/backoff classification, structured error
envelopes, transactional database state/idempotency, and environment readiness.
"""

from __future__ import annotations

import argparse
from dataclasses import asdict, dataclass
import json
import math
from pathlib import Path
import sqlite3
import sys
from typing import Any


RETRYABLE_HTTP_STATUSES = frozenset({408, 429, 500, 502, 503, 504})
NON_RETRYABLE_HTTP_STATUSES = frozenset({400, 401, 403, 404, 422})


@dataclass(frozen=True)
class CheckResult:
    name: str
    passed: bool
    detail: str


def estimate_tokens(text: str) -> int:
    """Conservative ~4 chars/token heuristic for budget pre-flight checks."""
    if not text:
        return 0
    return max(1, math.ceil(len(text) / 4))


def validate_token_budget(
    system_prompt: str,
    user_prompt: str,
    reserved_output_tokens: int,
    context_limit: int,
    safety_margin: int = 128,
) -> tuple[bool, int]:
    """Check whether prompt + reserved output + margin fit inside context_limit."""
    total_required = (
        estimate_tokens(system_prompt)
        + estimate_tokens(user_prompt)
        + reserved_output_tokens
        + safety_margin
    )
    return total_required <= context_limit, total_required


def is_retryable_status(status_code: int) -> bool:
    if status_code in RETRYABLE_HTTP_STATUSES:
        return True
    if status_code in NON_RETRYABLE_HTTP_STATUSES:
        return False
    return 500 <= status_code < 600


def compute_backoff_seconds(
    attempt: int,
    base_delay: float = 0.5,
    max_delay: float = 16.0,
    jitter_ratio: float = 0.2,
) -> float:
    """Deterministic bounded exponential backoff with symmetric jitter bound."""
    if attempt < 0:
        raise ValueError("attempt must be >= 0")
    raw = min(max_delay, base_delay * (2**attempt))
    return round(raw * (1.0 + jitter_ratio), 4)


def build_error_envelope(
    error_code: str,
    message: str,
    retryable: bool,
    request_id: str,
) -> dict[str, Any]:
    """Construct a structured API error envelope without leaking secrets."""
    required = {"error_code", "message", "retryable", "request_id"}
    payload = {
        "error_code": error_code,
        "message": message,
        "retryable": retryable,
        "request_id": request_id,
    }
    if not required.issubset(payload.keys()) or not all(
        isinstance(payload[k], str) and payload[k].strip()
        for k in ("error_code", "message", "request_id")
    ):
        raise ValueError("Invalid structured error envelope")
    return payload


def check_token_budgeting() -> CheckResult:
    fits, used = validate_token_budget(
        system_prompt="You are a concise engineering assistant.",
        user_prompt="Summarize the HTTP lifecycle in 3 bullets.",
        reserved_output_tokens=512,
        context_limit=4096,
    )
    oversized_fits, oversized_used = validate_token_budget(
        system_prompt="System" * 500,
        user_prompt="Context " * 2500,
        reserved_output_tokens=1024,
        context_limit=4096,
    )
    passed = fits and not oversized_fits and used < 4096 and oversized_used > 4096
    return CheckResult(
        name="token_budget_accounting",
        passed=passed,
        detail=f"valid_used={used}/4096, rejected_oversized={oversized_used}/4096",
    )


def check_http_retry_policy() -> CheckResult:
    retry_ok = all(is_retryable_status(code) for code in (429, 502, 503, 504))
    no_retry_ok = all(not is_retryable_status(code) for code in (400, 401, 403, 422))
    delays = [compute_backoff_seconds(i) for i in range(4)]
    monotonic_bounded = delays == sorted(delays) and max(delays) <= 16.0 * 1.2
    passed = retry_ok and no_retry_ok and monotonic_bounded
    return CheckResult(
        name="http_retry_and_backoff",
        passed=passed,
        detail=f"delays={delays}, 429_retryable={is_retryable_status(429)}, 400_retryable={is_retryable_status(400)}",
    )


def check_structured_error_envelope() -> CheckResult:
    env = build_error_envelope(
        error_code="RATE_LIMITED",
        message="Upstream provider rate limit exceeded; retry with backoff.",
        retryable=True,
        request_id="req_01_test",
    )
    has_no_secret = "sk-" not in json.dumps(env)
    passed = (
        env["error_code"] == "RATE_LIMITED"
        and env["retryable"] is True
        and has_no_secret
    )
    return CheckResult(
        name="structured_error_envelope",
        passed=passed,
        detail=f"envelope_keys={sorted(env.keys())}",
    )


def check_transactional_db_state() -> CheckResult:
    conn = sqlite3.connect(":memory:")
    try:
        conn.execute(
            """
            CREATE TABLE llm_requests (
                idempotency_key TEXT PRIMARY KEY,
                status TEXT NOT NULL,
                prompt_tokens INTEGER NOT NULL,
                completion_tokens INTEGER NOT NULL
            )
            """
        )
        with conn:
            conn.execute(
                "INSERT INTO llm_requests VALUES (?, ?, ?, ?)",
                ("idem-001", "completed", 120, 45),
            )
        duplicate_blocked = False
        try:
            with conn:
                conn.execute(
                    "INSERT INTO llm_requests VALUES (?, ?, ?, ?)",
                    ("idem-001", "completed", 120, 45),
                )
        except sqlite3.IntegrityError:
            duplicate_blocked = True

        row_count = conn.execute("SELECT COUNT(*) FROM llm_requests").fetchone()[0]
        passed = duplicate_blocked and row_count == 1
        return CheckResult(
            name="transactional_db_idempotency",
            passed=passed,
            detail=f"duplicate_blocked={duplicate_blocked}, persisted_rows={row_count}",
        )
    finally:
        conn.close()


def check_environment_readiness() -> CheckResult:
    readme_exists = (Path(__file__).resolve().parent / "README.md").is_file()
    py_ok = sys.version_info >= (3, 10)
    passed = readme_exists and py_ok
    return CheckResult(
        name="environment_and_docs",
        passed=passed,
        detail=f"python={sys.version.split()[0]}, readme_exists={readme_exists}",
    )


def run_all_checks() -> list[CheckResult]:
    return [
        check_token_budgeting(),
        check_http_retry_policy(),
        check_structured_error_envelope(),
        check_transactional_db_state(),
        check_environment_readiness(),
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify Module 01 Foundations invariants.")
    parser.add_argument("--json", action="store_true", help="Emit JSON report.")
    args = parser.parse_args()

    results = run_all_checks()
    all_passed = all(r.passed for r in results)

    if args.json:
        print(
            json.dumps(
                {"module": "01-foundations", "passed": all_passed, "checks": [asdict(r) for r in results]},
                indent=2,
            )
        )
    else:
        print("=== 01-foundations Verification Harness ===")
        for r in results:
            tag = "PASS" if r.passed else "FAIL"
            print(f"[{tag}] {r.name}: {r.detail}")
        print(f"Summary: {sum(r.passed for r in results)}/{len(results)} checks passed.")

    return 0 if all_passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
