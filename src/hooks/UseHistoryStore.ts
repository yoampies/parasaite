import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IAnalysis, DateRange } from '../types';
import { recentAnalyses } from '../assets/constants';

interface HistoryState {
  // Estado de Datos
  analyses: IAnalysis[];

  // Estado de Filtros
  searchQuery: string;
  selectedParasites: string[];
  confidenceRange: [number, number];
  dateRange: DateRange;
  feedbackStatus: string | null;

  // Acciones de Filtros
  setSearchQuery: (query: string) => void;
  setSelectedParasites: (parasites: string[]) => void;
  setConfidenceRange: (range: [number, number]) => void;
  setDateRange: (range: DateRange) => void;
  setFeedbackStatus: (status: string | null) => void;

  addAnalysis: (analysis: IAnalysis) => void;
  resetFilters: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      analyses: recentAnalyses,
      searchQuery: '',
      selectedParasites: [],
      confidenceRange: [0, 100],
      dateRange: { start: null, end: null },
      feedbackStatus: null,

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedParasites: (selectedParasites) => set({ selectedParasites }),
      setConfidenceRange: (confidenceRange) => set({ confidenceRange }),
      setDateRange: (dateRange) => set({ dateRange }),
      setFeedbackStatus: (feedbackStatus) => set({ feedbackStatus }),

      addAnalysis: (analysis) => set((state) => ({ analyses: [analysis, ...state.analyses] })),

      resetFilters: () =>
        set({
          searchQuery: '',
          selectedParasites: [],
          confidenceRange: [0, 100],
          dateRange: { start: null, end: null },
          feedbackStatus: null,
        }),
    }),
    {
      name: 'parasite-history-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ analyses: state.analyses }),
    }
  )
);
