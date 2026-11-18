# 02 — System Architecture: Enterprise RAG & Reliable Agent Orchestration

> *"Generating tool-call JSON does not make an agent reliable, and a tool returning HTTP 200 does not guarantee a valid business outcome."*

## Core Engineering Focus

End-to-end RAG pipelines, vector databases, ACL permissions, document sync, and agent orchestration.

Production AI systems span six distinct architectural layers:

1. **Application Layer** — Web/mobile frontends and FastAPI backends handling auth, rate limiting, SSE/WebSocket streaming, and session state.
2. **Agent & Orchestration Layer** — ReAct/planner loops, MCP & function tool calling, multi-agent coordination, checkpointed state, and idempotency.
3. **RAG & Knowledge Layer** — Ingestion, semantic chunking, embeddings, vector databases (Pinecone, Weaviate, Qdrant, Milvus, Chroma), hybrid retrieval, and re-ranking.
4. **LLM Layer** — Model routing across proprietary APIs and open-weight models, dynamic LoRA adapters, and inference engines (vLLM, TGI).
5. **Output & Ops Layer** — Schema-validated structured outputs, guardrails, tracing (LangSmith, OpenTelemetry), and cost/latency telemetry.
6. **Data & Infrastructure Layer** — Document lakes, Docker/Kubernetes, cloud GPU clusters (A10, A100, H100), and CI/CD pipelines.

## Four Hard Operational Problems in Enterprise RAG

1. **Incremental Document Synchronization** — Detect edits, replacements, and deletions without full re-indexing or orphaned vector chunks.
2. **Stale Data Prevention** — Prevent outdated pricing, deprecated policies, or superseded revisions from surfacing alongside current records.
3. **Fine-Grained Permission Isolation** — Enforce document-level Access Control Lists (ACLs) at query time before chunks reach the LLM context.
4. **Root-Cause Error Attribution** — Trace and isolate whether an incorrect answer failed in chunking, retrieval, re-ranking, or generation.

## Required Deliverables

Build **production RAG & ReAct agent systems** featuring:

- **Incremental Ingestion & Versioning Pipeline** with content hashes and tombstone deletion of stale vectors.
- **ACL-Filtered Hybrid Retrieval** combining dense vector similarity + keyword/BM25 scoring + cross-encoder re-ranking.
- **Stateful ReAct Agent Orchestrator** with checkpointed execution steps, **idempotency keys** on side-effecting tools, and transactional recovery.
- **End-to-End Observability & Tracing** attributing latency, token cost, and quality failures per pipeline stage.

## Suggested Module Layout

```text
02-system-architecture/
├── README.md
├── verify_rag_agent.py     # Zero-dependency verification harness
├── ingestion/              # Incremental sync, chunking & ACL metadata tagging
├── retrieval/              # Hybrid search, ACL filtering & re-ranking
├── agent/                  # ReAct loop, checkpoint store & idempotency guard
└── tracing/                # Stage-level attribution spans
```

## Verification Harness

Run the zero-dependency Python 3 verification script from the repository root:

```bash
python 02-system-architecture/verify_rag_agent.py
```

### What `verify_rag_agent.py` Verifies

| Check | Description |
| --- | --- |
| **Incremental Sync & Staleness** | Simulates corpus updates and deletions, asserting stale versions and deleted chunks are evicted |
| **ACL Permission Isolation** | Queries across restricted and public user scopes, verifying zero unauthorized chunk leakage |
| **Root-Cause Attribution** | Validates structured trace spans pinpoint failures to `chunking`, `retrieval`, `reranking`, or `generation` |
| **Idempotent Agent Recovery** | Simulates mid-workflow crash and resume, proving committed side-effecting tool calls are never duplicated |
