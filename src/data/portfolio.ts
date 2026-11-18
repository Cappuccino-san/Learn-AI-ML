import type { Module6Data } from '@/types/handbook';

export const portfolioData: Module6Data = {
  milestones: [
    {
      step: 1,
      role: 'LLM Developer',
      years: '0–1 Year',
      phase: 'Learn & Build',
      description:
        'Master Python, Git, Linux, token mechanics, prompt engineering, and ship foundational CLI and web LLM applications.',
      citation: '[cite: 15]',
    },
    {
      step: 2,
      role: 'LLM Engineer',
      years: '1–2 Years',
      phase: 'Ship Real Apps',
      description:
        'Build and deploy containerized RAG pipelines, vector search services, and tool-enabled applications in production.',
      citation: '[cite: 15]',
    },
    {
      step: 3,
      role: 'Senior LLM Engineer',
      years: '2–4 Years',
      phase: 'Design & Scale',
      description:
        'Architect fault-tolerant multi-agent workflows, custom SFT/LoRA/DPO pipelines, evaluation harnesses, and low-latency inference services.',
      citation: '[cite: 15]',
    },
    {
      step: 4,
      role: 'Staff / Lead Engineer',
      years: '4–6 Years',
      phase: 'Own Platforms',
      description:
        'Lead cross-team LLMOps infrastructure, observability standards, safety guardrails, and high-availability GPU serving platforms.',
      citation: '[cite: 15]',
    },
    {
      step: 5,
      role: 'Principal / Architect',
      years: '6+ Years',
      phase: 'Strategy & Impact',
      description:
        'Define enterprise-wide AI architecture, multi-cloud governance, foundation model strategy, and business ROI alignment.',
      citation: '[cite: 15]',
    },
  ],
  portfolioProjects: [
    {
      number: 1,
      id: 'enterprise-pdf-rag',
      title: 'Enterprise PDF / Document Q&A (RAG)',
      architectureAndStack: [
        'FastAPI',
        'Hybrid vector + keyword search (Qdrant / Weaviate)',
        'Cross-encoder re-ranking',
        'Incremental CDC document sync',
      ],
      verificationSummary:
        'Enforce user-level ACL permission filtering, automated staleness eviction, and separate retrieval vs. generation eval metrics.',
      verificationChecklist: [
        {
          id: 'proj-1-acl',
          label:
            'Pre-filter user/tenant ACL metadata inside the vector query before top-k scoring.',
        },
        {
          id: 'proj-1-sync',
          label:
            'Demonstrate incremental content-hash document updates and tombstoned deletions without orphaned chunks.',
        },
        {
          id: 'proj-1-eval',
          label:
            'Report Recall@k and MRR independently from answer faithfulness and citation accuracy.',
        },
      ],
      citation: '[cite: 15]',
    },
    {
      number: 2,
      id: 'ai-research-assistant',
      title: 'AI Research Assistant (Agents + Tools)',
      architectureAndStack: [
        'ReAct planner',
        'MCP tool servers',
        'External web / API search',
        'Persistent PostgreSQL state checkpointing',
      ],
      verificationSummary:
        'Demonstrate idempotent failure recovery so interrupted multi-step runs resume without duplicate paid API calls.',
      verificationChecklist: [
        {
          id: 'proj-2-checkpoint',
          label:
            'Persist every ReAct step and tool response to PostgreSQL keyed by run_id and step_index.',
        },
        {
          id: 'proj-2-idempotency',
          label:
            'Attach deterministic idempotency keys to external API calls and verify zero duplicate side effects on crash replay.',
        },
        {
          id: 'proj-2-budget',
          label:
            'Enforce hard step ceilings, context window pruning, and deterministic fallback summaries on budget exhaustion.',
        },
      ],
      citation: '[cite: 15]',
    },
    {
      number: 3,
      id: 'automated-code-review-agent',
      title: 'Automated Code Review Agent (LLM + GitHub)',
      architectureAndStack: [
        'GitHub Webhooks',
        'Event queue (SQS / PubSub)',
        'AST diff chunking',
        'Structured JSON review annotations',
      ],
      verificationSummary:
        'Track precision/false-positive rates on pull requests, enforce token budgets, and integrate into GitHub Actions CI/CD.',
      verificationChecklist: [
        {
          id: 'proj-3-ast',
          label:
            'Chunk pull-request diffs along AST function/class boundaries rather than arbitrary line counts.',
        },
        {
          id: 'proj-3-schema',
          label:
            'Validate all review comments against a strict Pydantic/JSON schema with severity, file path, and line anchors.',
        },
        {
          id: 'proj-3-precision',
          label:
            'Benchmark comment precision vs. developer dismiss rate across a golden PR regression suite.',
        },
      ],
      citation: '[cite: 15]',
    },
    {
      number: 4,
      id: 'customer-support-chatbot',
      title: 'Customer Support Chatbot (RAG + Guardrails)',
      architectureAndStack: [
        'Streaming FastAPI / Next.js interface',
        'Semantic cache',
        'Policy RAG',
        'Input/output safety guardrails & human handoff',
      ],
      verificationSummary:
        'Measure p95 time-to-first-token (TTFT), hallucination rate, guardrail block accuracy, and cost reduction via caching.',
      verificationChecklist: [
        {
          id: 'proj-4-ttft',
          label:
            'Stream tokens via SSE and verify p95 time-to-first-token (TTFT) under load.',
        },
        {
          id: 'proj-4-guardrails',
          label:
            'Test prompt-injection defenses, PII redaction, and deterministic escalation to human support.',
        },
        {
          id: 'proj-4-cache',
          label:
            'Log semantic cache hit ratio and calculate verified token cost savings per 1,000 conversations.',
        },
      ],
      citation: '[cite: 15]',
    },
    {
      number: 5,
      id: 'multi-agent-task-manager',
      title: 'Multi-Agent Task Manager',
      architectureAndStack: [
        'LangGraph / CrewAI supervisor-worker architecture',
        'Shared state graph',
        'Structured tool validation',
        'OpenTelemetry tracing',
      ],
      verificationSummary:
        'Prevent infinite agent loops, enforce strict step/token ceilings, and log complete trace trees for every sub-agent transition.',
      verificationChecklist: [
        {
          id: 'proj-5-loops',
          label:
            'Detect repeated identical tool invocations and trigger cycle-breaking supervisor intervention.',
        },
        {
          id: 'proj-5-otel',
          label:
            'Emit OpenTelemetry spans linking parent supervisor plans to every worker LLM call and tool execution.',
        },
        {
          id: 'proj-5-validation',
          label:
            'Validate inter-agent handoff payloads with strict typed schemas before state transitions.',
        },
      ],
      citation: '[cite: 15]',
    },
    {
      number: 6,
      id: 'domain-specific-llm',
      title: 'Domain-Specific LLM (Education, Health, Finance)',
      architectureAndStack: [
        'Curated domain dataset',
        'QLoRA / DoRA SFT + DPO alignment',
        'Knowledge distillation into small student model',
        'vLLM serving',
      ],
      verificationSummary:
        'Benchmark zero-shot baseline vs. fine-tuned uplift on a held-out test set and verify zero regression on general reasoning.',
      verificationChecklist: [
        {
          id: 'proj-6-gate',
          label:
            'Complete the 8-question Pre-Training Readiness Gate with a documented non-training baseline.',
        },
        {
          id: 'proj-6-uplift',
          label:
            'Measure exact uplift on an independent held-out domain test set across SFT and DPO stages.',
        },
        {
          id: 'proj-6-regression',
          label:
            'Verify general reasoning retention and measure throughput/cost gains on vLLM vs. the teacher model.',
        },
      ],
      citation: '[cite: 15]',
    },
  ],
  resumeChecklist: [
    {
      id: 'resume-1',
      text: 'Highlight real production LLM projects (RAG, Agents, fine-tuning)',
      citation: '[cite: 16]',
    },
    {
      id: 'resume-2',
      text: 'List core tools and infrastructure (LangChain, LlamaIndex, LangGraph, FastAPI, Docker, Kubernetes, Vector DBs)',
      citation: '[cite: 16]',
    },
    {
      id: 'resume-3',
      text: 'Quantify measurable engineering impact (e.g., "Reduced p95 inference latency by 40% and cut token cost by 55% via semantic caching and QLoRA distillation")',
      citation: '[cite: 16]',
    },
    {
      id: 'resume-4',
      text: 'Include both commercial API and open-weight model experience',
      citation: '[cite: 16]',
    },
    {
      id: 'resume-5',
      text: 'Link a clean GitHub portfolio with working demos and evaluation suites',
      citation: '[cite: 16]',
    },
    {
      id: 'resume-6',
      text: 'Tailor technical depth to the target role track',
      citation: '[cite: 16]',
    },
  ],
  interviewPracticeLoopSteps: ['Explain', 'Design', 'Build', 'Evaluate'],
  interviewDomains: [
    {
      number: 1,
      id: 'interview-llm-fundamentals',
      domain: 'LLM Fundamentals',
      focus: 'Tokenization, attention mechanics, context windows',
      citation: '[cite: 16]',
      practiceLoop: {
        explain:
          'Explain why BPE tokenization splits numbers/rare domain terms unevenly, how self-attention scales quadratically with sequence length, and how KV cache memory grows during autoregressive decoding.',
        design:
          'Design a token budgeting and context-compaction strategy for a multi-turn assistant with a 128k context limit that keeps latency predictable and prevents "lost in the middle" degradation.',
        build:
          'Implement a Python utility using tiktoken/tokenizers that counts prompt, retrieved context, and tool-output tokens and deterministically truncates history while preserving system invariants.',
        evaluate:
          'Measure input/output token inflation, KV cache pressure, and answer accuracy across 4k, 16k, and 64k context sizes on a needle-in-a-haystack benchmark.',
      },
    },
    {
      number: 2,
      id: 'interview-prompt-engineering',
      domain: 'Prompt Engineering',
      focus: 'Structured output optimization',
      citation: '[cite: 16]',
      practiceLoop: {
        explain:
          'Explain the difference between few-shot prompting, chain-of-thought reasoning, and grammar-constrained decoding for guaranteeing valid JSON outputs.',
        design:
          'Design a schema-enforced extraction pipeline using Pydantic models, constrained JSON decoding, and bounded self-correction retries before escalating to a larger model.',
        build:
          'Build a versioned prompt template registry with deterministic test fixtures and a Pydantic validation wrapper that catches schema violations and feeds structured errors back.',
        evaluate:
          'Run a regression suite tracking first-pass schema validity rate, field-level F1 accuracy, and average retry overhead across prompt revisions.',
      },
    },
    {
      number: 3,
      id: 'interview-rag-system-design',
      domain: 'RAG System Design',
      focus: 'Retrieval and chunking trade-offs',
      citation: '[cite: 16]',
      practiceLoop: {
        explain:
          'Explain why fixed-size character chunking breaks tables and legal clauses, how dense embeddings fail on exact SKU/code matches, and why cross-encoder re-ranking improves precision.',
        design:
          'Design an enterprise RAG architecture supporting incremental CDC document sync, stale-record eviction, user-level ACL pre-filtering, and hybrid BM25 + dense retrieval.',
        build:
          'Build an ingestion and retrieval pipeline that hashes document sections, upserts metadata-tagged chunks to Qdrant/Weaviate, and applies a cross-encoder re-ranker over the top-50 candidates.',
        evaluate:
          'Separate retrieval evaluation (Recall@k, MRR, NDCG) from generation evaluation (faithfulness, citation grounding) to pinpoint whether errors occur in search or synthesis.',
      },
    },
    {
      number: 4,
      id: 'interview-fine-tuning-methods',
      domain: 'Fine-Tuning Methods Across Dimensions',
      focus:
        'Full, LoRA, QLoRA, DoRA, Adapters, Prefix Tuning, SFT, RLHF, DPO, Distillation',
      citation: '[cite: 9, 10, 11, 16]',
      practiceLoop: {
        explain:
          'Explain the 3 structural dimensions (Weight Update vs. Training Objective vs. Capability Transfer) and why DPO removes RLHF’s reward model and PPO loop.',
        design:
          'Design an adaptation decision workflow that passes the 6-scenario Diagnostic Gate and 8 Readiness Questions before choosing between RAG, SFT+LoRA, SFT+DPO+QLoRA/DoRA, or Distillation.',
        build:
          'Configure an SFT + LoRA training run with audited train/val/held-out splits, rank/alpha hyperparameters, and an automated adapter merge script for vLLM.',
        evaluate:
          'Compare zero-shot baseline, prompt-engineered baseline, and fine-tuned checkpoints on held-out domain accuracy, general reasoning retention, and cost per 1k tokens.',
      },
    },
    {
      number: 5,
      id: 'interview-evaluation-metrics',
      domain: 'Evaluation Metrics',
      focus:
        'BLEU, ROUGE, retrieval recall/precision, faithfulness, LLM-as-a-Judge',
      citation: '[cite: 16]',
      practiceLoop: {
        explain:
          'Explain why lexical metrics (BLEU, ROUGE) miss semantic correctness on open-ended tasks, and how to mitigate position and verbosity bias in LLM-as-a-Judge evals.',
        design:
          'Design a multi-tier evaluation pyramid combining deterministic unit assertions, retrieval Recall@k/Precision@k, grounded faithfulness checks, and calibrated LLM-as-a-Judge rubrics.',
        build:
          'Implement an automated CI eval runner that scores a golden dataset of 100+ cases on every prompt or retriever change and blocks deployment on regression.',
        evaluate:
          'Measure inter-rater agreement (Cohen’s kappa / Spearman correlation) between your LLM judge and human domain experts to validate judge calibration.',
      },
    },
    {
      number: 6,
      id: 'interview-llmops',
      domain: 'LLMOps',
      focus: 'Deployment, CI/CD, monitoring, autoscaling',
      citation: '[cite: 16]',
      practiceLoop: {
        explain:
          'Explain how vLLM PagedAttention and continuous batching increase GPU throughput, and what signals should trigger Kubernetes autoscaling (queue depth, KV cache utilization, TTFT).',
        design:
          'Design a multi-region inference platform with semantic caching, complexity-based model routing, OpenTelemetry tracing, and blue/green adapter rollouts.',
        build:
          'Containerize a FastAPI + vLLM gateway with Prometheus metrics for TTFT, inter-token latency, token spend per tenant, and automated canary health checks.',
        evaluate:
          'Load-test the deployment to map p50/p95/p99 latency curves under concurrent streaming users and verify failover behavior when a primary model endpoint degrades.',
      },
    },
    {
      number: 7,
      id: 'interview-safety-guardrails',
      domain: 'Safety & Guardrails',
      focus:
        'Bias mitigation, hallucination prevention, prompt injection defense',
      citation: '[cite: 16]',
      practiceLoop: {
        explain:
          'Explain the difference between direct and indirect prompt injection (via retrieved RAG documents or tool outputs) and why system prompts alone cannot enforce security boundaries.',
        design:
          'Design defense-in-depth guardrails: input PII/injection classifiers, strict least-privilege tool schemas, ACL-isolated retrieval, and output policy/hallucination verification.',
        build:
          'Implement a guardrail middleware layer that redacts PII, isolates untrusted retrieved content in structured delimiters, and blocks unauthorized mutating tool calls.',
        evaluate:
          'Execute an automated red-teaming suite covering jailbreaks, indirect RAG injection, and data exfiltration attempts, tracking block precision and false-refusal rate.',
      },
    },
    {
      number: 8,
      id: 'interview-e2e-system-design',
      domain: 'End-to-End LLM System Design',
      focus: 'Architecting complete LLM-powered products',
      citation: '[cite: 2, 16]',
      practiceLoop: {
        explain:
          'Explain how the 6 architecture layers (Application, Agent & Orchestration, RAG & Knowledge, LLM, Output & Ops, Data & Infrastructure) interact to deliver business reliability.',
        design:
          'Design a complete production system from requirements to cloud deployment—covering ACL-safe RAG, idempotent checkpointed agents, observability, latency budgets, and unit economics.',
        build:
          'Build a minimal vertical slice with FastAPI, streaming SSE, PostgreSQL state checkpoints, hybrid vector search, OpenTelemetry spans, and an automated eval suite.',
        evaluate:
          'Present end-to-end SLA compliance (p95 TTFT, error recovery rate, faithfulness score, and cost per resolved task) with clear bottlenecks and next-iteration trade-offs.',
      },
    },
  ],
  continuousLearning: {
    habits: [
      'Read foundational and system papers',
      'Watch and study technical courses',
      'Build and ship real projects',
      'Contribute to open-source communities (fixing issues, improving docs, sharing tools/agents)',
      'Stay focused on solving real problems for real users',
    ],
    communities: [
      'Hugging Face',
      'LangChain',
      'LlamaIndex',
      'OpenWebUI',
      'Ollama',
    ],
    citation: '[cite: 2, 16]',
  },
};
