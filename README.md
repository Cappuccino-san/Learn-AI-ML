# AI & LLM Engineering Education Center

Repository: `https://github.com/Cappuccino-san/Learn-AI-ML.git`

An ultra-minimalist, interactive **AI & LLM Engineering Education Center** built on the **AI Engineering Master Resource Handbook**, pairing strongly typed curriculum modules (`src/data/*.ts`) with interactive engineering simulators and runnable verification scaffolds.

> *"An LLM is just one core component of an AI application, not the application itself."* `[cite: 1]`

## Master GitHub Curriculum Structure

| Directory | Core Engineering Focus | Verification & Deliverables |
| --- | --- | --- |
| [`01-foundations/`](./01-foundations/README.md) | Python, Linux, Git, HTTP lifecycle, database state, tokens, context windows, and LLM API calls | CLI and FastAPI web services with token budgeting, retries, and structured error handling |
| [`02-system-architecture/`](./02-system-architecture/README.md) | End-to-end RAG pipelines, vector databases, ACL permissions, document sync, and agent orchestration | Production RAG & ReAct agent systems with idempotent state recovery and tracing |
| [`03-model-adaptation/`](./03-model-adaptation/README.md) | Pre-training diagnostic gate, SFT, LoRA, QLoRA, DoRA, Adapters, Prefix Tuning, RLHF, DPO, Distillation | Baseline benchmarks, independent test sets, adapter training pipelines, and regression suites |
| [`04-cloud-infrastructure/`](./04-cloud-infrastructure/README.md) | Cross-cloud infrastructure across AWS, Azure, and GCP (8 core system jobs, 93 production services) | Containerized deployments (Docker, Kubernetes), GPU serving (vLLM/TGI), and CI/CD workflows |
| [`05-career-and-projects/`](./05-career-and-projects/README.md) | Role tracks, portfolio architectures, evaluation harnesses, resume metrics, and system design interviews | Six end-to-end benchmark projects with latency, cost, recall, and faithfulness metrics |

## Interactive Web Application (`src/`)

- **Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS
- **Global Search:** `Cmd/Ctrl + K` command palette indexing every module, method, diagnostic gate, career role, portfolio project, and all 93 cloud services
- **Simulators:**
  1. **Pre-Training Diagnostic Gate Wizard** + 8 Mandatory Readiness Questions Checklist
  2. **10 Fine-Tuning Methods Explorer & Pipeline Combinator** across Structural Dimensions A, B, and C
  3. **AWS vs. Azure vs. GCP Cross-Cloud Mapper** (8 System Jobs, 24 Sub-Roles, 93 Services)
  4. **Career Role & Portfolio Readiness Tracker** with persistent `localStorage` state
