# 04 — Cloud Infrastructure: Cross-Cloud Mapping & Production LLMOps

> *"Map requirements to the 8 core system jobs first, then select the equivalent managed services across AWS, Azure, and GCP."*

## Core Engineering Focus

Cross-cloud infrastructure across AWS, Azure, and GCP (**8 core system jobs**, **24 sub-roles**, **93 production services**).

### 8 Core System Jobs Cross-Cloud Overview

| # | System Job | Sub-Roles | AWS / Azure / GCP Highlights |
| --- | --- | --- | --- |
| **01** | **Compute** | Virtual Machines, Auto-Scaling, Run Containers / Apps | EC2, ECS, Fargate \| VMs, App Service, Container Apps \| Compute Engine, Cloud Run, App Engine |
| **02** | **Databases** | Relational (SQL), NoSQL / Documents | RDS, Aurora, DynamoDB, DocumentDB \| Azure SQL, Cosmos DB \| Cloud SQL, AlloyDB, Spanner, Firestore |
| **03** | **Storage** | Objects, Disks, File Shares, Cold Archive | S3, EBS, EFS, S3 Glacier \| Blob, Managed Disks, Azure Files, Archive \| Cloud Storage, Persistent Disk, Filestore, Archive |
| **04** | **Messaging & Events** | Queues, Pub/Sub & Events, Streams (Kafka) | SQS, SNS, EventBridge, MSK \| Service Bus, Queue Storage, Event Grid, Event Hubs \| Cloud Tasks, Pub/Sub, Eventarc, Managed Kafka |
| **05** | **Serverless** | API Front Door, Functions, Workflows | API Gateway, Lambda, Step Functions \| API Management, Azure Functions, Logic Apps \| API Gateway, Cloud Run functions, Workflows |
| **06** | **Kubernetes** | Managed Cluster, Image Registry, Scaling & GitOps | EKS (+ Auto Mode), ECR, Karpenter \| AKS (+ Automatic), Container Registry, KEDA \| GKE (+ Autopilot), Artifact Registry, Config Sync |
| **07** | **Monitoring** | Metrics & Dashboards, Logs & Audit, Traces | CloudWatch, CloudTrail, X-Ray, ADOT \| Azure Monitor, Managed Grafana, Log Analytics, App Insights \| Cloud Monitoring, Cloud Logging, Error Reporting, Cloud Trace |
| **08** | **AI & Agents** | Models & ML, Agents, Search / RAG | Bedrock, SageMaker AI, Bedrock AgentCore, Bedrock Knowledge Bases \| Microsoft Foundry, Azure ML, Foundry Agent Service, Azure AI Search \| Vertex AI, Gemini, Conversational Agents, Vertex AI Search |

## Required Deliverables

1. **Containerized Deployments (Docker & Kubernetes)**
   - Multi-stage production Dockerfiles, non-root runtime users, health/readiness probes, and horizontal/GPU autoscaling specs (`Karpenter` / `KEDA` / `GKE Autopilot`).
2. **High-Throughput GPU Serving (vLLM / TGI)**
   - Continuous batching, KV-cache memory utilization limits, tensor parallelism, and quantized model serving manifests.
3. **CI/CD & LLMOps Workflows**
   - Automated build, security scan, prompt/evaluation regression gates, and progressive canary rollouts.

## Suggested Module Layout

```text
04-cloud-infrastructure/
├── README.md
├── verify_cloud_map.py     # Zero-dependency verification harness (8 jobs, 24 sub-roles, 93 services)
├── docker/                 # Multi-stage API & vLLM serving Dockerfiles
├── k8s/                    # Deployments, HPA/KEDA/Karpenter manifests & probes
└── .github/workflows/      # CI/CD evaluation & deployment pipelines
```

## Verification Harness

Run the zero-dependency Python 3 verification script from the repository root:

```bash
python 04-cloud-infrastructure/verify_cloud_map.py
```

### What `verify_cloud_map.py` Verifies

| Check | Description |
| --- | --- |
| **Exact Cloud Matrix Totals** | Verifies the complete catalog sums to exactly **8 system jobs**, **24 sub-roles**, and **93 production services** |
| **Cross-Cloud Provider Parity** | Confirms every sub-role maps non-empty service lists for AWS, Azure, and GCP |
| **GPU Serving Config Bounds** | Validates vLLM/TGI serving parameters (tensor parallelism, GPU memory utilization, max model length) |
| **K8s & CI/CD Gate Invariants** | Checks readiness/liveness probes, resource limits, and mandatory CI evaluation gates |
