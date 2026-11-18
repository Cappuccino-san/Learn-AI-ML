export type ModuleId =
  | 'module-1'
  | 'module-2'
  | 'module-3'
  | 'module-4'
  | 'module-5'
  | 'module-6';

export type AppRoute =
  | '/'
  | '/roadmap'
  | '/architecture'
  | '/fine-tuning'
  | '/cloud'
  | '/portfolio';

export interface ModuleRouteMeta {
  id: ModuleId;
  route: AppRoute;
  shortLabel: string;
  title: string;
  subtitle: string;
}

export interface FoundationalPrinciple {
  id: string;
  title: string;
  summary: string;
  citation: string;
}

export interface RepoDirectorySpec {
  path: string;
  focus: string;
  deliverables: string;
  citation: string;
  sampleFiles: string[];
  verificationCommand: string;
}

export interface Module1Data {
  title: string;
  subtitle: string;
  coreFailurePattern: {
    summary: string;
    details: string[];
    citation: string;
  };
  coreMandate: {
    quote: string;
    explanation: string;
    citation: string;
  };
  executionLoop: string[];
  foundationalPrinciples: FoundationalPrinciple[];
  repoStructure: RepoDirectorySpec[];
}

export interface SkillsPyramidTier {
  tier: number;
  stage: string;
  years: string;
  citation: string;
  competencies: string[];
  engineeringFocus: string;
}

export interface CareerRoleSpec {
  id: string;
  role: string;
  citation: string;
  responsibilities: string[];
  deliverables: string[];
}

export interface CertificationSpec {
  id: string;
  tierLabel: string;
  years: string;
  name: string;
  focus: string;
  citation: string;
}

export interface Module2Data {
  progressionPrinciple: string;
  skillsPyramid: SkillsPyramidTier[];
  fdeCallout: {
    title: string;
    description: string;
    citation: string;
  };
  universalCompetencies: string[];
  careerRoles: CareerRoleSpec[];
  certificationsNote: string;
  certifications: CertificationSpec[];
}

export interface ArchitectureLayerSpec {
  layerNumber: number;
  id: string;
  name: string;
  citation: string;
  components: string[];
  responsibilities: string[];
  failureModes: string[];
  optimizationPatterns: string[];
}

export interface OperationalProblem {
  number: number;
  title: string;
  description: string;
  citation: string;
}

export interface Module3Data {
  layers: ArchitectureLayerSpec[];
  ragHardProblems: OperationalProblem[];
  agentReliability: {
    headline: string;
    analysis: string;
    pillars: {
      name: string;
      description: string;
    }[];
    citation: string;
  };
  bestPractices: {
    id: string;
    text: string;
    citation: string;
  }[];
  scalabilityStrategies: {
    id: string;
    strategy: string;
    tactics: string;
    citation: string;
  }[];
  ecosystem2026: {
    models: string[];
    frameworksAndOpenSource: string[];
    vectorDatabases: string[];
    containersAndOps: string[];
    citation: string;
  };
}

export type StructuralDimensionId = 'A' | 'B' | 'C';

export interface StructuralDimensionSpec {
  id: StructuralDimensionId;
  name: string;
  subtitle: string;
  methods: string[];
  citation: string;
}

export interface FineTuningMethodSpec {
  number: number;
  id: string;
  name: string;
  shortName: string;
  dimensionId: StructuralDimensionId;
  dimensionLabel: string;
  executionPipeline: string[];
  trainableParams: string;
  costProfile: string;
  extraMetric?: string;
  outputArtifact: string;
  tradeoffs: string;
  citation: string;
}

export interface PipelineCombinationPreset {
  id: string;
  name: string;
  methods: string[];
  useCase: string;
  vramProfile: string;
  productionNotes: string;
  citation: string;
}

export interface DiagnosticGateScenario {
  id: string;
  observedProblem: string;
  wrongInstinct: string;
  correctSolutionTitle: string;
  correctSolutionDetails: string;
  recommendedCategory:
    | 'RAG & Data Sync'
    | 'Structured Outputs & Prompting'
    | 'Retrieval Pipeline'
    | 'SFT + PEFT'
    | 'Preference Alignment (DPO)'
    | 'Distillation & Inference Ops';
  requiresTraining: boolean;
  citation: string;
}

export interface ReadinessQuestionSpec {
  number: number;
  id: string;
  question: string;
  verificationHint: string;
  citation: string;
}

export interface Module4Data {
  structuralDimensions: StructuralDimensionSpec[];
  composabilityNote: string;
  methods: FineTuningMethodSpec[];
  combinationPresets: PipelineCombinationPreset[];
  diagnosticScenarios: DiagnosticGateScenario[];
  readinessQuestions: ReadinessQuestionSpec[];
}

export interface CloudSubRoleSpec {
  id: string;
  systemJobId: string;
  systemJobNumber: string;
  systemJobName: string;
  systemJobTagline: string;
  subRole: string;
  aws: string[];
  azure: string[];
  gcp: string[];
  citation: string;
}

export interface CloudSystemJobGroup {
  id: string;
  number: string;
  name: string;
  tagline: string;
  citation: string;
  subRoles: CloudSubRoleSpec[];
}

export interface Module5Data {
  totalJobs: number;
  totalSubRoles: number;
  totalServices: number;
  jobs: CloudSystemJobGroup[];
}

export interface CareerMilestoneSpec {
  step: number;
  role: string;
  years: string;
  phase: string;
  description: string;
  citation: string;
}

export interface PortfolioProjectSpec {
  number: number;
  id: string;
  title: string;
  architectureAndStack: string[];
  verificationSummary: string;
  verificationChecklist: {
    id: string;
    label: string;
  }[];
  citation: string;
}

export interface InterviewDomainSpec {
  number: number;
  id: string;
  domain: string;
  focus: string;
  citation: string;
  practiceLoop: {
    explain: string;
    design: string;
    build: string;
    evaluate: string;
  };
}

export interface Module6Data {
  milestones: CareerMilestoneSpec[];
  portfolioProjects: PortfolioProjectSpec[];
  resumeChecklist: {
    id: string;
    text: string;
    citation: string;
  }[];
  interviewPracticeLoopSteps: string[];
  interviewDomains: InterviewDomainSpec[];
  continuousLearning: {
    habits: string[];
    communities: string[];
    citation: string;
  };
}

export interface SearchableItem {
  id: string;
  title: string;
  subtitle: string;
  category:
    | 'Module'
    | 'Architecture'
    | 'Fine-Tuning'
    | 'Diagnostic Gate'
    | 'Cloud Service'
    | 'Career & Role'
    | 'Portfolio Project'
    | 'Interview Prep';
  moduleId: ModuleId;
  route: AppRoute;
  anchor?: string;
  keywords: string[];
  citation: string;
}
