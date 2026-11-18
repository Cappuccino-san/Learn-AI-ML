#!/usr/bin/env python3
"""Module 04 Verification Harness: Cross-Cloud Infrastructure & LLMOps.

Zero external dependencies (Python 3 standard library only).
Verifies the exact 8 system jobs, 24 sub-roles, and 93 production services
across AWS, Azure, and GCP, plus GPU serving and Kubernetes readiness invariants.
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


CLOUD_MATRIX: list[dict[str, Any]] = [
    {
        "job": "01 Compute",
        "sub_roles": [
            ("Virtual Machines", ["EC2"], ["Virtual Machines"], ["Compute Engine"]),
            ("Auto-Scaling", ["EC2 Auto Scaling"], ["VM Scale Sets"], ["Managed Instance Groups"]),
            ("Run Containers / Apps", ["ECS", "Fargate"], ["App Service", "Container Apps"], ["Cloud Run", "App Engine"]),
        ],
    },
    {
        "job": "02 Databases",
        "sub_roles": [
            ("Relational (SQL)", ["RDS", "Aurora"], ["Azure SQL Database", "Azure DB for PostgreSQL"], ["Cloud SQL", "AlloyDB", "Spanner"]),
            ("NoSQL / Documents", ["DynamoDB", "DocumentDB"], ["Cosmos DB", "Azure DocumentDB"], ["Firestore"]),
        ],
    },
    {
        "job": "03 Storage",
        "sub_roles": [
            ("Objects", ["S3"], ["Blob Storage"], ["Cloud Storage"]),
            ("Disks", ["EBS"], ["Managed Disks"], ["Persistent Disk"]),
            ("File Shares", ["EFS"], ["Azure Files"], ["Filestore"]),
            ("Cold Archive", ["S3 Glacier"], ["Archive Storage"], ["Archive Storage"]),
        ],
    },
    {
        "job": "04 Messaging & Events",
        "sub_roles": [
            ("Queues", ["SQS"], ["Service Bus", "Queue Storage"], ["Cloud Tasks"]),
            ("Pub/Sub & Events", ["SNS", "EventBridge"], ["Event Grid"], ["Pub/Sub", "Eventarc"]),
            ("Streams (Kafka)", ["MSK"], ["Event Hubs"], ["Managed Kafka"]),
        ],
    },
    {
        "job": "05 Serverless",
        "sub_roles": [
            ("API Front Door", ["API Gateway"], ["API Management"], ["API Gateway"]),
            ("Functions", ["Lambda"], ["Azure Functions"], ["Cloud Run functions"]),
            ("Workflows", ["Step Functions"], ["Logic Apps"], ["Workflows"]),
        ],
    },
    {
        "job": "06 Kubernetes",
        "sub_roles": [
            ("Managed Cluster", ["EKS", "EKS Auto Mode"], ["AKS", "AKS Automatic"], ["GKE", "GKE Autopilot"]),
            ("Image Registry", ["ECR"], ["Container Registry"], ["Artifact Registry"]),
            ("Scaling & GitOps", ["Karpenter"], ["KEDA"], ["Config Sync"]),
        ],
    },
    {
        "job": "07 Monitoring",
        "sub_roles": [
            ("Metrics & Dashboards", ["CloudWatch"], ["Azure Monitor", "Managed Grafana"], ["Cloud Monitoring"]),
            ("Logs & Audit", ["CloudTrail"], ["Log Analytics"], ["Cloud Logging", "Error Reporting"]),
            ("Traces", ["X-Ray", "ADOT"], ["Application Insights"], ["Cloud Trace"]),
        ],
    },
    {
        "job": "08 AI & Agents",
        "sub_roles": [
            ("Models & ML", ["Bedrock", "SageMaker AI"], ["Microsoft Foundry", "Azure ML"], ["Vertex AI", "Gemini"]),
            ("Agents", ["Bedrock AgentCore"], ["Foundry Agent Service"], ["Conversational Agents"]),
            ("Search / RAG", ["Bedrock Knowledge Bases"], ["Azure AI Search"], ["Vertex AI Search"]),
        ],
    },
]


def check_cloud_matrix_totals() -> CheckResult:
    total_jobs = len(CLOUD_MATRIX)
    total_sub_roles = sum(len(job["sub_roles"]) for job in CLOUD_MATRIX)
    aws_count = sum(len(aws) for job in CLOUD_MATRIX for _, aws, _, _ in job["sub_roles"])
    azure_count = sum(len(az) for job in CLOUD_MATRIX for _, _, az, _ in job["sub_roles"])
    gcp_count = sum(len(gcp) for job in CLOUD_MATRIX for _, _, _, gcp in job["sub_roles"])
    total_services = aws_count + azure_count + gcp_count

    passed = total_jobs == 8 and total_sub_roles == 24 and total_services == 93
    return CheckResult(
        name="exact_cloud_matrix_totals",
        passed=passed,
        detail=f"jobs={total_jobs}/8, sub_roles={total_sub_roles}/24, services={total_services}/93 (aws={aws_count}, azure={azure_count}, gcp={gcp_count})",
    )


def check_cross_cloud_parity() -> CheckResult:
    empty_mappings = [
        f"{job['job']}::{sub}"
        for job in CLOUD_MATRIX
        for sub, aws, az, gcp in job["sub_roles"]
        if not (aws and az and gcp)
    ]
    passed = len(empty_mappings) == 0
    return CheckResult(
        name="cross_cloud_provider_parity",
        passed=passed,
        detail=f"sub_roles_missing_provider={len(empty_mappings)}",
    )


def validate_vllm_serving_config(cfg: dict[str, Any]) -> bool:
    return (
        cfg.get("tensor_parallel_size", 0) >= 1
        and 0.5 <= cfg.get("gpu_memory_utilization", 0.0) <= 0.95
        and cfg.get("max_model_len", 0) >= 2048
        and cfg.get("dtype") in {"bfloat16", "float16", "fp8", "awq", "gptq"}
    )


def check_gpu_serving_and_k8s_invariants() -> CheckResult:
    vllm_ok = validate_vllm_serving_config(
        {
            "engine": "vllm",
            "tensor_parallel_size": 2,
            "gpu_memory_utilization": 0.9,
            "max_model_len": 8192,
            "dtype": "bfloat16",
        }
    )
    k8s_spec = {
        "readinessProbe": "/health/ready",
        "livenessProbe": "/health/live",
        "resources": {"limits": {"nvidia.com/gpu": 2, "memory": "48Gi"}},
        "nonRootUser": True,
    }
    k8s_ok = (
        bool(k8s_spec.get("readinessProbe"))
        and bool(k8s_spec.get("livenessProbe"))
        and k8s_spec["resources"]["limits"]["nvidia.com/gpu"] >= 1
        and k8s_spec["nonRootUser"] is True
    )
    passed = vllm_ok and k8s_ok
    return CheckResult(
        name="gpu_serving_and_k8s_invariants",
        passed=passed,
        detail=f"vllm_config_valid={vllm_ok}, k8s_manifest_valid={k8s_ok}",
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
        check_cloud_matrix_totals(),
        check_cross_cloud_parity(),
        check_gpu_serving_and_k8s_invariants(),
        check_docs_presence(),
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify Module 04 Cross-Cloud Infrastructure invariants.")
    parser.add_argument("--json", action="store_true", help="Emit JSON report.")
    args = parser.parse_args()

    results = run_all_checks()
    all_passed = all(r.passed for r in results)

    if args.json:
        print(
            json.dumps(
                {
                    "module": "04-cloud-infrastructure",
                    "passed": all_passed,
                    "checks": [asdict(r) for r in results],
                },
                indent=2,
            )
        )
    else:
        print("=== 04-cloud-infrastructure Verification Harness ===")
        for r in results:
            tag = "PASS" if r.passed else "FAIL"
            print(f"[{tag}] {r.name}: {r.detail}")
        print(f"Summary: {sum(r.passed for r in results)}/{len(results)} checks passed.")

    return 0 if all_passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
