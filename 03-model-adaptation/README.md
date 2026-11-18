# 03 — Model Adaptation: Pre-Training Diagnostic Gate & Fine-Tuning

> *"Empirical validation is always required—never fine-tune to patch volatile facts, broken retrieval, or missing output schemas."*

## Core Engineering Focus

Pre-training diagnostic gate, SFT, LoRA, QLoRA, DoRA, Adapters, Prefix Tuning, RLHF, DPO, and Distillation.

### Three Orthogonal Structural Dimensions

| Dimension | Focus | Methods |
| --- | --- | --- |
| **A: Parameter Update & Resource Efficiency** | *How weights are updated* | Full Fine-Tuning, LoRA, QLoRA, DoRA, Adapters, Prefix Tuning |
| **B: Training Data, Objectives & Behavioral Alignment** | *What the model learns* | Instruction Tuning (SFT), RLHF, DPO |
| **C: Cross-Model Capability Transfer** | *Deployment efficiency* | Knowledge Distillation |

Methods combine across dimensions in production (for example: `SFT + LoRA`, `SFT + DPO + QLoRA`, `SFT + DPO + DoRA`, or `Distillation + SFT + LoRA`).

### Pre-Training Diagnostic Gate

Before training weights, diagnose the observed symptom:

- **Volatile facts / changing policies** -> Data Synchronization + RAG *(no training)*
- **Inconsistent JSON / formatting** -> Structured Outputs + Validation + Prompting *(no training)*
- **Irrelevant / outdated context chunks** -> Fix Retrieval Pipeline (chunking, hybrid search, re-ranking) *(no training)*
- **Systematic capability deficit on a stable task** -> SFT + PEFT (LoRA / QLoRA / DoRA)
- **Tone, style, or preference violations** -> Preference Alignment (DPO / RLHF)
- **High accuracy, prohibitive latency/cost** -> Knowledge Distillation + Inference Optimization

All training proposals must also clear the **8 Mandatory Pre-Training Readiness Questions** (clear need, specific deficit, parameter necessity, quantified non-training baseline, audited training data, independent held-out test set, measurable uplift, and zero unacceptable general-reasoning regression).

## Required Deliverables

1. **Quantified Non-Training Baseline Benchmarks** using prompting, structured outputs, and RAG before any weight updates.
2. **Independent Held-Out Test Sets** audited for leakage, deduplication, and domain coverage.
3. **Adapter & Alignment Training Pipelines** supporting SFT, LoRA/QLoRA/DoRA, DPO, and teacher-student distillation.
4. **Automated Regression Suites** measuring task uplift alongside general-reasoning retention and serving cost/latency.

## Suggested Module Layout

```text
03-model-adaptation/
├── README.md
├── verify_gate.py          # Zero-dependency verification harness
├── diagnostic_gate.py      # Gate & 8-question readiness validator
├── configs/                # SFT, LoRA, QLoRA, DoRA, DPO & Distillation configs
├── evals/                  # Baseline benchmarks & regression suites
└── datasets/               # Audited train/val/held-out split manifests
```

## Verification Harness

Run the zero-dependency Python 3 verification script from the repository root:

```bash
python 03-model-adaptation/verify_gate.py
```

### What `verify_gate.py` Verifies

| Check | Description |
| --- | --- |
| **Diagnostic Gate Routing** | Validates all 6 canonical failure scenarios route to the correct non-training or training intervention |
| **8-Question Readiness Gate** | Blocks training proposals missing a non-training baseline, audited data, held-out set, or regression check |
| **Method & Dimension Registry** | Confirms all 10 adaptation methods map cleanly to Dimensions A, B, and C with valid composability |
| **Uplift & Regression Gate** | Verifies candidate adapters beat the baseline while staying within general-reasoning regression bounds |
