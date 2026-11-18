#!/usr/bin/env python3
"""Module 03 Verification Harness: Pre-Training Diagnostic Gate & Fine-Tuning.

Zero external dependencies (Python 3 standard library only).
Verifies the 6-row Pre-Training Diagnostic Gate, the 8 Mandatory Pre-Training
Readiness Questions, the 10 adaptation methods across Dimensions A/B/C, and
uplift/regression gating.
"""

from __future__ import annotations

import argparse
from dataclasses import asdict, dataclass
import json
from pathlib import Path


@dataclass(frozen=True)
class CheckResult:
    name: str
    passed: bool
    detail: str


DIAGNOSTIC_GATE = {
    "volatile_facts": ("RAG & Data Sync", False),
    "inconsistent_json": ("Structured Outputs & Prompting", False),
    "bad_retrieval_context": ("Retrieval Pipeline", False),
    "stable_capability_deficit": ("SFT + PEFT", True),
    "tone_preference_violation": ("Preference Alignment (DPO)", True),
    "prohibitive_latency_cost": ("Distillation & Inference Ops", True),
}

METHODS_BY_DIMENSION = {
    "A": ("Full Fine-Tuning", "LoRA", "QLoRA", "DoRA", "Adapters", "Prefix Tuning"),
    "B": ("Instruction Tuning (SFT)", "RLHF", "DPO"),
    "C": ("Knowledge Distillation",),
}

MANDATORY_READINESS_QUESTIONS = (
    "why_need_to_train",
    "specific_model_deficit",
    "must_alter_parameters",
    "quantified_non_training_baseline",
    "audited_training_data",
    "independent_held_out_test_set",
    "measurable_uplift_over_baseline",
    "general_reasoning_regression_checked",
)


def evaluate_readiness_proposal(answers: dict[str, bool]) -> tuple[bool, list[str]]:
    missing = [q for q in MANDATORY_READINESS_QUESTIONS if not answers.get(q, False)]
    return len(missing) == 0, missing


def evaluate_uplift_and_regression(
    baseline_score: float,
    candidate_score: float,
    general_baseline: float,
    general_candidate: float,
    min_uplift: float = 0.05,
    max_regression: float = 0.02,
) -> tuple[bool, float, float]:
    uplift = round(candidate_score - baseline_score, 4)
    regression = round(general_baseline - general_candidate, 4)
    passed = uplift >= min_uplift and regression <= max_regression
    return passed, uplift, regression


def check_diagnostic_gate_scenarios() -> CheckResult:
    non_training = [k for k, (_, train) in DIAGNOSTIC_GATE.items() if not train]
    training = [k for k, (_, train) in DIAGNOSTIC_GATE.items() if train]
    passed = (
        len(DIAGNOSTIC_GATE) == 6
        and len(non_training) == 3
        and len(training) == 3
        and DIAGNOSTIC_GATE["volatile_facts"][1] is False
        and DIAGNOSTIC_GATE["stable_capability_deficit"][1] is True
    )
    return CheckResult(
        name="diagnostic_gate_scenarios",
        passed=passed,
        detail=f"total={len(DIAGNOSTIC_GATE)}, non_training={len(non_training)}, training={len(training)}",
    )


def check_readiness_questions_gate() -> CheckResult:
    complete_proposal = {q: True for q in MANDATORY_READINESS_QUESTIONS}
    incomplete_proposal = {**complete_proposal, "quantified_non_training_baseline": False}

    approved, missing_ok = evaluate_readiness_proposal(complete_proposal)
    blocked, missing_bad = evaluate_readiness_proposal(incomplete_proposal)
    passed = (
        len(MANDATORY_READINESS_QUESTIONS) == 8
        and approved
        and not missing_ok
        and not blocked
        and missing_bad == ["quantified_non_training_baseline"]
    )
    return CheckResult(
        name="mandatory_readiness_questions",
        passed=passed,
        detail=f"questions=8, complete_approved={approved}, missing_baseline_blocked={not blocked}",
    )


def check_methods_and_dimensions() -> CheckResult:
    all_methods = [m for methods in METHODS_BY_DIMENSION.values() for m in methods]
    unique_methods = set(all_methods)
    passed = (
        set(METHODS_BY_DIMENSION.keys()) == {"A", "B", "C"}
        and len(all_methods) == 10
        and len(unique_methods) == 10
    )
    return CheckResult(
        name="adaptation_methods_registry",
        passed=passed,
        detail=f"dimensions=3, total_methods={len(all_methods)}, unique={len(unique_methods)}",
    )


def check_uplift_and_regression_gate() -> CheckResult:
    good_ok, uplift, regression = evaluate_uplift_and_regression(
        baseline_score=0.71,
        candidate_score=0.86,
        general_baseline=0.82,
        general_candidate=0.81,
    )
    bad_ok, _, bad_regression = evaluate_uplift_and_regression(
        baseline_score=0.71,
        candidate_score=0.85,
        general_baseline=0.82,
        general_candidate=0.72,
    )
    passed = good_ok and not bad_ok
    return CheckResult(
        name="uplift_and_regression_gate",
        passed=passed,
        detail=f"valid_uplift=+{uplift:.2f}/reg={regression:.2f}, excessive_reg={bad_regression:.2f}_blocked={not bad_ok}",
    )


def check_docs_presence() -> CheckResult:
    readme_exists = (Path(__file__).resolve().parent / "README.md").is_file()
    return CheckResult(
        name="module_documentation",
        passed=readme_exists,
        detail=f"readme_exists={readme_exists}",
    )


def run_all_checks() -> list[CheckResult]:
    return [
        check_diagnostic_gate_scenarios(),
        check_readiness_questions_gate(),
        check_methods_and_dimensions(),
        check_uplift_and_regression_gate(),
        check_docs_presence(),
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify Module 03 Pre-Training Gate invariants.")
    parser.add_argument("--json", action="store_true", help="Emit JSON report.")
    args = parser.parse_args()

    results = run_all_checks()
    all_passed = all(r.passed for r in results)

    if args.json:
        print(
            json.dumps(
                {
                    "module": "03-model-adaptation",
                    "passed": all_passed,
                    "checks": [asdict(r) for r in results],
                },
                indent=2,
            )
        )
    else:
        print("=== 03-model-adaptation Verification Harness ===")
        for r in results:
            tag = "PASS" if r.passed else "FAIL"
            print(f"[{tag}] {r.name}: {r.detail}")
        print(f"Summary: {sum(r.passed for r in results)}/{len(results)} checks passed.")

    return 0 if all_passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
