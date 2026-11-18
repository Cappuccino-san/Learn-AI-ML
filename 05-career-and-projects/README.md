# 05 — Career & Projects: Role Tracks, Portfolio Benchmarks & System Design

> *"Hiring decisions depend on real systems built, failures diagnosed, and measurable business outcomes."*

## Core Engineering Focus

Role tracks, portfolio architectures, evaluation harnesses, resume metrics, and system design interviews.

### Operational Career Progression & Role Tracks

- **Progression Milestones:** LLM Developer (0–1 Year) -> LLM Engineer (1–2 Years) -> Senior LLM Engineer (2–4 Years) -> Staff / Lead Engineer (4–6 Years) -> Principal / Architect (6+ Years).
- **8 Specialized Role Tracks:** LLM Engineer, MLE / Model Engineer, AI Platform Engineer, Data Engineer (LLM Data), AI Safety Engineer, Agent Engineer, LLMOps Engineer, AI Solutions Architect.
- **Interview Practice Loop:** Practice every one of the 8 core domains (`LLM Fundamentals`, `Prompt Engineering`, `RAG System Design`, `Fine-Tuning Methods Across Dimensions`, `Evaluation Metrics`, `LLMOps`, `Safety & Guardrails`, `End-to-End LLM System Design`) using:

```text
Explain -> Design -> Build -> Evaluate
```

## Required Deliverables: Six End-to-End Benchmark Projects

Every portfolio project must ship with a reproducible evaluation harness reporting **latency**, **cost**, **recall**, and **faithfulness** metrics:

1. **Enterprise PDF / Document Q&A (RAG)**
   - Hybrid search + cross-encoder re-ranking, incremental document sync, user-level ACL filtering, and separated retrieval vs. generation evals.
2. **AI Research Assistant (Agents + Tools)**
   - ReAct planner, MCP tool servers, persistent PostgreSQL state checkpointing, and idempotent crash recovery without duplicate API calls.
3. **Automated Code Review Agent (LLM + GitHub)**
   - Webhook/queue ingestion, AST diff chunking, structured JSON annotations, PR precision/false-positive tracking, and token budgeting.
4. **Customer Support Chatbot (RAG + Guardrails)**
   - Streaming responses, semantic caching, policy RAG, input/output safety guardrails, p95 TTFT, hallucination rate, and cost savings metrics.
5. **Multi-Agent Task Manager**
   - Supervisor-worker graph, shared state, strict step/token ceilings against infinite loops, and full OpenTelemetry trace trees.
6. **Domain-Specific LLM (Education, Health, Finance)**
   - QLoRA/DoRA SFT + DPO alignment, optional knowledge distillation, vLLM serving, held-out uplift vs. zero-shot baseline, and zero general-reasoning regression.

## Suggested Module Layout

```text
05-career-and-projects/
├── README.md
├── verify_portfolio_metrics.py   # Zero-dependency verification harness
├── benchmarks/                   # Latency, cost, recall & faithfulness eval reports
├── projects/                     # Six benchmark project templates & checklists
└── interview-prep/               # 8-domain Explain -> Design -> Build -> Evaluate notes
```

## Verification Harness

Run the zero-dependency Python 3 verification script from the repository root:

```bash
python 05-career-and-projects/verify_portfolio_metrics.py
```

### What `verify_portfolio_metrics.py` Verifies

| Check | Description |
| --- | --- |
| **Six Portfolio Projects Coverage** | Verifies all 6 benchmark projects define required architecture components and verification checklists |
| **Benchmark Metric Thresholds** | Validates latency (`p95 TTFT`), cost per 1k requests, retrieval `Recall@k`, and `faithfulness` gates |
| **Resume Engineering Checklist** | Confirms quantified impact metrics (latency/cost/quality deltas) rather than unmeasured tool lists |
| **Interview Loop Completeness** | Verifies all 8 interview domains include `Explain`, `Design`, `Build`, and `Evaluate` criteria |
