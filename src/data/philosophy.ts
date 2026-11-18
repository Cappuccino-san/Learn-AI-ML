import type { Module1Data } from '@/types/handbook';

export const philosophyData: Module1Data = {
  title: 'Philosophy & Master GitHub Curriculum',
  subtitle: 'Foundational software engineering discipline for production AI systems',
  coreFailurePattern: {
    summary:
      'Aspiring engineers frequently chase the newest foundation models, agent frameworks, Model Context Protocol (MCP) integrations, and evaluation harnesses—experimenting with LangGraph today, LlamaIndex tomorrow, and multi-agent swarms the day after—while skipping core software engineering fundamentals.',
    details: [
      'Without fundamentals, engineers struggle to explain how HTTP requests flow across services, how database state and concurrency are managed, or how a distributed workflow recovers deterministically after a task fails midway.',
      'Frameworks evolve and tools are replaced within months, whereas requirements analysis, data modeling, system architecture, engineering reliability, performance cost control, and business delivery remain permanent.',
    ],
    citation: '[cite: 1]',
  },
  coreMandate: {
    quote: 'An LLM is just one core component of an AI application, not the application itself.',
    explanation:
      'True growth in LLM Engineering is measured not by certificates earned or frameworks memorized, but by the complexity of real business problems diagnosed, architected, validated, and delivered independently in production.',
    citation: '[cite: 1]',
  },
  executionLoop: ['Build', 'Test', 'Measure', 'Evaluate', 'Iterate'],
  foundationalPrinciples: [
    {
      id: 'execution-loop',
      title: 'Build -> Test -> Measure -> Evaluate -> Iterate',
      summary:
        'Systematic engineering loop applied to every prompt, retrieval change, and model iteration.',
      citation: '[cite: 1]',
    },
    {
      id: 'data-quality',
      title: 'Data Quality Matters',
      summary:
        'Model output quality is bounded by ingestion cleanliness, chunk boundaries, deduplication, and metadata freshness.',
      citation: '[cite: 2]',
    },
    {
      id: 'cost-performance',
      title: 'Cost & Performance',
      summary:
        'Engineer around token budgets, p95 latency, semantic caching, and right-sized model routing from day one.',
      citation: '[cite: 2]',
    },
    {
      id: 'safety-responsible-ai',
      title: 'Safety & Responsible AI',
      summary:
        'Enforce input/output guardrails, ACL isolation, prompt injection defenses, and auditable policy compliance.',
      citation: '[cite: 2]',
    },
    {
      id: 'real-world-use-cases',
      title: 'Real-World Use Cases',
      summary:
        'Anchor every technical architecture decision to measurable business outcomes and verifiable user needs.',
      citation: '[cite: 2]',
    },
  ],
  repoStructure: [
    {
      path: '01-foundations/',
      focus:
        'Python, Linux, Git, HTTP lifecycle, database state, tokens, context windows, and LLM API calls',
      deliverables:
        'CLI and FastAPI web services with token budgeting, retries, and structured error handling',
      citation: '[cite: 1]',
      sampleFiles: [
        '01-foundations/README.md',
        '01-foundations/verify_foundations.py',
        'cli_client.py',
        'fastapi_gateway.py',
      ],
      verificationCommand: 'python 01-foundations/verify_foundations.py',
    },
    {
      path: '02-system-architecture/',
      focus:
        'End-to-end RAG pipelines, vector databases, ACL permissions, document sync, and agent orchestration',
      deliverables:
        'Production RAG & ReAct agent systems with idempotent state recovery and tracing',
      citation: '[cite: 1]',
      sampleFiles: [
        '02-system-architecture/README.md',
        '02-system-architecture/verify_rag_agent.py',
        'rag_pipeline.py',
        'react_checkpoint.py',
      ],
      verificationCommand: 'python 02-system-architecture/verify_rag_agent.py',
    },
    {
      path: '03-model-adaptation/',
      focus:
        'Pre-training diagnostic gate, SFT, LoRA, QLoRA, DoRA, Adapters, Prefix Tuning, RLHF, DPO, Distillation',
      deliverables:
        'Baseline benchmarks, independent test sets, adapter training pipelines, and regression suites',
      citation: '[cite: 1]',
      sampleFiles: [
        '03-model-adaptation/README.md',
        '03-model-adaptation/verify_gate.py',
        'sft_lora_train.py',
        'dpo_align.py',
      ],
      verificationCommand: 'python 03-model-adaptation/verify_gate.py',
    },
    {
      path: '04-cloud-infrastructure/',
      focus:
        'Cross-cloud infrastructure across AWS, Azure, and GCP (8 core system jobs, 93 production services)',
      deliverables:
        'Containerized deployments (Docker, Kubernetes), GPU serving (vLLM/TGI), and CI/CD workflows',
      citation: '[cite: 2]',
      sampleFiles: [
        '04-cloud-infrastructure/README.md',
        '04-cloud-infrastructure/verify_cloud_map.py',
        'Dockerfile.vllm',
        'k8s-serving.yaml',
      ],
      verificationCommand: 'python 04-cloud-infrastructure/verify_cloud_map.py',
    },
    {
      path: '05-career-and-projects/',
      focus:
        'Role tracks, portfolio architectures, evaluation harnesses, resume metrics, and system design interviews',
      deliverables:
        'Six end-to-end benchmark projects with latency, cost, recall, and faithfulness metrics',
      citation: '[cite: 2]',
      sampleFiles: [
        '05-career-and-projects/README.md',
        '05-career-and-projects/verify_portfolio_metrics.py',
        'eval_harness.py',
        'benchmark_report.json',
      ],
      verificationCommand: 'python 05-career-and-projects/verify_portfolio_metrics.py',
    },
  ],
};
