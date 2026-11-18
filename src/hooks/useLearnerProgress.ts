'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ModuleId } from '@/types/handbook';

export const STORAGE_KEY = 'ai-llm-ed-center-progress-v1';

export type ReadinessAnswerStatus = 'pass' | 'fail' | 'unanswered';

export interface LearnerProgressState {
  completedChecklistIds: string[];
  completedModuleIds: ModuleId[];
  readinessAnswers: Record<string, ReadinessAnswerStatus>;
  masteredInterviewDomains: string[];
  selectedRoleTrack: string | null;
}

export interface LearnerProgressContextValue extends LearnerProgressState {
  hydrated: boolean;
  toggleChecklistItem: (id: string) => void;
  toggleModuleComplete: (id: ModuleId) => void;
  setReadinessAnswer: (id: string, status: ReadinessAnswerStatus) => void;
  resetReadinessGate: () => void;
  toggleInterviewDomain: (id: string) => void;
  setSelectedRoleTrack: (roleId: string | null) => void;
  resetAllProgress: () => void;
}

const VALID_MODULE_IDS = new Set<ModuleId>([
  'module-1',
  'module-2',
  'module-3',
  'module-4',
  'module-5',
  'module-6',
]);

const VALID_READINESS_STATUSES = new Set<ReadinessAnswerStatus>([
  'pass',
  'fail',
  'unanswered',
]);

const DEFAULT_PROGRESS: LearnerProgressState = {
  completedChecklistIds: [],
  completedModuleIds: [],
  readinessAnswers: {},
  masteredInterviewDomains: [],
  selectedRoleTrack: null,
};

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item === 'string' && item.length > 0) {
      seen.add(item);
    }
  }
  return Array.from(seen);
}

function sanitizeModuleIds(value: unknown): ModuleId[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<ModuleId>();
  for (const item of value) {
    if (typeof item === 'string' && VALID_MODULE_IDS.has(item as ModuleId)) {
      seen.add(item as ModuleId);
    }
  }
  return Array.from(seen);
}

function sanitizeReadinessAnswers(
  value: unknown
): Record<string, ReadinessAnswerStatus> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  const result: Record<string, ReadinessAnswerStatus> = {};
  for (const [key, status] of Object.entries(value)) {
    if (
      typeof key === 'string' &&
      typeof status === 'string' &&
      VALID_READINESS_STATUSES.has(status as ReadinessAnswerStatus)
    ) {
      result[key] = status as ReadinessAnswerStatus;
    }
  }
  return result;
}

function parseStoredProgress(raw: string | null): LearnerProgressState {
  if (!raw) return DEFAULT_PROGRESS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return DEFAULT_PROGRESS;
    }
    const record = parsed as Record<string, unknown>;
    return {
      completedChecklistIds: sanitizeStringArray(record.completedChecklistIds),
      completedModuleIds: sanitizeModuleIds(record.completedModuleIds),
      readinessAnswers: sanitizeReadinessAnswers(record.readinessAnswers),
      masteredInterviewDomains: sanitizeStringArray(
        record.masteredInterviewDomains
      ),
      selectedRoleTrack:
        typeof record.selectedRoleTrack === 'string' &&
        record.selectedRoleTrack.length > 0
          ? record.selectedRoleTrack
          : null,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function toggleArrayItem<T extends string>(items: T[], id: T): T[] {
  return items.includes(id)
    ? items.filter((item) => item !== id)
    : [...items, id];
}

const LearnerProgressContext =
  createContext<LearnerProgressContextValue | null>(null);

export function LearnerProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, setProgress] =
    useState<LearnerProgressState>(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setProgress(parseStoredProgress(stored));
    } catch {
      setProgress(DEFAULT_PROGRESS);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota or private-mode access errors.
    }
  }, [progress, hydrated]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setProgress(parseStoredProgress(event.newValue));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      completedChecklistIds: toggleArrayItem(prev.completedChecklistIds, id),
    }));
  }, []);

  const toggleModuleComplete = useCallback((id: ModuleId) => {
    setProgress((prev) => ({
      ...prev,
      completedModuleIds: toggleArrayItem(prev.completedModuleIds, id),
    }));
  }, []);

  const setReadinessAnswer = useCallback(
    (id: string, status: ReadinessAnswerStatus) => {
      setProgress((prev) => ({
        ...prev,
        readinessAnswers: {
          ...prev.readinessAnswers,
          [id]: status,
        },
      }));
    },
    []
  );

  const resetReadinessGate = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      readinessAnswers: {},
    }));
  }, []);

  const toggleInterviewDomain = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      masteredInterviewDomains: toggleArrayItem(
        prev.masteredInterviewDomains,
        id
      ),
    }));
  }, []);

  const setSelectedRoleTrack = useCallback((roleId: string | null) => {
    setProgress((prev) => ({
      ...prev,
      selectedRoleTrack: roleId,
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  const value = useMemo<LearnerProgressContextValue>(
    () => ({
      ...progress,
      hydrated,
      toggleChecklistItem,
      toggleModuleComplete,
      setReadinessAnswer,
      resetReadinessGate,
      toggleInterviewDomain,
      setSelectedRoleTrack,
      resetAllProgress,
    }),
    [
      progress,
      hydrated,
      toggleChecklistItem,
      toggleModuleComplete,
      setReadinessAnswer,
      resetReadinessGate,
      toggleInterviewDomain,
      setSelectedRoleTrack,
      resetAllProgress,
    ]
  );

  return React.createElement(
    LearnerProgressContext.Provider,
    { value },
    children
  );
}

export function useLearnerProgress(): LearnerProgressContextValue {
  const context = useContext(LearnerProgressContext);
  if (!context) {
    throw new Error(
      'useLearnerProgress must be used within a LearnerProgressProvider'
    );
  }
  return context;
}
