import { create } from 'zustand';
import {
  PromiseWithPerson,
  PromiseWithDetails,
  CreatePromiseDTO,
  UpdatePromiseDTO,
  PromiseFilters,
  TimeSection,
} from '../types';
import {
  createPromise,
  updatePromise,
  completePromise,
  snoozePromise,
  archivePromise,
  addNote,
  groupPromisesByTimeSection,
  getPromiseWithDetails,
  CompletePromiseResult,
} from '../services/PromiseService';
import { promiseRepository } from '../repositories/PromiseRepository';

interface PromiseStore {
  promises: PromiseWithPerson[];
  sections: TimeSection[];
  currentPromise: PromiseWithDetails | null;
  isLoading: boolean;
  error: string | null;
  lastFeedback: string | null;
  filters: PromiseFilters;

  // Actions
  loadPromises: (filters?: PromiseFilters) => Promise<void>;
  loadPromiseDetail: (id: string) => Promise<void>;
  create: (dto: CreatePromiseDTO) => Promise<PromiseWithPerson | null>;
  update: (id: string, dto: UpdatePromiseDTO) => Promise<void>;
  complete: (id: string) => Promise<CompletePromiseResult | null>;
  snooze: (id: string, until: string) => Promise<void>;
  archive: (id: string) => Promise<void>;
  addNote: (promiseId: string, content: string) => Promise<void>;
  setFilters: (filters: PromiseFilters) => void;
  clearFilters: () => void;
  clearFeedback: () => void;
  clearError: () => void;
}

export const usePromiseStore = create<PromiseStore>((set, get) => ({
  promises: [],
  sections: [],
  currentPromise: null,
  isLoading: false,
  error: null,
  lastFeedback: null,
  filters: {},

  loadPromises: async (filters?: PromiseFilters) => {
    set({ isLoading: true, error: null });
    try {
      const activeFilters = filters ?? get().filters;
      const data = await promiseRepository.findAll(activeFilters);
      const sections = groupPromisesByTimeSection(data);
      set({ promises: data, sections, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message ?? 'Erreur de chargement' });
    }
  },

  loadPromiseDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const detail = await getPromiseWithDetails(id);
      set({ currentPromise: detail, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  create: async (dto: CreatePromiseDTO) => {
    set({ isLoading: true, error: null });
    try {
      const promise = await createPromise(dto);
      await get().loadPromises();
      set({ isLoading: false });
      return promise as PromiseWithPerson;
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
      return null;
    }
  },

  update: async (id: string, dto: UpdatePromiseDTO) => {
    set({ isLoading: true, error: null });
    try {
      await updatePromise(id, dto);
      await get().loadPromises();
      if (get().currentPromise?.id === id) {
        await get().loadPromiseDetail(id);
      }
      set({ isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  complete: async (id: string) => {
    try {
      const result = await completePromise(id);
      if (result) {
        set({ lastFeedback: result.feedbackMessage });
        await get().loadPromises();
      }
      return result;
    } catch (e: any) {
      set({ error: e.message });
      return null;
    }
  },

  snooze: async (id: string, until: string) => {
    try {
      await snoozePromise(id, until);
      await get().loadPromises();
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  archive: async (id: string) => {
    try {
      await archivePromise(id);
      await get().loadPromises();
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  addNote: async (promiseId: string, content: string) => {
    try {
      await addNote(promiseId, content);
      await get().loadPromiseDetail(promiseId);
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  setFilters: (filters: PromiseFilters) => {
    set({ filters });
    get().loadPromises(filters);
  },

  clearFilters: () => {
    set({ filters: {} });
    get().loadPromises({});
  },

  clearFeedback: () => set({ lastFeedback: null }),
  clearError: () => set({ error: null }),
}));
