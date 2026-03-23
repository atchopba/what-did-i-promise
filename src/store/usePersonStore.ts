import { create } from 'zustand';
import { Person, CreatePersonDTO } from '../types';
import { personRepository } from '../repositories/PersonRepository';

interface PersonStore {
  people: Person[];
  isLoading: boolean;
  error: string | null;

  loadPeople: () => Promise<void>;
  createPerson: (dto: CreatePersonDTO) => Promise<Person | null>;
  updatePerson: (id: string, updates: Partial<Person>) => Promise<void>;
  archivePerson: (id: string) => Promise<void>;
}

export const usePersonStore = create<PersonStore>((set, get) => ({
  people: [],
  isLoading: false,
  error: null,

  loadPeople: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await personRepository.findAll();
      set({ people: data, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  createPerson: async (dto: CreatePersonDTO) => {
    try {
      const person = await personRepository.create(dto);
      await get().loadPeople();
      return person;
    } catch (e: any) {
      set({ error: e.message });
      return null;
    }
  },

  updatePerson: async (id: string, updates: Partial<Person>) => {
    try {
      await personRepository.update(id, updates);
      await get().loadPeople();
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  archivePerson: async (id: string) => {
    try {
      await personRepository.archive(id);
      await get().loadPeople();
    } catch (e: any) {
      set({ error: e.message });
    }
  },
}));
