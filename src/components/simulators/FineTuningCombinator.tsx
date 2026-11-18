'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Layers,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { finetuningData } from '@/data/finetuning';
import type {
  FineTuningMethodSpec,
  PipelineCombinationPreset,
  StructuralDimensionId,
} from '@/types/handbook';

type DimensionFilter = 'ALL' | StructuralDimensionId;
type ObjectiveChoice = 'sft' | 'dpo' | 'rlhf' | 'sft-dpo';
type WeightMethodChoice =
  | 'lora'
  | 'qlora'
  | 'dora'
  | 'full-ft'
  | 'adapters'
  | 'prefix-tuning';

const OBJECTIVE_OPTIONS: Array<{
  id: ObjectiveChoice;
  label: string;
  subtitle: string;
}> = [
  { id: 'sft', label: 'SFT', subtitle: 'Instruction Tuning' },
  { id: 'dpo', label: 'DPO', subtitle: 'Direct Preference Opt.' },
  { id: 'rlhf', label: 'RLHF', subtitle: 'Reward Model + PPO' },
  { id: 'sft-dpo', label: 'SFT → DPO', subtitle: '2-Stage Align' },
];

const WEIGHT_METHOD_OPTIONS: Array<{
  id: WeightMethodChoice;
  label: string;
  isPeft: boolean;
}> = [
  { id: 'lora', label: 'LoRA', isPeft: true },
  { id: 'qlora', label: 'QLoRA', isPeft: true },
  { id: 'dora', label: 'DoRA', isPeft: true },
  { id: 'full-ft', label: 'Full Fine-Tune', isPeft: false },
  { id: 'adapters', label: 'Adapters', isPeft: true },
  { id: 'prefix-tuning', label: 'Prefix Tuning', isPeft: true },
];

function matchPreset(
  objective: ObjectiveChoice,
  weightMethod: WeightMethodChoice,
  includeDistillation: boolean
): PipelineCombinationPreset | null {
  if (
    objective === 'sft-dpo' &&
    weightMethod === 'qlora' &&
    !includeDistillation
  ) {
    return (
      finetuningData.combinationPresets.find((p) => p.id === 'sft-dpo-qlora') ??
      null
    );
  }
  if (objective === 'sft' && weightMethod === 'lora' && !includeDistillation) {
    return (
      finetuningData.combinationPresets.find((p) => p.id === 'sft-lora') ?? null
    );
  }
  if (
    objective === 'sft-dpo' &&
    weightMethod === 'dora' &&
    !includeDistillation
  ) {
    return (
      finetuningData.combinationPresets.find((p) => p.id === 'sft-dpo-dora') ??
      null
    );
  }
  if (objective === 'sft' && weightMethod === 'lora' && includeDistillation) {
    return (
      finetuningData.combinationPresets.find(
        (p) => p.id === 'distillation-sft-lora'
      ) ?? null
    );
  }
  return null;
}

