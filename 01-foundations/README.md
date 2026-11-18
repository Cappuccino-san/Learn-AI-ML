# 01 — Foundations: Core Software Engineering & LLM Mechanics

> *"An LLM is just one core component of an AI application, not the application itself."*

## Core Engineering Focus

Python, Linux, Git, HTTP lifecycle, database state, tokens, context windows, and LLM API calls.

Aspiring engineers often jump straight into agent frameworks and orchestration wrappers while skipping core software engineering fundamentals. Without a solid grasp of HTTP lifecycles, database state, concurrency, and deterministic recovery, production AI systems fail unpredictably under load or mid-request errors.

### Engineering Execution Loop

Every module and service in this repository follows the five-step loop:

```text
Build -> Test -> Measure -> Evaluate -> Iterate
```

## Required Deliverables

Build **CLI and FastAPI web services** with:

1. **Token Budgeting & Context Window Management**
   - Count/estimate prompt, context, and `max_tokens` budgets before calling an LLM provider.
   - Enforce hard context-window ceilings with deterministic truncation or rejection rather than silent provider errors.
2. **Resilient HTTP Lifecycle & Retries**
   - Explicit timeouts (`connect` and `read`), connection pooling, and exponential backoff with jitter.
   - Classify retryable transient failures (`429`, `502`, `503`, `504`, network timeouts) vs. non-retryable client errors (`400`, `401`, `403`, `422`).
3. **Structured Error Handling**
   - Consistent JSON error envelopes carrying `error_code`, `message`, `retryable`, and `request_id` without leaking secrets or stack traces.
4. **Database State & Persistence**
   - Track request status, token spend, and idempotency keys in relational storage (SQLite/PostgreSQL) with atomic transactions.
5. **CLI & FastAPI Entrypoints**
   - Clean command-line tooling alongside an async FastAPI service exposing `/health` and `/v1/complete` endpoints.

## Suggested Module Layout

```text
01-foundations/
├── README.md
├── verify_foundations.py   # Zero-dependency verification harness
├── cli.py                  # Deliverable: token-budgeted CLI client
├── app.py                  # Deliverable: FastAPI service with retries & error envelopes
└── tests/                  # Unit & contract tests
```

## Verification Harness

Run the zero-dependency Python 3 verification script from the repository root:

```bash
python 01-foundations/verify_foundations.py
```

### What `verify_foundations.py` Verifies

| Check | Description |
| --- | --- |
| **Token Budget Accounting** | Ensures prompt + system + reserved completion tokens respect context window ceilings and safety margins |
| **HTTP Retry & Backoff Policy** | Verifies transient vs. terminal HTTP status classification and bounded exponential backoff with jitter |
| **Structured Error Envelope** | Validates required fields (`error_code`, `message`, `retryable`, `request_id`) and secret redaction |
| **Transactional DB State** | Tests atomic SQLite state persistence and duplicate-request idempotency protection |
| **Environment Readiness** | Confirms Python 3 runtime and module documentation presence |
