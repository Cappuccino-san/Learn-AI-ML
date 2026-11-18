import type { Module2Data } from '@/types/handbook';

export const careerData: Module2Data = {
  progressionPrinciple:
    'Time spent working does not automatically advance an engineer; progression is earned by starting with a concrete business need, building a working system, uncovering knowledge gaps through real failure modes, and solving increasingly complex problems independently across four progressive tiers.',
  skillsPyramid: [
    {
      tier: 1,
      stage: 'Beginner',
      years: '0–1 Year',
      citation: '[cite: 3]',
      competencies: [
        'Python Programming Fundamentals',
        'AI/LLM Basics (Tokens, Context Windows, Attention)',
        'Using LLMs (ChatGPT, Claude, Gemini, etc.)',
        'Prompt Engineering (Basics)',
        'Building Simple LLM Apps (CLI / Web)',
        'Git, Linux & Development Basics',
      ],
      engineeringFocus:
        'Understand how models are invoked via APIs, how tokenization and context window limits affect application state, and how programs interact reliably with external systems.',
    },
    {
      tier: 2,
      stage: 'Intermediate',
      years: '1–2 Years',
      citation: '[cite: 3]',
      competencies: [
        'Working with LLM APIs (OpenAI, Claude, etc.)',
        'Advanced Prompt Engineering & Structured Outputs',
        'Embeddings & Vector Databases',
        'Building RAG Applications',
        'Basic Model Fine-Tuning',
        'Deploying LLM Apps (Docker, Cloud)',
      ],
      engineeringFocus:
        'Move beyond single prompt-response calls to grounding models with external enterprise knowledge, containerizing services, and integrating AI capabilities into production backends.',
    },
    {
      tier: 3,
      stage: 'Advanced',
      years: '2–5 Years',
      citation: '[cite: 3]',
      competencies: [
        'RAG & Agentic Systems (Tool Calling, MCP)',
        'Model Fine-Tuning (SFT, LoRA, DPO)',
        'LLM Evaluation & Benchmarking',
        'LLMOps (CI/CD, Monitoring, Tracing)',
        'Scalable Inference & Optimization',
        'Data Pipelines & Vector Search',
      ],
      engineeringFocus:
        'Manage complex agent execution state, context lifecycles, user permissions, idempotent exception recovery, quantitative evaluation harnesses, and low-latency inference pipelines.',
    },
    {
      tier: 4,
      stage: 'Expert',
      years: '5+ Years',
      citation: '[cite: 3]',
      competencies: [
        'Designing LLM Platforms at Scale',
        'Training / Fine-Tuning Foundation Models',
        'Multi-Agent & Autonomous Systems',
        'LLM Evaluation, Safety & Alignment',
        'Production at Enterprise Scale',
        'Leading LLM Strategy & Architecture',
      ],
      engineeringFocus:
        'Architect organization-wide AI platforms, govern safety and alignment, optimize multi-region GPU infrastructure, and align technical trade-offs with enterprise ROI.',
    },
  ],
  fdeCallout: {
    title: 'Forward Deployed Engineers (FDEs)',
    description:
      'Focus deeply on RAG, Agents, APIs, databases, system integration, deployment, and evaluation to deliver working enterprise systems without needing to become CUDA kernel experts first.',
    citation: '[cite: 3]',
  },
  universalCompetencies: [
    'Python',
    'LLMs',
    'Prompting',
    'RAG',
    'Agents',
    'Vector Databases',
    'Cloud Infrastructure',
    'MLOps',
    'Evaluation',
    'AI Safety',
  ],
  careerRoles: [
    {
      id: 'llm-engineer',
      role: 'LLM Engineer',
      citation: '[cite: 4]',
      responsibilities: [
        'Build end-to-end LLM applications',
        'Integrate LLM APIs and models',
        'Implement prompting, RAG, and agents',
        'Deploy and scale in production',
      ],
      deliverables: [
        'Production AI web/API backends',
        'RAG services',
        'Interactive agent workflows',
      ],
    },
    {
      id: 'mle-model-engineer',
      role: 'MLE / Model Engineer',
      citation: '[cite: 4]',
      responsibilities: [
        'Fine-tune and adapt models',
        'Train domain-specific LLMs',
        'Run model evaluation and alignment',
        'Improve generation quality and efficiency',
      ],
      deliverables: [
        'Custom SFT/LoRA/DPO checkpoints',
        'Distilled models',
        'Alignment benchmarks',
      ],
    },
    {
      id: 'ai-platform-engineer',
      role: 'AI Platform Engineer',
      citation: '[cite: 4]',
      responsibilities: [
        'Build internal LLM platforms (LLMOps)',
        'Manage model serving and inference',
        'Architect scalable, reliable pipelines',
        'Enforce observability and cost control',
      ],
      deliverables: [
        'High-throughput vLLM/TGI clusters',
        'Model gateways',
        'Cost governance systems',
      ],
    },
    {
      id: 'data-engineer-llm',
      role: 'Data Engineer (LLM Data)',
      citation: '[cite: 4]',
      responsibilities: [
        'Build automated data pipelines',
        'Clean, chunk, and curate unstructured data',
        'Create high-quality training/eval datasets',
        'Manage vector data and embeddings',
      ],
      deliverables: [
        'Incremental document sync pipelines',
        'Curated SFT/preference datasets',
        'Vector indices',
      ],
    },
    {
      id: 'ai-safety-engineer',
      role: 'AI Safety Engineer',
      citation: '[cite: 4]',
      responsibilities: [
        'Evaluate model risks and biases',
        'Conduct red teaming and build guardrails',
        'Implement content moderation',
        'Ensure alignment and regulatory compliance (AI laws, policies)',
      ],
      deliverables: [
        'Input/output guardrail filters',
        'Automated red-teaming suites',
        'Compliance audit logs',
      ],
    },
    {
      id: 'agent-engineer',
      role: 'Agent Engineer',
      citation: '[cite: 4]',
      responsibilities: [
        'Build autonomous agents',
        'Implement tool use and function calling (MCP)',
        'Orchestrate multi-agent collaboration',
        'Design planning, memory, and reasoning loops',
      ],
      deliverables: [
        'Stateful multi-step agent orchestrators with deterministic fallback and recovery',
      ],
    },
    {
      id: 'llmops-engineer',
      role: 'LLMOps Engineer',
      citation: '[cite: 4]',
      responsibilities: [
        'Manage CI/CD for LLM applications',
        'Oversee model versioning and rollout',
        'Maintain monitoring, logging, and automated evals',
        'Optimize cost, latency, and reliability',
      ],
      deliverables: [
        'Continuous evaluation pipelines',
        'Prompt/model registries',
        'Telemetry dashboards',
      ],
    },
    {
      id: 'ai-solutions-architect',
      role: 'AI Solutions Architect',
      citation: '[cite: 4]',
      responsibilities: [
        'Design end-to-end enterprise AI systems',
        'Select optimal models and tools',
        'Ensure scalability, security, and ROI',
        'Align AI architecture with business goals',
      ],
      deliverables: [
        'Enterprise system blueprints',
        'Security/ACL models',
        'Hybrid cloud architectures',
      ],
    },
  ],
  certificationsNote:
    'Certifications validate baseline knowledge, while hiring decisions depend on real systems built, complex failures diagnosed, and measurable business outcomes delivered.',
  certifications: [
    {
      id: 'huggingface-llm-course',
      tierLabel: 'Beginner',
      years: '0–1 Year',
      name: 'Hugging Face LLM Course & Certifications',
      focus:
        'Hands-on practice with open-source LLMs, fine-tuning, evaluation, and deployment; ideal for beginners and builders establishing practical intuition.',
      citation: '[cite: 5]',
    },
    {
      id: 'azure-ai-102',
      tierLabel: 'Intermediate',
      years: '1–2 Years',
      name: 'Microsoft Azure AI Engineer Associate (AI-102)',
      focus:
        'Building AI solutions with Azure OpenAI, RAG, vector search, and orchestration for real-world enterprise applications.',
      citation: '[cite: 5]',
    },
    {
      id: 'aws-genai-specialty',
      tierLabel: 'Advanced',
      years: '2–5 Years',
      name: 'AWS Generative AI Specialty',
      focus:
        'Designing, building, and scaling GenAI applications using Amazon Bedrock, SageMaker, and enterprise cloud infrastructure.',
      citation: '[cite: 5]',
    },
    {
      id: 'gcp-genai-professional',
      tierLabel: 'Expert',
      years: '5+ Years',
      name: 'Google Cloud Generative AI Professional',
      focus:
        'Architecting and deploying production-grade GenAI solutions, RAG pipelines, multi-agent systems, and scalable enterprise platforms.',
      citation: '[cite: 5]',
    },
  ],
};