export function FineTuningCombinator() {
  // Explorer state
  const [dimensionFilter, setDimensionFilter] =
    useState<DimensionFilter>('ALL');
  const [keyword, setKeyword] = useState('');

  // Composer state
  const [objective, setObjective] = useState<ObjectiveChoice>('sft-dpo');
  const [weightMethod, setWeightMethod] = useState<WeightMethodChoice>('qlora');
  const [includeDistillation, setIncludeDistillation] = useState(false);
  const [multiAdapterServing, setMultiAdapterServing] = useState(false);

  const methodById = useMemo(() => {
    const map = new Map<string, FineTuningMethodSpec>();
    for (const m of finetuningData.methods) {
      map.set(m.id, m);
    }
    return map;
  }, []);

  const filteredMethods = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return finetuningData.methods.filter((method) => {
      if (dimensionFilter !== 'ALL' && method.dimensionId !== dimensionFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        method.name,
        method.shortName,
        method.dimensionLabel,
        method.trainableParams,
        method.costProfile,
        method.outputArtifact,
        method.tradeoffs,
        ...method.executionPipeline,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [dimensionFilter, keyword]);

  const activePreset = useMemo(
    () => matchPreset(objective, weightMethod, includeDistillation),
    [objective, weightMethod, includeDistillation]
  );

  const selectedWeightSpec = methodById.get(weightMethod);
  const isFullFineTune = weightMethod === 'full-ft';

  const composed = useMemo(() => {
    const steps: string[] = [];

    if (includeDistillation) {
      steps.push(
        'Dimension C · Distillation: Generate and filter high-quality teacher reasoning traces / logits for a smaller student model.'
      );
    }

    if (weightMethod === 'qlora') {
      steps.push(
        'Dimension A · QLoRA Prep: Load base model quantized to 4-bit NF4 and freeze base weights.'
      );
    } else if (weightMethod === 'lora') {
      steps.push(
        'Dimension A · LoRA Prep: Freeze base matrix W and attach trainable low-rank A × B adapter matrices.'
      );
    } else if (weightMethod === 'dora') {
      steps.push(
        'Dimension A · DoRA Prep: Decompose weights W into magnitude + direction; apply LoRA on direction and train magnitude.'
      );
    } else if (weightMethod === 'adapters') {
      steps.push(
        'Dimension A · Adapters Prep: Freeze transformer layers and insert trainable bottleneck modules inside the network.'
      );
    } else if (weightMethod === 'prefix-tuning') {
      steps.push(
        'Dimension A · Prefix Tuning Prep: Freeze model weights and prepend learnable virtual prefix tensors at every attention layer.'
      );
    } else {
      steps.push(
        'Dimension A · Full Fine-Tune Prep: Allocate optimizer states and gradients across 100% of base model parameters.'
      );
    }

    if (objective === 'sft') {
      steps.push(
        'Dimension B · SFT Stage: Train on audited, deduplicated prompt-answer instruction pairs.'
      );
    } else if (objective === 'dpo') {
      steps.push(
        'Dimension B · DPO Stage: Optimize cross-entropy preference loss directly over chosen vs. rejected response pairs (no reward model or RL loop).'
      );
    } else if (objective === 'rlhf') {
      steps.push(
        'Dimension B · RLHF Stage: Collect human output rankings, train an explicit reward model, and optimize policy with PPO.'
      );
    } else {
      steps.push(
        'Dimension B · Stage 1 (SFT): Teach task instructions and output format on audited prompt-answer pairs.'
      );
      steps.push(
        'Dimension B · Stage 2 (DPO): Checkpoint/merge SFT state, then align tone and preference on chosen vs. rejected pairs against a frozen reference policy.'
      );
    }

    if (multiAdapterServing && !isFullFineTune) {
      steps.push(
        'Serving · Multi-Tenant Adapter Routing: Serve one shared frozen base model and hot-swap task adapters per request.'
      );
    } else if (weightMethod === 'lora' || weightMethod === 'dora') {
      steps.push(
        'Serving · Export: Keep modular adapter or merge W + A·B into serving weights (e.g., vLLM).'
      );
    } else if (weightMethod === 'full-ft') {
      steps.push(
        'Serving · Export: Publish new full-weight checkpoint and run general reasoning regression checks.'
      );
    } else {
      steps.push(
        `Serving · Export: Package ${selectedWeightSpec?.outputArtifact.toLowerCase() ?? 'artifact'} for benchmarked inference.`
      );
    }

    // VRAM / Cost estimation
    let vramProfile = '';
    if (activePreset) {
      vramProfile = activePreset.vramProfile;
    } else if (weightMethod === 'full-ft') {
      vramProfile =
        objective === 'rlhf'
          ? 'Multi-node 8×80GB GPUs (full weights + reward/critic/reference models)'
          : '4–8× 80GB GPUs (100% weights + optimizer states & gradients)';
    } else if (weightMethod === 'qlora') {
      vramProfile =
        objective === 'rlhf'
          ? '1–2× 48GB–80GB GPUs (4-bit base + reward model overhead)'
          : '1× 24GB–48GB GPU (4-bit NF4 base + BF16 adapters)';
    } else if (weightMethod === 'prefix-tuning') {
      vramProfile = '1× 16GB–24GB GPU (<0.1% trainable virtual prefix tensors)';
    } else if (weightMethod === 'dora') {
      vramProfile =
        objective === 'rlhf'
          ? '2–4× 80GB GPUs (DoRA compute + PPO reward/policy loop)'
          : '1–4× 40GB–80GB GPUs (slightly higher compute overhead than LoRA)';
    } else {
      vramProfile =
        objective === 'rlhf'
          ? '2–4× 80GB GPUs (PEFT policy + reward model + PPO sampling)'
          : '1× 16GB–80GB GPU depending on 8B vs. 32B BF16 base model';
    }

    // Output artifact
    let artifact = selectedWeightSpec?.outputArtifact ?? 'Trained artifact';
    if (includeDistillation && !isFullFineTune) {
      artifact = `Compact student model + ${selectedWeightSpec?.shortName ?? 'PEFT'} adapter`;
    } else if (includeDistillation && isFullFineTune) {
      artifact = 'Full-weight compact student checkpoint';
    } else if (objective === 'sft-dpo' && !isFullFineTune) {
      artifact = `SFT + DPO aligned ${selectedWeightSpec?.shortName ?? 'PEFT'} adapter`;
    }

    // Contextual empirical / compatibility warnings
    const warnings: string[] = [];
    if (weightMethod === 'qlora') {
      warnings.push(
        'QLoRA vs. LoRA: 4-bit quantization slashes VRAM so large models fit on one GPU, but adds slight quantization/dequantization overhead. Benchmark against 16-bit LoRA if GPU memory permits.'
      );
    }
    if (weightMethod === 'dora') {
      warnings.push(
        'DoRA vs. LoRA: Weight decomposition can narrow the quality gap vs. full fine-tuning, at slightly higher compute cost—validate empirically on your held-out test set.'
      );
    }
    if (objective === 'rlhf') {
      warnings.push(
        'RLHF vs. DPO: RLHF requires training an explicit reward model and tuning a delicate PPO loop. Prefer DPO unless your task explicitly requires online reward modeling.'
      );
    }
    if (weightMethod === 'full-ft') {
      warnings.push(
        'Full Fine-Tune Caution: Highest GPU memory and storage footprint; poor or narrow data can degrade general reasoning capabilities. Cannot be combined simultaneously with a PEFT adapter in the same pass.'
      );
    }
    if (weightMethod === 'adapters') {
      warnings.push(
        'Adapters Latency Note: Sequential bottleneck layers introduce small inference latency overhead unless fused.'
      );
    }
    if (weightMethod === 'prefix-tuning') {
      warnings.push(
        'Prefix Tuning Expressiveness: Minimal parameters (<0.1%), but less expressive for deep domain knowledge shifts or complex preference alignment.'
      );
    }
    if (includeDistillation) {
      warnings.push(
        'Distillation Verification: Audit teacher outputs before training and verify student retention on held-out accuracy alongside latency/cost gains.'
      );
    }

    const labelParts: string[] = [];
    if (includeDistillation) labelParts.push('Distillation');
    labelParts.push(
      objective === 'sft-dpo' ? 'SFT + DPO' : objective.toUpperCase()
    );
    labelParts.push(selectedWeightSpec?.shortName ?? weightMethod);

    return {
      formula: labelParts.join(' + '),
      steps,
      trainableParams: selectedWeightSpec?.trainableParams ?? '<1%',
      vramProfile,
      artifact,
      warnings,
    };
  }, [
    activePreset,
    includeDistillation,
    isFullFineTune,
    multiAdapterServing,
    objective,
    selectedWeightSpec,
    weightMethod,
  ]);

  const applyPreset = (presetId: string) => {
    if (presetId === 'sft-dpo-qlora') {
      setObjective('sft-dpo');
      setWeightMethod('qlora');
      setIncludeDistillation(false);
    } else if (presetId === 'sft-lora') {
      setObjective('sft');
      setWeightMethod('lora');
      setIncludeDistillation(false);
    } else if (presetId === 'sft-dpo-dora') {
      setObjective('sft-dpo');
      setWeightMethod('dora');
      setIncludeDistillation(false);
    } else if (presetId === 'distillation-sft-lora') {
      setObjective('sft');
      setWeightMethod('lora');
      setIncludeDistillation(true);
    }
  };

  const applyMethodFromExplorer = (method: FineTuningMethodSpec) => {
    if (method.dimensionId === 'A') {
      if (method.id === 'full-ft' && multiAdapterServing) {
        return;
      }
      setWeightMethod(method.id as WeightMethodChoice);
    } else if (method.dimensionId === 'B') {
      if (method.id === 'sft' || method.id === 'dpo' || method.id === 'rlhf') {
        setObjective(method.id);
      }
    } else if (method.dimensionId === 'C') {
      setIncludeDistillation((prev) => !prev);
    }
  };

  const isMethodActiveInComposer = (method: FineTuningMethodSpec) => {
    if (method.dimensionId === 'A') return weightMethod === method.id;
    if (method.dimensionId === 'B') {
      if (objective === 'sft-dpo') {
        return method.id === 'sft' || method.id === 'dpo';
      }
      return objective === method.id;
    }
    return includeDistillation && method.id === 'distillation';
  };

  const resetExplorerFilters = () => {
    setDimensionFilter('ALL');
    setKeyword('');
  };

  return (
    <div className="space-y-8">
      {/* Part 1: 10 Methods Explorer */}
      <section
        aria-label="Fine-Tuning Methods Explorer"
        className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-subtle sm:p-6"
      >
        <div className="flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded border border-border bg-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-ink-secondary">
                10 METHODS EXPLORER
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                [cite: 8, 9, 10, 11]
              </span>
            </div>
            <h3 className="mt-1.5 text-base font-semibold tracking-tight text-ink-primary">
              Fine-Tuning Taxonomy Across 3 Structural Dimensions
            </h3>
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Filter by method, artifact, or tradeoff..."
              aria-label="Filter fine-tuning methods"
              className="w-full rounded-lg border border-border bg-canvas py-1.5 pl-8 pr-8 text-xs text-ink-primary placeholder:text-ink-muted transition-colors focus:border-border-strong focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/10"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                aria-label="Clear method search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:bg-subtle hover:text-ink-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Dimension Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'ALL', label: 'All Dimensions (10)' },
                { id: 'A', label: 'A · Parameter Efficiency (6)' },
                { id: 'B', label: 'B · Alignment & Objectives (3)' },
                { id: 'C', label: 'C · Capability Transfer (1)' },
              ] as const
            ).map((pill) => {
              const active = dimensionFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setDimensionFilter(pill.id)}
                  aria-pressed={active}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors active:scale-[0.98] ${
                    active
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-border bg-canvas text-ink-secondary hover:border-border-strong hover:bg-surface'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
          <span className="font-mono text-xs text-ink-muted">
            Showing {filteredMethods.length} / {finetuningData.methods.length}
          </span>
        </div>

        {/* Methods Grid or Empty State */}
        {filteredMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-canvas px-4 py-10 text-center">
            <SlidersHorizontal
              className="h-5 w-5 text-ink-muted"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-medium text-ink-primary">
              No fine-tuning methods match your filters
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Clear the keyword search or reset dimension selection to inspect
              all 10 methods.
            </p>
            <button
              type="button"
              onClick={resetExplorerFilters}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-3 py-1.5 text-xs font-medium text-ink-primary shadow-subtle hover:bg-subtle active:scale-[0.99]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filteredMethods.map((method) => {
              const inComposer = isMethodActiveInComposer(method);
              const blockedByMultiAdapter =
                method.id === 'full-ft' && multiAdapterServing;
              return (
                <article
                  key={method.id}
                  className={`flex flex-col justify-between rounded-lg border p-4 transition-colors ${
                    inComposer
                      ? 'border-accent bg-canvas'
                      : 'border-border bg-surface hover:border-border-strong'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[11px] font-semibold text-ink-muted">
                            #{String(method.number).padStart(2, '0')}
                          </span>
                          <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-secondary">
                            Dim {method.dimensionId} · {method.dimensionLabel}
                          </span>
                          <span className="font-mono text-[10px] text-ink-muted">
                            {method.citation}
                          </span>
                        </div>
                        <h4 className="mt-1 text-sm font-semibold text-ink-primary">
                          {method.name}
                        </h4>
                      </div>

                      <button
                        type="button"
                        disabled={blockedByMultiAdapter}
                        onClick={() => applyMethodFromExplorer(method)}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 ${
                          inComposer
                            ? 'border-accent bg-accent text-accent-ink'
                            : 'border-border bg-surface text-ink-secondary hover:bg-subtle'
                        }`}
                      >
                        {inComposer && (
                          <Check className="h-3 w-3" aria-hidden="true" />
                        )}
                        {inComposer ? 'In Composer' : 'Use in Composer'}
                      </button>
                    </div>

                    {/* Execution Pipeline Flow */}
                    <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-canvas px-2.5 py-2">
                      {method.executionPipeline.map((step, idx) => (
                        <React.Fragment key={`${method.id}-step-${idx}`}>
                          <span className="font-mono text-[11px] text-ink-secondary">
                            {step}
                          </span>
                          {idx < method.executionPipeline.length - 1 && (
                            <ArrowRight
                              className="h-3 w-3 shrink-0 text-ink-muted"
                              aria-hidden="true"
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <p className="text-xs leading-relaxed text-ink-secondary">
                      {method.tradeoffs}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/80 pt-2.5 font-mono text-[11px] text-ink-secondary">
                    <span className="rounded border border-border/60 bg-subtle px-1.5 py-0.5 text-ink-primary">
                      Params: {method.trainableParams}
                    </span>
                    <span className="rounded border border-border/60 bg-subtle px-1.5 py-0.5 text-ink-primary">
                      Cost: {method.costProfile}
                    </span>
                    {method.extraMetric && (
                      <span className="rounded border border-border/60 bg-subtle px-1.5 py-0.5 text-ink-primary">
                        {method.extraMetric}
                      </span>
                    )}
                    <span className="ml-auto text-ink-muted">
                      Output: {method.outputArtifact}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Part 2: Interactive Pipeline Composer */}
      <section
        aria-label="Pipeline Composer"
        className="space-y-5 rounded-xl border border-border bg-surface p-5 shadow-subtle sm:p-6"
      >
        <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded border border-border bg-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-ink-secondary">
                PIPELINE COMPOSER
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                [cite: 9, 10, 11]
              </span>
            </div>
            <h3 className="mt-1.5 text-base font-semibold tracking-tight text-ink-primary">
              Compose Orthogonal Fine-Tuning Dimensions
            </h3>
            <p className="mt-0.5 text-xs text-ink-secondary">
              Combine Dimension B (what the model learns), Dimension A (how
              weights update), and optional Dimension C (distillation).
            </p>
          </div>
        </div>

        {/* 1-Click Production Presets */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            1-Click Production Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {finetuningData.combinationPresets.map((preset) => {
              const isActive = activePreset?.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.98] ${
                    isActive
                      ? 'border-accent bg-accent text-accent-ink shadow-subtle'
                      : 'border-border bg-canvas text-ink-primary hover:border-border-strong hover:bg-surface'
                  }`}
                >
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Dimension Selectors */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Dim B */}
          <div className="space-y-2.5 rounded-lg border border-border bg-canvas p-3.5">
            <div>
              <span className="font-mono text-[11px] font-semibold text-ink-muted">
                DIMENSION B · OBJECTIVE
              </span>
              <p className="text-xs text-ink-secondary">Select 1 learning objective</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {OBJECTIVE_OPTIONS.map((opt) => {
                const active = objective === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setObjective(opt.id)}
                    aria-pressed={active}
                    className={`rounded-md border px-2.5 py-2 text-left transition-all active:scale-[0.98] ${
                      active
                        ? 'border-accent bg-accent text-accent-ink'
                        : 'border-border bg-surface text-ink-primary hover:border-border-strong'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div
                      className={`text-[10px] ${
                        active ? 'text-accent-ink/75' : 'text-ink-muted'
                      }`}
                    >
                      {opt.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dim A */}
          <div className="space-y-2.5 rounded-lg border border-border bg-canvas p-3.5">
            <div>
              <span className="font-mono text-[11px] font-semibold text-ink-muted">
                DIMENSION A · WEIGHT UPDATE
              </span>
              <p className="text-xs text-ink-secondary">
                Select 1 parameter update strategy
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {WEIGHT_METHOD_OPTIONS.map((opt) => {
                const active = weightMethod === opt.id;
                const isDisabled = opt.id === 'full-ft' && multiAdapterServing;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setWeightMethod(opt.id)}
                    aria-pressed={active}
                    title={
                      isDisabled
                        ? 'Disabled while multi-adapter frozen-base serving is enabled'
                        : undefined
                    }
                    className={`rounded-md border px-2.5 py-2 text-left transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 ${
                      active
                        ? 'border-accent bg-accent text-accent-ink'
                        : 'border-border bg-surface text-ink-primary hover:border-border-strong'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div
                      className={`text-[10px] ${
                        active ? 'text-accent-ink/75' : 'text-ink-muted'
                      }`}
                    >
                      {opt.isPeft ? 'PEFT' : '100% Weights'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dim C + Compatibility Constraint */}
          <div className="space-y-3 rounded-lg border border-border bg-canvas p-3.5">
            <div>
              <span className="font-mono text-[11px] font-semibold text-ink-muted">
                DIMENSION C &amp; SERVING CONSTRAINTS
              </span>
              <p className="text-xs text-ink-secondary">
                Optional transfer &amp; adapter constraints
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIncludeDistillation((prev) => !prev)}
              aria-pressed={includeDistillation}
              className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-all active:scale-[0.99] ${
                includeDistillation
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-border bg-surface text-ink-primary hover:border-border-strong'
              }`}
            >
              <div>
                <div className="text-xs font-semibold">
                  Knowledge Distillation (Dim C)
                </div>
                <div
                  className={`text-[11px] ${
                    includeDistillation ? 'text-accent-ink/75' : 'text-ink-muted'
                  }`}
                >
                  Compress frontier teacher into fast student
                </div>
              </div>
              <span className="font-mono text-[11px] font-semibold">
                {includeDistillation ? 'ON' : 'OFF'}
              </span>
            </button>

            <div className="space-y-1">
              <button
                type="button"
                disabled={isFullFineTune}
                onClick={() => setMultiAdapterServing((prev) => !prev)}
                aria-pressed={multiAdapterServing && !isFullFineTune}
                className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
                  multiAdapterServing && !isFullFineTune
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-border bg-surface text-ink-primary hover:border-border-strong'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">
                    Same-Pass PEFT / Multi-Adapter Base
                  </div>
                  <div
                    className={`text-[11px] ${
                      multiAdapterServing && !isFullFineTune
                        ? 'text-accent-ink/75'
                        : 'text-ink-muted'
                    }`}
                  >
                    Hot-swap task adapters on frozen base
                  </div>
                </div>
                <span className="font-mono text-[11px] font-semibold">
                  {isFullFineTune
                    ? 'DISABLED'
                    : multiAdapterServing
                      ? 'ON'
                      : 'OFF'}
                </span>
              </button>
              {isFullFineTune && (
                <p className="text-[11px] leading-snug text-rose-700 dark:text-rose-400">
                  Incompatible: Full Fine-Tune updates 100% of weights and
                  cannot be combined simultaneously with a PEFT adapter in the
                  same pass.
                </p>
              )}
              {multiAdapterServing && !isFullFineTune && (
                <p className="text-[11px] leading-snug text-ink-muted">
                  Full Fine-Tune is disabled while frozen-base multi-adapter
                  serving is active.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Live Composed Output */}
        <div className="space-y-4 rounded-lg border border-border bg-canvas p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-ink-secondary" aria-hidden="true" />
              <span className="text-sm font-semibold text-ink-primary">
                Composed Pipeline: {composed.formula}
              </span>
            </div>
            {activePreset && (
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-900 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-200">
                Matches Preset: {activePreset.name}
              </span>
            )}
          </div>

          {activePreset && (
            <div className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-xs text-ink-secondary">
              <p>
                <strong className="font-semibold text-ink-primary">
                  Use Case:
                </strong>{' '}
                {activePreset.useCase}
              </p>
              <p className="mt-1 text-ink-secondary">
                <strong className="font-semibold text-ink-primary">
                  Production Notes:
                </strong>{' '}
                {activePreset.productionNotes}{' '}
                <span className="font-mono text-[11px] text-ink-muted">
                  {activePreset.citation}
                </span>
              </p>
            </div>
          )}

          {/* Live Steps */}
          <ol className="space-y-1.5">
            {composed.steps.map((step, idx) => (
              <li
                key={`composed-step-${idx}`}
                className="flex items-start gap-2.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-ink-primary"
              >
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-accent font-mono text-[10px] font-semibold text-accent-ink">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {/* Metrics Row */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-surface p-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Trainable Parameter Footprint
              </span>
              <p className="mt-1 font-mono text-sm font-semibold text-ink-primary">
                {composed.trainableParams}
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface p-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Cost / VRAM Profile
              </span>
              <p className="mt-1 text-xs font-medium leading-snug text-ink-primary">
                {composed.vramProfile}
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface p-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Output Artifact
              </span>
              <p className="mt-1 text-xs font-medium leading-snug text-ink-primary">
                {composed.artifact}
              </p>
            </div>
          </div>

          {/* Empirical Validation & Compatibility Warning */}
          <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-100">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Empirical Validation &amp; Compatibility Notes</span>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-amber-950/90 dark:text-amber-200/90">
              {composed.warnings.map((warning, idx) => (
                <li key={`warning-${idx}`}>{warning}</li>
              ))}
              <li>
                <span className="font-semibold">Empirical Rule:</span>{' '}
                {finetuningData.composabilityNote}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FineTuningCombinator;
