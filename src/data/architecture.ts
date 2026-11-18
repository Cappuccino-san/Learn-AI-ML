import type { Module3Data } from '@/types/handbook';

export const architectureData: Module3Data = {
  layers: [
    {
      layerNumber: 1,
      id: 'application-layer',
      name: 'Application Layer',
      citation: '[cite: 5]',
      components: [
        'Web App (Next.js / React)',
        'Mobile App',
        'API / Backend (FastAPI)',
        'Web, API, Chat, and App clients',
      ],
      responsibilities: [
        'Manage authentication',
        'Rate limiting',
        'Streaming SSE/WebSocket responses',
        'Request validation and session state',
      ],
      failureModes: [
        'Unbounded request timeouts on long completions',
        'Missing backpressure on SSE streams',
        'Unvalidated client payloads leaking prompt injection',
      ],
      optimizationPatterns: [
        'Token-bucket rate limiting per tenant',
        'Async streaming SSE gateways',
        'Edge-cached static shells with decoupled inference endpoints',
      ],
    },
    {
      layerNumber: 2,
      id: 'agent-orchestration-layer',
      name: 'Agent & Orchestration Layer',
      citation: '[cite: 5]',
      components: [
        'Agent (ReAct / Planner)',
        'Tool Use (Functions / MCP)',
        'Multi-Agent Collaboration',
        'Workflow Orchestration (LangGraph / CrewAI)',
      ],
      responsibilities: [
        'Control execution state',
        'Context window pruning',
        'Tool permissions',
        'Idempotency keys and checkpointed failure recovery',
      ],
      failureModes: [
        'Infinite tool-calling loops exhausting token budgets',
        'Duplicate external API mutations on crash recovery',
        'Context overflow from verbose unpruned tool outputs',
      ],
      optimizationPatterns: [
        'PostgreSQL/Redis stateful step checkpointing',
        'Mandatory idempotency keys on mutating tools',
        'Hard step & token ceilings with deterministic fallbacks',
      ],
    },
    {
      layerNumber: 3,
      id: 'rag-knowledge-layer',
      name: 'RAG & Knowledge Layer',
      citation: '[cite: 5]',
      components: [
        'Document Ingestion (PDF, Docs, Web, DB)',
        'Chunking & Embedding',
        'Vector DB (Pinecone / Weaviate / Qdrant)',
        'Retrieval & Re-ranking',
      ],
      responsibilities: [
        'Handle incremental document updates',
        'Eliminate stale chunks',
        'Enforce user-level ACL permission isolation',
        'Optimize recall and precision',
      ],
      failureModes: [
        'Orphaned embeddings after source deletion',
        'Stale pricing/policy chunks outranking updated records',
        'Cross-tenant ACL data leakage via unfiltered top-k search',
      ],
      optimizationPatterns: [
        'Content-hash CDC sync with tombstoned deletions',
        'Pre-filtering ACL metadata inside vector query',
        'Hybrid BM25 + dense retrieval + cross-encoder re-ranking',
      ],
    },
    {
      layerNumber: 4,
      id: 'llm-layer',
      name: 'LLM Layer',
      citation: '[cite: 5]',
      components: [
        'Proprietary APIs (OpenAI / Claude / Gemini)',
        'Open-Source (Llama, Mistral)',
        'Fine-Tuned Adapters (LoRA)',
        'Inference (vLLM / TGI)',
      ],
      responsibilities: [
        'Route queries across models by complexity/cost',
        'Manage dynamic adapter loading',
        'Optimize token throughput and latency',
      ],
      failureModes: [
        'Routing trivial classification queries to frontier models',
        'Cold-start VRAM stalls when swapping LoRA adapters',
        'Tail-latency spikes without continuous batching',
      ],
      optimizationPatterns: [
        'Complexity-aware semantic router (small vs. frontier)',
        'vLLM PagedAttention + continuous batching + multi-LoRA',
        'AWQ/FP8 quantization with fallback providers',
      ],
    },
    {
      layerNumber: 5,
      id: 'output-ops-layer',
      name: 'Output & Ops Layer',
      citation: '[cite: 5]',
      components: [
        'Responses (Text, JSON, etc.)',
        'Evaluation & Feedback',
        'Logging & Tracing (LangSmith / OpenTelemetry)',
        'Monitoring & Cost Control',
      ],
      responsibilities: [
        'Enforce schema-validated structured outputs',
        'Apply safety guardrails',
        'Attribute errors between retrieval and generation',
        'Track token spend',
      ],
      failureModes: [
        'Malformed JSON breaking downstream parsers',
        'Conflating retrieval misses with LLM hallucinations',
        'Silent token-spend drift from unmonitored prompt bloat',
      ],
      optimizationPatterns: [
        'Constrained JSON decoding + Pydantic retry validation',
        'OpenTelemetry span attribution across RAG vs. LLM stages',
        'Automated LLM-as-a-Judge & faithfulness regression suites',
      ],
    },
    {
      layerNumber: 6,
      id: 'data-infrastructure-layer',
      name: 'Data & Infrastructure Layer',
      citation: '[cite: 6]',
      components: [
        'Data Lake / Documents',
        'Docker / Containers',
        'Kubernetes (Orchestration)',
        'Cloud (AWS / GCP / Azure)',
        'GPU / Inference (A10, A100, H100)',
        'CI/CD (GitHub Actions)',
      ],
      responsibilities: [
        'Automate container rollouts',
        'Manage GPU cluster autoscaling',
        'Version datasets and prompts',
        'Guarantee multi-region high availability',
      ],
      failureModes: [
        'Slow container cold starts during GPU traffic spikes',
        'Unpinned model weights or unversioned prompt regressions',
        'Single-region outages halting production inference',
      ],
      optimizationPatterns: [
        'Pre-warmed GPU node pools (Karpenter/KEDA)',
        'Immutable dataset/prompt/adapter digests in CI/CD',
        'Multi-region active-active gateway routing',
      ],
    },
  ],
  ragHardProblems: [
    {
      number: 1,
      title: 'Incremental Document Synchronization',
      description:
        'How do you detect and sync changes when source documents are edited, replaced, or deleted without re-indexing the entire corpus or leaving orphaned vectors?',
      citation: '[cite: 6]',
    },
    {
      number: 2,
      title: 'Stale Data Prevention',
      description:
        'How do you prevent retrieval from surfacing outdated pricing, deprecated policies, or superseded versions alongside current records?',
      citation: '[cite: 6]',
    },
    {
      number: 3,
      title: 'Fine-Grained Permission Isolation',
      description:
        'How do you enforce strict access control lists (ACLs) at query time so users never retrieve embeddings derived from documents they lack authorization to view?',
      citation: '[cite: 6]',
    },
    {
      number: 4,
      title: 'Root-Cause Error Attribution',
      description:
        'When the system returns an incorrect answer, how does your observability harness isolate whether the failure occurred in document chunking, vector retrieval, re-ranking, or LLM generation?',
      citation: '[cite: 6]',
    },
  ],
  agentReliability: {
    headline: 'Agent Reliability Beyond Tool-Call JSON',
    analysis:
      'A model capable of generating tool-call JSON does not make an agent reliable, and a tool executing without throwing an HTTP error does not guarantee a valid business outcome. If a multi-step agent workflow is interrupted halfway through execution and blindly re-invokes a paid external API or mutates a database record a second time during recovery, switching to a larger foundation model will not fix the bug—only stateful checkpointing, idempotency keys, and transactional recovery design can solve it.',
    pillars: [
      {
        name: 'Stateful Checkpointing',
        description:
          'Persist deterministic step state after every node transition so interrupted multi-step workflows resume from the last committed checkpoint rather than re-running from step zero.',
      },
      {
        name: 'Idempotency Keys',
        description:
          'Attach unique, deterministic idempotency keys to all external tool invocations and database mutations so retries never duplicate paid API calls or side effects.',
      },
      {
        name: 'Transactional Recovery Design',
        description:
          'Design compensating actions, explicit step/token ceilings, and dead-letter recovery paths so partial failures fail safely and recover cleanly.',
      },
    ],
    citation: '[cite: 6]',
  },
  bestPractices: [
    {
      id: 'bp-1',
      text: 'Start with a clear real-world use case',
      citation: '[cite: 7]',
    },
    {
      id: 'bp-2',
      text: 'Use high-quality, domain-relevant data',
      citation: '[cite: 7]',
    },
    {
      id: 'bp-3',
      text: 'Apply grounding (RAG) to reduce hallucinations',
      citation: '[cite: 7]',
    },
    {
      id: 'bp-4',
      text: 'Evaluate systematically with proper metrics',
      citation: '[cite: 7]',
    },
    {
      id: 'bp-5',
      text: 'Implement safety (guardrails, content filters)',
      citation: '[cite: 7]',
    },
    {
      id: 'bp-6',
      text: 'Monitor performance, cost, and quality',
      citation: '[cite: 7]',
    },
    {
      id: 'bp-7',
      text: 'Use caching and model routing for efficiency',
      citation: '[cite: 7]',
    },
    {
      id: 'bp-8',
      text: 'Keep prompts and experiments versioned',
      citation: '[cite: 7]',
    },
    {
      id: 'bp-9',
      text: 'Design for scalability, privacy, and compliance',
      citation: '[cite: 7]',
    },
  ],
  scalabilityStrategies: [
    {
      id: 'scale-out',
      strategy: 'Scale Out',
      tactics: 'Multiple replicas (Kubernetes, autoscaling)',
      citation: '[cite: 7]',
    },
    {
      id: 'scale-up',
      strategy: 'Scale Up',
      tactics: 'Use powerful GPUs (A10, A100, H100)',
      citation: '[cite: 7]',
    },
    {
      id: 'optimize-inference',
      strategy: 'Optimize Inference',
      tactics: 'vLLM, TensorRT, quantization',
      citation: '[cite: 7]',
    },
    {
      id: 'reduce-cost',
      strategy: 'Reduce Cost',
      tactics: 'Semantic caching, routing, smaller models',
      citation: '[cite: 7]',
    },
    {
      id: 'improve-latency',
      strategy: 'Improve Latency',
      tactics: 'Streaming, dynamic batching, async execution',
      citation: '[cite: 7]',
    },
    {
      id: 'high-availability',
      strategy: 'High Availability',
      tactics: 'Multi-region deployment, load balancing',
      citation: '[cite: 7]',
    },
  ],
  ecosystem2026: {
    models: ['GPT-5.6', 'Claude 4.6', 'Gemini 4', 'Llama 4', 'Mistral Large', 'Jev AI'],
    frameworksAndOpenSource: [
      'Python',
      'LangChain',
      'LlamaIndex',
      'LangGraph',
      'CrewAI',
      'FastAPI',
      'Streamlit',
      'OpenWebUI',
      'Ollama',
    ],
    vectorDatabases: ['Pinecone', 'Weaviate', 'Qdrant', 'Milvus', 'Chroma'],
    containersAndOps: ['Docker', 'Kubernetes', 'LangSmith', 'OpenTelemetry'],
    citation: '[cite: 7]',
  },
};
