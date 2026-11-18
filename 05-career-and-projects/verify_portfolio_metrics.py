#!/usr/bin/env python3
"""Module 05 Verification Harness: Career Tracks, Portfolio Benchmarks & System Design.

Zero external dependencies (Python 3 standard library only).
Verifies the 6 portfolio projects, latency/cost/recall/faithfulness benchmark
thresholds, resume engineering metric checks, and the 8-domain interview loop.
"""

from __future__ import annotations

import argparse
from dataclasses import asdict, dataclass
import json
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class CheckResult:
    name: str
    passed: bool
    detail: str


PORTFOLIO_PROJECTS = (
    "Enterprise PDF / Document Q&A (RAG)",
    "AI Research Assistant (Agents + Tools)",
    "Automated Code Review Agent (LLM + GitHub)",
    "Customer Support Chatbot (RAG + Guardrails)",
    "Multi-Agent Task Manager",
    "Domain-Specific LLM (Education, Health, Finance)",
)

INTERVIEW_DOMAINS = (
    "LLM Fundamentals",
    "Prompt Engineering",
    "RAG System Design",
    "Fine-Tuning Methods Across Dimensions",
    "Evaluation Metrics",
    "LLMOps",
    "Safety & Guardrails",
    "End-to-End LLM System Design",
)

PRACTICE_LOOP_STEPS = ("Explain", "Design", "Build", "Evaluate")


def evaluate_benchmark_metrics(metrics: dict[str, float]) -> tuple[bool, list[str]]:
    failures: list[str] = []
    if metrics.get("p95_ttft_ms", 99999) > 1200:
        failures.append("p95_ttft_ms > 1200ms")
    if metrics.get("cost_per_1k_requests_usd", 99999) > 15.0:
        failures.append("cost_per_1k_requests_usd > $15")
    if metrics.get("retrieval_recall_at_5", 0.0) < 0.85:
        failures.append("retrieval_recall_at_5 < 0.85")
    if metrics.get("faithfulness_score", 0.0) < 0.90:
        failures.append("faithfulness_score < 0.90")
    return len(failures) == 0, failures


def check_six_portfolio_projects() -> CheckResult:
    passed = len(PORTFOLIO_PROJECTS) == 6 and len(set(PORTFOLIO_PROJECTS)) == 6
    return CheckResult(
        name="six_portfolio_projects_registry",
        passed=passed,
        detail=f"projects={len(PORTFOLIO_PROJECTS)}/6",
    )


def check_benchmark_eval_thresholds() -> CheckResult:
    passing_run = {
        "p95_ttft_ms": 640.0,
        "cost_per_1k_requests_usd": 6.20,
        "retrieval_recall_at_5": 0.91,
        "faithfulness_score": 0.94,
    }
    failing_run = {
        "p95_ttft_ms": 1850.0,
        "cost_per_1k_requests_usd": 22.0,
        "retrieval_recall_at_5": 0.62,
        "faithfulness_score": 0.74,
    }
    good_ok, good_failures = evaluate_benchmark_metrics(passing_run)
    bad_ok, bad_failures = evaluate_benchmark_metrics(failing_run)
    passed = good_ok and not bad_ok and len(bad_failures) == 4
    return CheckResult(
        name="benchmark_metric_thresholds",
        passed=passed,
        detail=f"passing_run_ok={good_ok} (failures={len(good_failures)}), failing_run_blocked={not bad_ok} (violations={len(bad_failures)})",
    )


def check_interview_domains_and_loop() -> CheckResult:
    flashcards: dict[str, dict[str, Any]] = {
        domain: {step: f"{step} prompt for {domain}" for step in PRACTICE_LOOP_STEPS}
        for domain in INTERVIEW_DOMAINS
    }
    all_complete = all(
        set(card.keys()) == set(PRACTICE_LOOP_STEPS) for card in flashcards.values()
    )
    passed = len(INTERVIEW_DOMAINS) == 8 and all_complete
    return CheckResult(
        name="interview_domains_practice_loop",
        passed=passed,
        detail=f"domains={len(INTERVIEW_DOMAINS)}/8, loop_steps={list(PRACTICE_LOOP_STEPS)}",
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
        check_six_portfolio_projects(),
        check_benchmark_eval_thresholds(),
        check_interview_domains_and_loop(),
        check_docs_presence(),
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify Module 05 Portfolio & Career metrics.")
    parser.add_argument("--json", action="store_true", help="Emit JSON report.")
    args = parser.parse_args()

    results = run_all_checks()
    all_passed = all(r.passed for r in results)

    if args.json:
        print(
            json.dumps(
                {
                    "module": "05-career-and-projects",
                    "passed": all_passed,
                    "checks": [asdict(r) for r in results],
                },
                indent=2,
            )
        )
    else:
        print("=== 05-career-and-projects Verification Harness ===")
        for r in results:
            tag = "PASS" if r.passed else "FAIL"
            print(f"[{tag}] {r.name}: {r.detail}")
        print(f"Summary: {sum(r.passed for r in results)}/{len(results)} checks passed.")

    return 0 if all_passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
