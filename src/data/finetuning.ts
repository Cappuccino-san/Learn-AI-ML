import type { Module4Data } from '@/types/handbook';

export const finetuningData: Module4Data = {
  structuralDimensions: [
    {
      id: 'A',
      name: 'Parameter Update & Resource Efficiency',
      subtitle: 'How Weights Are Updated',
      methods: [
        'Full Fine-Tuning',
        'LoRA',
        'QLoRA',
        'DoRA',
        'Adapters',
        'Prefix Tuning',
      ],
      citation: '[cite: 9]',
    },
    {
      id: 'B',
      name: 'Training Data, Objectives & Behavioral Alignment',
      subtitle: 'What the Model Learns',
      methods: ['Instruction Tuning (SFT)', 'RLHF', 'DPO'],
      citation: '[cite: 9]',
    },
    {
      id: 'C',
      name: 'Cross-Model Capability Transfer',
      subtitle: 'Deployment Efficiency',
      methods: ['Knowledge Distillation'],
      citation: '[cite: 9]',
    },
  ],
  composabilityNote:
    'Orthogonal methods combine in production (e.g., SFT followed by DPO using QLoRA/DoRA updates, or Distillation into a student model via LoRA). QLoRA is not automatically superior to LoRA, nor DoRA over QLoRA across all workloads; trade-offs between quantization precision, throughput, memory ceiling, and convergence must be validated empirically on your specific model, dataset, and hardware.',
  methods: [
    {
      number: 1,
      id: 'full-ft',
      name: 'Full Fine-Tune',
      shortName: 'Full Fine-Tune',
      dimensionId: 'A',
      dimensionLabel: 'Parameter Update',
      executionPipeline: [
        'Base model',
        'Your dataset',
        'Update every weight',
        'Many GPUs',
        'New full model',
      ],
      trainableParams: '100%',
      costProfile: 'Highest',
      outputArtifact: 'Full model',
      tradeoffs:
        'Maximum adaptation headroom, but heavy GPU memory, compute, optimizer state, and storage cost; poor data can degrade general capabilities.',
      citation: '[cite: 9]',
    },
    {
      number: 2,
      id: 'lora',
      name: 'LoRA (Low-Rank Adaptation)',
      shortName: 'LoRA',
      dimensionId: 'A',
      dimensionLabel: 'Parameter Efficiency (PEFT)',
      executionPipeline: [
        'Freeze base W',
        'Add small A × B matrices',
        'Train only A and B',
        'Merge W + A·B at inference',
        'Tiny adapter file',
      ],
      trainableParams: '<1%',
      costProfile: 'Low',
      outputArtifact: 'Tiny adapter file',
      tradeoffs:
        'Default industry choice; avoids modifying and storing full checkpoints while matching full fine-tuning on many tasks.',
      citation: '[cite: 9]',
    },
    {
      number: 3,
      id: 'qlora',
      name: 'QLoRA (Quantized LoRA)',
      shortName: 'QLoRA',
      dimensionId: 'A',
      dimensionLabel: 'Memory Efficiency (PEFT)',
      executionPipeline: [
        'Base model',
        'Quantize base to 4-bit',
        'Add LoRA adapters',
        'Train adapters',
        'Big model on one GPU',
      ],
      trainableParams: '<1%',
      costProfile: 'Memory: Lowest',
      extraMetric: 'Base: 4-bit',
      outputArtifact: 'Adapter on 4-bit base',
      tradeoffs:
        'Fine-tuned a 65B model on a single 48GB GPU; slight quantization overhead vs. standard 16-bit LoRA.',
      citation: '[cite: 8, 9]',
    },
    {
      number: 4,
      id: 'dora',
      name: 'DoRA (Weight-Decomposed LoRA)',
      shortName: 'DoRA',
      dimensionId: 'A',
      dimensionLabel: 'Parameter Efficiency (PEFT)',
      executionPipeline: [
        'Weight W',
        'Split into magnitude (size) + direction',
        'Apply LoRA on direction',
        'Train magnitude',
        "Recombine W'",
      ],
      trainableParams: '<1%',
      costProfile: 'Low',
      extraMetric: 'Quality: ↑ vs LoRA',
      outputArtifact: 'Recombined adapter',
      tradeoffs:
        'Separates weight magnitude and direction updates to bridge the learning gap between LoRA and full fine-tuning.',
      citation: '[cite: 10]',
    },
    {
      number: 5,
      id: 'adapters',
      name: 'Adapters',
      shortName: 'Adapters',
      dimensionId: 'A',
      dimensionLabel: 'Parameter Efficiency (PEFT)',
      executionPipeline: [
        'Frozen layers',
        'Insert small bottleneck modules inside network',
        'Train modules only',
        'Swap per task',
        'One base, many tasks',
      ],
      trainableParams: '~1–4%',
      costProfile: 'Low',
      outputArtifact: 'Modular plug-ins',
      tradeoffs:
        'Keeps original parameters intact; introduces a small sequential inference latency overhead unless fused.',
      citation: '[cite: 10]',
    },
    {
      number: 6,
      id: 'prefix-tuning',
      name: 'Prefix Tuning',
      shortName: 'Prefix Tuning',
      dimensionId: 'A',
      dimensionLabel: 'Parameter Efficiency (PEFT)',
      executionPipeline: [
        'Freeze the model',
        'Learn virtual token prefixes',
        'Prepend at every attention layer',
        'Train prefix only',
        'Task behaviour',
      ],
      trainableParams: '<0.1%',
      costProfile: 'Lowest',
      outputArtifact: 'Virtual prefix tensors',
      tradeoffs:
        'Steers attention calculations with minimal trainable parameters; less expressive for deep domain shifts.',
      citation: '[cite: 10]',
    },
    {
      number: 7,
      id: 'sft',
      name: 'Instruction Tuning (SFT)',
      shortName: 'SFT',
      dimensionId: 'B',
      dimensionLabel: 'Objective & Data (SFT)',
      executionPipeline: [
        'Many tasks',
        'Rewrite as instructions',
        'Supervised fine-tune (SFT)',
        'Follows new instructions',
        'Assistant-style model',
      ],
      trainableParams: 'Data: Prompt-Answer',
      costProfile: 'Type: SFT',
      outputArtifact: 'First step to chat/assistant',
      tradeoffs:
        'Teaches raw text predictors to follow business instructions, formatting rules, and structured task schemas.',
      citation: '[cite: 10]',
    },
    {
      number: 8,
      id: 'rlhf',
      name: 'RLHF',
      shortName: 'RLHF',
      dimensionId: 'B',
      dimensionLabel: 'Preference Alignment',
      executionPipeline: [
        'SFT model',
        'Humans rank candidate outputs',
        'Train explicit reward model',
        'Optimize policy with PPO',
        'Aligned model',
      ],
      trainableParams: 'Data: Rankings',
      costProfile: 'High',
      extraMetric: 'Needs: Reward model',
      outputArtifact: 'Preference-aligned model',
      tradeoffs:
        'Excels at complex human preference optimization but requires maintaining multiple models and a delicate RL sampling loop.',
      citation: '[cite: 10]',
    },
    {
      number: 9,
      id: 'dpo',
      name: 'DPO (Direct Preference Opt.)',
      shortName: 'DPO',
      dimensionId: 'B',
      dimensionLabel: 'Preference Alignment',
      executionPipeline: [
        'Chosen vs. rejected response pairs',
        'Optimize one simple cross-entropy loss',
        'No reward model',
        'No RL loop',
        'Aligned model',
      ],
      trainableParams: 'Data: Preference pairs',
      costProfile: 'Medium',
      extraMetric: 'Needs: No RL',
      outputArtifact: 'Aligned model',
      tradeoffs:
        'Achieves RLHF-style preference alignment directly from chosen/rejected pairs with substantially simpler training stability.',
      citation: '[cite: 10]',
    },
    {
      number: 10,
      id: 'distillation',
      name: 'Distillation',
      shortName: 'Distillation',
      dimensionId: 'C',
      dimensionLabel: 'Capability Transfer',
      executionPipeline: [
        'Big teacher model',
        'Generate teacher outputs/logits',
        'Student learns them',
        'Smaller + faster model',
        'Cheap to deploy',
      ],
      trainableParams: 'Teacher-Student',
      costProfile: 'Run Cost: ↓',
      extraMetric: 'Speed: ↑↑',
      outputArtifact: 'Compact student model',
      tradeoffs:
        'Slashes production inference latency and GPU serving cost; requires careful evaluation to verify retained capabilities.',
      citation: '[cite: 11]',
    },
  ],
  combinationPresets: [
    {
      id: 'sft-dpo-qlora',
      name: 'SFT + DPO + QLoRA',
      methods: ['Instruction Tuning (SFT)', 'DPO', 'QLoRA'],
      useCase:
        'Single-GPU adaptation of 32B–70B open-weight models for domain instruction following plus tone and safety alignment.',
      vramProfile: '1× 24GB–48GB GPU (4-bit NF4 base + BF16 LoRA adapters)',
      productionNotes:
        'Run SFT first on audited prompt-answer pairs, merge or checkpoint the adapter, then run DPO on chosen/rejected pairs with a frozen reference policy.',
      citation: '[cite: 9, 10, 11]',
    },
    {
      id: 'sft-lora',
      name: 'SFT + LoRA',
      methods: ['Instruction Tuning (SFT)', 'LoRA'],
      useCase:
        'Default production baseline for structured extraction, classification, SQL generation, and multi-tenant adapter serving.',
      vramProfile: '1× 16GB–80GB GPU depending on 8B vs. 32B BF16 base model',
      productionNotes:
        'Avoids 4-bit quantization noise when GPU memory permits; supports hot-swapping multiple task adapters over one base model in vLLM.',
      citation: '[cite: 9, 10]',
    },
    {
      id: 'sft-dpo-dora',
      name: 'SFT + DPO + DoRA',
      methods: ['Instruction Tuning (SFT)', 'DPO', 'DoRA'],
      useCase:
        'High-precision domain specialization and behavioral alignment where standard LoRA exhibits a measurable quality gap vs. full fine-tuning.',
      vramProfile: '1–4× 40GB–80GB GPUs (slightly higher compute overhead than LoRA)',
      productionNotes:
        'Decomposes weight updates into magnitude and direction; benchmark empirically against standard LoRA on your held-out test set before committing.',
      citation: '[cite: 10, 11]',
    },
    {
      id: 'distillation-sft-lora',
      name: 'Distillation + SFT + LoRA',
      methods: ['Distillation', 'Instruction Tuning (SFT)', 'LoRA'],
      useCase:
        'Compressing an accurate but expensive frontier teacher workflow into a fast, low-cost 3B–8B student model for high-QPS production serving.',
      vramProfile: '1× 24GB–40GB GPU for student training; 1× L4/A10G for serving',
      productionNotes:
        'Generate and filter high-quality teacher reasoning traces/outputs, fine-tune the student via SFT + LoRA, merge weights, and serve quantized with vLLM.',
      citation: '[cite: 9, 11]',
    },
  ],
  diagnosticScenarios: [
    {
      id: 'gate-volatile-facts',
      observedProblem: 'Product prices, inventory, or policies change weekly',
      wrongInstinct:
        'Continuously fine-tune the model on updated company documents',
      correctSolutionTitle: 'Data Synchronization + RAG',
      correctSolutionDetails:
        'Build reliable incremental ingestion, metadata filtering, and hybrid retrieval. Never bake volatile facts into model weights.',
      recommendedCategory: 'RAG & Data Sync',
      requiresTraining: false,
      citation: '[cite: 11, 12]',
    },
    {
      id: 'gate-output-formatting',
      observedProblem:
        'Model understands the task, but output JSON or formatting is inconsistent',
      wrongInstinct:
        'Run SFT immediately on hundreds of formatting examples',
      correctSolutionTitle: 'Structured Outputs + Validation + Prompting',
      correctSolutionDetails:
        'Enforce constrained decoding (JSON schema), Pydantic validation with retry loops, and clear few-shot examples first.',
      recommendedCategory: 'Structured Outputs & Prompting',
      requiresTraining: false,
      citation: '[cite: 11, 12]',
    },
    {
      id: 'gate-bad-retrieval',
      observedProblem: 'Retrieval returns irrelevant or outdated context chunks',
      wrongInstinct:
        'Fine-tune the generator LLM to compensate for bad context',
      correctSolutionTitle: 'Fix the Retrieval Pipeline',
      correctSolutionDetails:
        'Improve document parsing, semantic chunking, embedding selection, hybrid BM25 + vector search, and cross-encoder re-ranking.',
      recommendedCategory: 'Retrieval Pipeline',
      requiresTraining: false,
      citation: '[cite: 11, 12]',
    },
    {
      id: 'gate-capability-deficit',
      observedProblem:
        'Systematic capability deficit on a stable task with abundant high-quality examples',
      wrongInstinct:
        'Rely solely on ever-longer system prompts that exhaust the context window',
      correctSolutionTitle:
        'Supervised Fine-Tuning (SFT + LoRA / QLoRA / DoRA)',
      correctSolutionDetails:
        'Train parameter-efficient adapters on curated, deduplicated instruction-response datasets.',
      recommendedCategory: 'SFT + PEFT',
      requiresTraining: true,
      citation: '[cite: 11, 12]',
    },
    {
      id: 'gate-tone-alignment',
      observedProblem:
        'Outputs are factually acceptable but violate tone, style, or nuanced preference criteria',
      wrongInstinct: 'Write dozens of conflicting negative rules in the prompt',
      correctSolutionTitle: 'Preference Alignment (DPO / RLHF)',
      correctSolutionDetails:
        'Collect explicit chosen vs. rejected response pairs and optimize directly with DPO.',
      recommendedCategory: 'Preference Alignment (DPO)',
      requiresTraining: true,
      citation: '[cite: 11, 12]',
    },
    {
      id: 'gate-cost-latency',
      observedProblem:
        'Large model achieves target accuracy, but inference latency and GPU costs are prohibitive',
      wrongInstinct:
        'Downgrade blindly to a small base model that fails the task',
      correctSolutionTitle: 'Knowledge Distillation + Inference Optimization',
      correctSolutionDetails:
        'Distill teacher outputs into a small student model and serve with vLLM, quantization, and semantic caching.',
      recommendedCategory: 'Distillation & Inference Ops',
      requiresTraining: true,
      citation: '[cite: 11, 12]',
    },
  ],
  readinessQuestions: [
    {
      number: 1,
      id: 'readiness-1',
      question: 'Why do we need to train?',
      verificationHint:
        'Document the exact product or operational bottleneck (accuracy, latency, cost, or style) and verify it is not a data freshness or retrieval failure.',
      citation: '[cite: 12]',
    },
    {
      number: 2,
      id: 'readiness-2',
      question: 'What specific deficit does the existing model exhibit?',
      verificationHint:
        'Catalog concrete failure examples by error category rather than subjective impressions.',
      citation: '[cite: 12]',
    },
    {
      number: 3,
      id: 'readiness-3',
      question: 'Must this deficit be solved by altering model parameters?',
      verificationHint:
        'Confirm prompting, constrained JSON decoding, tool use, and hybrid RAG + re-ranking cannot resolve the gap more cheaply.',
      citation: '[cite: 12]',
    },
    {
      number: 4,
      id: 'readiness-4',
      question: 'Do we have a quantified non-training baseline?',
      verificationHint:
        'Record exact precision/recall, pass rate, latency, and cost per 1k requests for the best prompt + RAG baseline.',
      citation: '[cite: 12]',
    },
    {
      number: 5,
      id: 'readiness-5',
      question: 'Is the training data audited for quality and coverage?',
      verificationHint:
        'Verify deduplication, label consistency, schema validity, PII scrubbing, and zero train/test leakage.',
      citation: '[cite: 12]',
    },
    {
      number: 6,
      id: 'readiness-6',
      question: 'Do we have an independent held-out test set?',
      verificationHint:
        'Lock an untouched evaluation split representative of real production distribution before running any training job.',
      citation: '[cite: 12]',
    },
    {
      number: 7,
      id: 'readiness-7',
      question:
        'How much measurable uplift does fine-tuning deliver over the baseline?',
      verificationHint:
        'Measure statistically meaningful improvement on the held-out set across task accuracy, latency, and unit economics.',
      citation: '[cite: 12]',
    },
    {
      number: 8,
      id: 'readiness-8',
      question:
        "Did fine-tuning degrade the model's general-purpose reasoning capabilities, and does the performance gain justify ongoing training and maintenance costs?",
      verificationHint:
        'Run general reasoning, instruction-following, and safety regression suites alongside TCO analysis for hosting custom weights.',
      citation: '[cite: 12]',
    },
  ],
};
