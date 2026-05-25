import { create } from 'zustand';
import type { RescueData, RescueStatus, IssueType, Severity } from '@/types/rescue';

interface RescueState {
  phase: RescueStatus;
  rescueData: RescueData | null;
  voiceTranscript: string;
  selectedIssue: IssueType;
  selectedSeverity: Severity;
  userLocation: { latitude: number; longitude: number } | null;

  setPhase: (phase: RescueStatus) => void;
  setRescueData: (data: RescueData) => void;
  updateRescueData: (patch: Partial<RescueData>) => void;
  setVoiceTranscript: (t: string) => void;
  setSelectedIssue: (issue: IssueType) => void;
  setSelectedSeverity: (severity: Severity) => void;
  setUserLocation: (loc: { latitude: number; longitude: number }) => void;
  reset: () => void;
}

export const useRescueStore = create<RescueState>((set) => ({
  phase: 'idle',
  rescueData: null,
  voiceTranscript: '',
  selectedIssue: 'other',
  selectedSeverity: 'medium',
  userLocation: null,

  setPhase: (phase) => set({ phase }),
  setRescueData: (data) => set({ rescueData: data, phase: data.status as RescueStatus }),
  updateRescueData: (patch) =>
    set((s) => ({ rescueData: s.rescueData ? { ...s.rescueData, ...patch } : s.rescueData })),
  setVoiceTranscript: (voiceTranscript) => set({ voiceTranscript }),
  setSelectedIssue: (selectedIssue) => set({ selectedIssue }),
  setSelectedSeverity: (selectedSeverity) => set({ selectedSeverity }),
  setUserLocation: (userLocation) => set({ userLocation }),
  reset: () =>
    set({
      phase: 'idle',
      rescueData: null,
      voiceTranscript: '',
      selectedIssue: 'other',
      selectedSeverity: 'medium',
    }),
}));
