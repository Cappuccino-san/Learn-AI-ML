import type {
  ModuleRouteMeta,
  SearchableItem,
} from '@/types/handbook';
import { philosophyData } from './philosophy';
import { careerData } from './career';
import { architectureData } from './architecture';
import { finetuningData } from './finetuning';
import { cloudMatrixData } from './cloudMatrix';
import { portfolioData } from './portfolio';

export {
  philosophyData,
  careerData,
  architectureData,
  finetuningData,
  cloudMatrixData,
  portfolioData,
};

export const MODULE_ROUTES: ModuleRouteMeta[] = [
  {
    id: 'module-1',
    route: '/',
    shortLabel: 'Philosophy',
    title: 'Philosophy & Master Curriculum',
    subtitle:
      'Foundational software engineering discipline, core mandate, and 5-stage GitHub repository roadmap.',
  },
  {
    id: 'module-2',
    route: '/roadmap',
    shortLabel: 'Roadmap & Roles',
    title: 'Skills Pyramid & Career Tracks',
    subtitle:
      '4-tier competency pyramid, 8 specialized LLM engineering roles, and progressive certifications.',
  },
  {
    id: 'module-3',
    route: '/architecture',
    shortLabel: 'Architecture',
    title: 'Production Architecture & RAG/Agent Ops',
    subtitle:
      '6-layer production stack, 4 hard RAG problems, agent reliability pillars, and 2026 ecosystem.',
  },
  {
    id: 'module-4',
    route: '/fine-tuning',
    shortLabel: 'Fine-Tuning Gate',
    title: 'Fine-Tuning Dimensions & Diagnostic Gate',
    subtitle:
      '10 adaptation methods across 3 structural dimensions, 6-scenario diagnostic gate, and 8 readiness checks.',
  },
  {
    id: 'module-5',
    route: '/cloud',
    shortLabel: 'Cloud Matrix',
    title: 'Cross-Cloud Architecture Matrix',
    subtitle:
      '8 core system jobs, 24 operational sub-roles, and 93 equivalent services across AWS, Azure, and GCP.',
  },
  {
    id: 'module-6',
    route: '/portfolio',
    shortLabel: 'Portfolio & Prep',
    title: 'Portfolio, Verification & Interview Lab',
    subtitle:
      '5 operational career milestones, 6 verified production projects, resume checklist, and 8 interview domains.',
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildGlobalSearchIndex(): SearchableItem[] {
  const items: SearchableItem[] = [];

  for (const mod of MODULE_ROUTES) {
    items.push({
      id: `module-${mod.id}`,
      title: mod.title,
      subtitle: mod.subtitle,
      category: 'Module',
      moduleId: mod.id,
      route: mod.route,
      keywords: [mod.id, mod.shortLabel, mod.title, mod.subtitle],
      citation: '[cite: 1–16]',
    });
  }

  for (const principle of philosophyData.foundationalPrinciples) {
    items.push({
      id: `principle-${principle.id}`,
      title: principle.title,
      subtitle: principle.summary,
      category: 'Module',
      moduleId: 'module-1',
      route: '/',
      anchor: `principle-${principle.id}`,
      keywords: ['principle', 'philosophy', principle.title, principle.summary],
      citation: principle.citation,
    });
  }

  for (const repo of philosophyData.repoStructure) {
    items.push({
      id: `repo-${slugify(repo.path)}`,
      title: repo.path,
      subtitle: `${repo.focus} — ${repo.deliverables}`,
      category: 'Module',
      moduleId: 'module-1',
      route: '/',
      anchor: `repo-${slugify(repo.path)}`,
      keywords: [
        'github',
        'repo',
        repo.path,
        repo.focus,
        repo.deliverables,
        ...repo.sampleFiles,
      ],
      citation: repo.citation,
    });
  }

  for (const tier of careerData.skillsPyramid) {
    items.push({
      id: `tier-${tier.tier}`,
      title: `Tier ${tier.tier}: ${tier.stage} (${tier.years})`,
      subtitle: tier.engineeringFocus,
      category: 'Career & Role',
      moduleId: 'module-2',
      route: '/roadmap',
      anchor: `tier-${tier.tier}`,
      keywords: [
        'skills pyramid',
        tier.stage,
        tier.years,
        ...tier.competencies,
      ],
      citation: tier.citation,
    });
  }

  for (const role of careerData.careerRoles) {
    items.push({
      id: `role-${role.id}`,
      title: role.role,
      subtitle: role.responsibilities.join(' · '),
      category: 'Career & Role',
      moduleId: 'module-2',
      route: '/roadmap',
      anchor: `role-${role.id}`,
      keywords: [
        'role',
        'career',
        role.role,
        ...role.responsibilities,
        ...role.deliverables,
      ],
      citation: role.citation,
    });
  }

  for (const cert of careerData.certifications) {
    items.push({
      id: `cert-${cert.id}`,
      title: cert.name,
      subtitle: `${cert.tierLabel} (${cert.years}) — ${cert.focus}`,
      category: 'Career & Role',
      moduleId: 'module-2',
      route: '/roadmap',
      anchor: `cert-${cert.id}`,
      keywords: ['certification', cert.tierLabel, cert.years, cert.name, cert.focus],
      citation: cert.citation,
    });
  }

  for (const layer of architectureData.layers) {
    items.push({
      id: `arch-layer-${layer.id}`,
      title: `Layer ${layer.layerNumber}: ${layer.name}`,
      subtitle: layer.components.join(' · '),
      category: 'Architecture',
      moduleId: 'module-3',
      route: '/architecture',
      anchor: `layer-${layer.id}`,
      keywords: [
        'architecture',
        'layer',
        layer.name,
        ...layer.components,
        ...layer.responsibilities,
        ...layer.failureModes,
        ...layer.optimizationPatterns,
      ],
      citation: layer.citation,
    });
  }

  for (const problem of architectureData.ragHardProblems) {
    items.push({
      id: `rag-problem-${problem.number}`,
      title: `RAG Hard Problem #${problem.number}: ${problem.title}`,
      subtitle: problem.description,
      category: 'Architecture',
      moduleId: 'module-3',
      route: '/architecture',
      anchor: `rag-problem-${problem.number}`,
      keywords: ['rag', 'enterprise rag', problem.title, problem.description],
      citation: problem.citation,
    });
  }

  items.push({
    id: 'arch-agent-reliability',
    title: architectureData.agentReliability.headline,
    subtitle: architectureData.agentReliability.analysis,
    category: 'Architecture',
    moduleId: 'module-3',
    route: '/architecture',
    anchor: 'agent-reliability',
    keywords: [
      'agent reliability',
      'checkpointing',
      'idempotency',
      'transactional recovery',
      ...architectureData.agentReliability.pillars.map((p) => p.name),
    ],
    citation: architectureData.agentReliability.citation,
  });

  for (const strategy of architectureData.scalabilityStrategies) {
    items.push({
      id: `scale-${strategy.id}`,
      title: strategy.strategy,
      subtitle: strategy.tactics,
      category: 'Architecture',
      moduleId: 'module-3',
      route: '/architecture',
      anchor: `scale-${strategy.id}`,
      keywords: ['scalability', 'optimization', strategy.strategy, strategy.tactics],
      citation: strategy.citation,
    });
  }

  for (const dim of finetuningData.structuralDimensions) {
    items.push({
      id: `ft-dimension-${dim.id}`,
      title: `Dimension ${dim.id}: ${dim.name}`,
      subtitle: `${dim.subtitle} — ${dim.methods.join(', ')}`,
      category: 'Fine-Tuning',
      moduleId: 'module-4',
      route: '/fine-tuning',
      anchor: `dimension-${dim.id}`,
      keywords: ['dimension', dim.id, dim.name, dim.subtitle, ...dim.methods],
      citation: dim.citation,
    });
  }

  for (const method of finetuningData.methods) {
    items.push({
      id: `ft-method-${method.id}`,
      title: method.name,
      subtitle: `Dim ${method.dimensionId} (${method.dimensionLabel}) · ${method.trainableParams} · ${method.costProfile} — ${method.tradeoffs}`,
      category: 'Fine-Tuning',
      moduleId: 'module-4',
      route: '/fine-tuning',
      anchor: `method-${method.id}`,
      keywords: [
        'fine-tuning',
        method.name,
        method.shortName,
        method.dimensionLabel,
        method.outputArtifact,
        method.tradeoffs,
        ...method.executionPipeline,
      ],
      citation: method.citation,
    });
  }

  for (const preset of finetuningData.combinationPresets) {
    items.push({
      id: `ft-preset-${preset.id}`,
      title: `Pipeline Preset: ${preset.name}`,
      subtitle: `${preset.vramProfile} — ${preset.useCase}`,
      category: 'Fine-Tuning',
      moduleId: 'module-4',
      route: '/fine-tuning',
      anchor: `preset-${preset.id}`,
      keywords: [
        'preset',
        'pipeline',
        preset.name,
        preset.useCase,
        preset.vramProfile,
        ...preset.methods,
      ],
      citation: preset.citation,
    });
  }

  for (const scenario of finetuningData.diagnosticScenarios) {
    items.push({
      id: `gate-scenario-${scenario.id}`,
      title: scenario.observedProblem,
      subtitle: `${scenario.correctSolutionTitle} (${scenario.requiresTraining ? 'Requires Training' : 'No Training'}) — ${scenario.correctSolutionDetails}`,
      category: 'Diagnostic Gate',
      moduleId: 'module-4',
      route: '/fine-tuning',
      anchor: `scenario-${scenario.id}`,
      keywords: [
        'diagnostic gate',
        scenario.observedProblem,
        scenario.wrongInstinct,
        scenario.correctSolutionTitle,
        scenario.recommendedCategory,
      ],
      citation: scenario.citation,
    });
  }

  for (const q of finetuningData.readinessQuestions) {
    items.push({
      id: `gate-readiness-${q.id}`,
      title: `Readiness Gate Q${q.number}: ${q.question}`,
      subtitle: q.verificationHint,
      category: 'Diagnostic Gate',
      moduleId: 'module-4',
      route: '/fine-tuning',
      anchor: `readiness-${q.id}`,
      keywords: ['readiness', 'pre-training', q.question, q.verificationHint],
      citation: q.citation,
    });
  }

  for (const job of cloudMatrixData.jobs) {
    items.push({
      id: `cloud-job-${job.id}`,
      title: `${job.number} ${job.name}`,
      subtitle: `${job.tagline} (${job.subRoles.length} sub-roles)`,
      category: 'Cloud Service',
      moduleId: 'module-5',
      route: '/cloud',
      anchor: `job-${job.id}`,
      keywords: ['cloud', 'system job', job.number, job.name, job.tagline],
      citation: job.citation,
    });

    for (const sr of job.subRoles) {
      items.push({
        id: `cloud-subrole-${sr.id}`,
        title: `${sr.systemJobNumber} ${sr.systemJobName} · ${sr.subRole}`,
        subtitle: `AWS: ${sr.aws.join(', ')} | Azure: ${sr.azure.join(', ')} | GCP: ${sr.gcp.join(', ')}`,
        category: 'Cloud Service',
        moduleId: 'module-5',
        route: '/cloud',
        anchor: `subrole-${sr.id}`,
        keywords: [
          sr.systemJobName,
          sr.subRole,
          ...sr.aws,
          ...sr.azure,
          ...sr.gcp,
        ],
        citation: sr.citation,
      });

      const providers: Array<{ label: 'AWS' | 'Azure' | 'GCP'; services: string[] }> = [
        { label: 'AWS', services: sr.aws },
        { label: 'Azure', services: sr.azure },
        { label: 'GCP', services: sr.gcp },
      ];

      for (const provider of providers) {
        provider.services.forEach((serviceName, idx) => {
          items.push({
            id: `cloud-service-${sr.id}-${provider.label.toLowerCase()}-${idx}-${slugify(serviceName)}`,
            title: `${provider.label}: ${serviceName}`,
            subtitle: `${sr.systemJobNumber} ${sr.systemJobName} (${sr.systemJobTagline}) → ${sr.subRole}`,
            category: 'Cloud Service',
            moduleId: 'module-5',
            route: '/cloud',
            anchor: `subrole-${sr.id}`,
            keywords: [
              provider.label,
              serviceName,
              sr.subRole,
              sr.systemJobName,
              sr.systemJobTagline,
              ...sr.aws,
              ...sr.azure,
              ...sr.gcp,
            ],
            citation: sr.citation,
          });
        });
      }
    }
  }

  for (const milestone of portfolioData.milestones) {
    items.push({
      id: `milestone-${milestone.step}`,
      title: `Milestone ${milestone.step}: ${milestone.role} (${milestone.years})`,
      subtitle: `${milestone.phase} — ${milestone.description}`,
      category: 'Career & Role',
      moduleId: 'module-6',
      route: '/portfolio',
      anchor: `milestone-${milestone.step}`,
      keywords: [
        'milestone',
        milestone.role,
        milestone.years,
        milestone.phase,
        milestone.description,
      ],
      citation: milestone.citation,
    });
  }

  for (const project of portfolioData.portfolioProjects) {
    items.push({
      id: `project-${project.id}`,
      title: `Project #${project.number}: ${project.title}`,
      subtitle: `${project.architectureAndStack.join(' · ')} — ${project.verificationSummary}`,
      category: 'Portfolio Project',
      moduleId: 'module-6',
      route: '/portfolio',
      anchor: `project-${project.id}`,
      keywords: [
        'portfolio',
        'project',
        project.title,
        project.verificationSummary,
        ...project.architectureAndStack,
        ...project.verificationChecklist.map((c) => c.label),
      ],
      citation: project.citation,
    });
  }

  for (const domain of portfolioData.interviewDomains) {
    items.push({
      id: `interview-${domain.id}`,
      title: `Interview #${domain.number}: ${domain.domain}`,
      subtitle: domain.focus,
      category: 'Interview Prep',
      moduleId: 'module-6',
      route: '/portfolio',
      anchor: `interview-${domain.id}`,
      keywords: [
        'interview',
        domain.domain,
        domain.focus,
        domain.practiceLoop.explain,
        domain.practiceLoop.design,
        domain.practiceLoop.build,
        domain.practiceLoop.evaluate,
      ],
      citation: domain.citation,
    });
  }

  items.push(
    {
      id: 'figure-1-roadmap',
      title: 'Figure 1: Modern LLM Engineering Career Mastery Roadmap',
      subtitle:
        'Visual reference diagram: Skills Pyramid, 8 Career Roles, Certifications Roadmap, End-to-End Architecture, and Ecosystem Stack.',
      category: 'Career & Role',
      moduleId: 'module-2',
      route: '/roadmap',
      anchor: 'figure-1-roadmap',
      keywords: [
        'figure',
        'figure 1',
        'diagram',
        'infographic',
        'career mastery roadmap',
        'skills pyramid',
        'e_opore',
      ],
      citation: '[cite: 2, 3]',
    },
    {
      id: 'figure-2-finetuning',
      title: 'Figure 2: 10 Ways to Fine-Tune an LLM',
      subtitle:
        'Visual reference diagram: 10 adaptation methods across full-parameter, PEFT (LoRA/QLoRA/DoRA/Adapters/Prefix), and alignment/distillation.',
      category: 'Fine-Tuning',
      moduleId: 'module-4',
      route: '/fine-tuning',
      anchor: 'figure-2-finetuning',
      keywords: [
        'figure',
        'figure 2',
        'diagram',
        'infographic',
        '10 ways to fine-tune',
        'lora',
        'qlora',
        'dpo',
        'rlhf',
      ],
      citation: '[cite: 8]',
    },
    {
      id: 'figure-3-cloud',
      title: 'Figure 3: AWS vs Azure vs GCP Cross-Cloud Map',
      subtitle:
        'Visual reference diagram: 8 core engineering jobs and 93 production services mapped side-by-side across AWS, Azure, and GCP.',
      category: 'Cloud Service',
      moduleId: 'module-5',
      route: '/cloud',
      anchor: 'figure-3-cloud',
      keywords: [
        'figure',
        'figure 3',
        'diagram',
        'infographic',
        'aws vs azure vs gcp',
        'cross-cloud map',
        '93 services',
      ],
      citation: '[cite: 13]',
    }
  );

  return items;
}

export const globalSearchItems: SearchableItem[] = buildGlobalSearchIndex();
