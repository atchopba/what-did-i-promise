import { BUILT_IN_TEMPLATES } from '../constants/datasets';
import {
    ContextType,
    DuePrecision,
    PersonType,
    PromisePriority,
    PromiseStatus,
} from '../types';

/** Minimal DB interface used by the seeder — works on both native (expo-sqlite) and web (AlaSQL). */
interface SeedableDB {
  runAsync: (sql: string, params?: unknown[]) => Promise<void>;
  getFirstAsync: <T>(sql: string, params?: unknown[]) => Promise<T | null>;
}

const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const nowISO = (): string => new Date().toISOString();
const daysAgo = (n: number): string => new Date(Date.now() - n * 86400000).toISOString();
const daysFromNow = (n: number): string => new Date(Date.now() + n * 86400000).toISOString();

export const seedDatabase = async (db: SeedableDB): Promise<void> => {
  // Check if already seeded
  const existing = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM people');
  if (existing && existing.count > 0) return;

  const n = nowISO();

  // Seed people
  const people = [
    { id: 'person_marie', name: 'Marie', type: PersonType.AMI, weight: 4 },
    { id: 'person_thomas', name: 'Thomas', type: PersonType.COLLEGUE, weight: 3 },
    { id: 'person_papa', name: 'Papa', type: PersonType.FAMILLE, weight: 5 },
    { id: 'person_lucas', name: 'Lucas', type: PersonType.AMI, weight: 3 },
    { id: 'person_client_a', name: 'Client A', type: PersonType.CLIENT, weight: 5 },
    { id: 'person_sophie', name: 'Sophie', type: PersonType.FAMILLE, weight: 4 },
  ];

  for (const p of people) {
    await db.runAsync(
      'INSERT OR IGNORE INTO people (id, name, type, createdAt, updatedAt, archived, relationshipWeight) VALUES (?, ?, ?, ?, ?, 0, ?)',
      [p.id, p.name, p.type, n, n, p.weight]
    );
  }

  // Seed promises
  const promises = [
    {
      id: 'promise_01',
      title: 'Envoyer le rapport mensuel',
      personId: 'person_thomas',
      contextType: ContextType.TRAVAIL,
      dueDate: daysFromNow(1),
      duePrecision: DuePrecision.DEMAIN,
      priority: PromisePriority.ELEVEE,
      status: PromiseStatus.OUVERTE,
    },
    {
      id: 'promise_02',
      title: 'Rappeler Papa pour son anniversaire',
      personId: 'person_papa',
      contextType: ContextType.FAMILLE,
      dueDate: daysFromNow(3),
      duePrecision: DuePrecision.CETTE_SEMAINE,
      priority: PromisePriority.CRITIQUE,
      status: PromiseStatus.OUVERTE,
    },
    {
      id: 'promise_03',
      title: 'Rembourser Marie pour le dîner',
      personId: 'person_marie',
      contextType: ContextType.FINANCES,
      dueDate: daysFromNow(2),
      duePrecision: DuePrecision.CETTE_SEMAINE,
      priority: PromisePriority.NORMALE,
      status: PromiseStatus.OUVERTE,
    },
    {
      id: 'promise_04',
      title: 'Envoyer le devis au client',
      personId: 'person_client_a',
      contextType: ContextType.TRAVAIL,
      dueDate: daysAgo(2),
      duePrecision: DuePrecision.DATE_EXACTE,
      priority: PromisePriority.CRITIQUE,
      status: PromiseStatus.EN_RETARD,
    },
    {
      id: 'promise_05',
      title: 'Prendre des nouvelles de Sophie',
      personId: 'person_sophie',
      contextType: ContextType.FAMILLE,
      dueDate: null,
      duePrecision: DuePrecision.AUCUNE,
      priority: PromisePriority.NORMALE,
      status: PromiseStatus.OUVERTE,
    },
    {
      id: 'promise_06',
      title: "Partager l'article intéressant à Lucas",
      personId: 'person_lucas',
      contextType: ContextType.AMITIES,
      dueDate: daysFromNow(7),
      duePrecision: DuePrecision.CETTE_SEMAINE,
      priority: PromisePriority.FAIBLE,
      status: PromiseStatus.OUVERTE,
    },
    {
      id: 'promise_07',
      title: 'Confirmer la réservation du restaurant',
      personId: 'person_marie',
      contextType: ContextType.PERSONNEL,
      dueDate: daysFromNow(0),
      duePrecision: DuePrecision.AUJOURD_HUI,
      priority: PromisePriority.ELEVEE,
      status: PromiseStatus.EN_COURS,
    },
    {
      id: 'promise_08',
      title: 'Préparer la présentation',
      personId: 'person_thomas',
      contextType: ContextType.TRAVAIL,
      dueDate: daysFromNow(5),
      duePrecision: DuePrecision.CETTE_SEMAINE,
      priority: PromisePriority.ELEVEE,
      status: PromiseStatus.EN_COURS,
    },
    {
      id: 'promise_09',
      title: "Appeler l'assurance",
      personId: null,
      contextType: ContextType.ADMINISTRATIF,
      dueDate: daysAgo(5),
      duePrecision: DuePrecision.DATE_EXACTE,
      priority: PromisePriority.NORMALE,
      status: PromiseStatus.EN_RETARD,
    },
    {
      id: 'promise_10',
      title: "Envoyer le cadeau d'anniversaire",
      personId: 'person_sophie',
      contextType: ContextType.FAMILLE,
      dueDate: daysFromNow(10),
      duePrecision: DuePrecision.DATE_EXACTE,
      priority: PromisePriority.ELEVEE,
      status: PromiseStatus.OUVERTE,
    },
    {
      id: 'promise_11',
      title: 'Réviser le contrat',
      personId: 'person_client_a',
      contextType: ContextType.TRAVAIL,
      dueDate: daysFromNow(3),
      duePrecision: DuePrecision.CETTE_SEMAINE,
      priority: PromisePriority.CRITIQUE,
      status: PromiseStatus.OUVERTE,
    },
    {
      id: 'promise_12',
      title: 'Passer à la pharmacie',
      personId: null,
      contextType: ContextType.SANTE,
      dueDate: daysFromNow(1),
      duePrecision: DuePrecision.DEMAIN,
      priority: PromisePriority.NORMALE,
      status: PromiseStatus.OUVERTE,
    },
    {
      id: 'promise_done_01',
      title: 'Envoyer le rapport de la semaine dernière',
      personId: 'person_thomas',
      contextType: ContextType.TRAVAIL,
      dueDate: daysAgo(3),
      duePrecision: DuePrecision.DATE_EXACTE,
      priority: PromisePriority.NORMALE,
      status: PromiseStatus.TENUE,
    },
  ];

  for (const p of promises) {
    await db.runAsync(
      `INSERT OR IGNORE INTO promises 
        (id, title, personId, contextType, dueDate, duePrecision, priority, status, 
         createdAt, updatedAt, isArchived, sourceType, riskScore, notesCount, followUpCount, recurrence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'manual', 0, 0, 0, 'aucune')`,
      [p.id, p.title, p.personId, p.contextType, p.dueDate, p.duePrecision,
       p.priority, p.status, daysAgo(Math.floor(Math.random() * 10)), n]
    );
  }

  // Seed templates from BUILT_IN_TEMPLATES
  for (const t of BUILT_IN_TEMPLATES) {
    await db.runAsync(
      `INSERT OR IGNORE INTO promise_templates 
        (id, title, defaultPriority, defaultContextType, defaultDueOffsetDays, builtIn, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      [t.id, t.title, t.priority, t.context, t.dueOffsetDays, n, n]
    );
  }

  // Seed some notes
  await db.runAsync(
    'INSERT OR IGNORE INTO promise_notes (id, promiseId, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
    ['note_01', 'promise_04', 'Le client a relancé ce matin. À traiter en priorité.', daysAgo(1), daysAgo(1)]
  );
  await db.runAsync(
    'INSERT OR IGNORE INTO promise_notes (id, promiseId, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
    ['note_02', 'promise_08', 'Slides à envoyer avant 18h jeudi.', daysAgo(2), daysAgo(2)]
  );

  // Seed settings
  const defaultSettings: [string, string][] = [
    ['onboarding_completed', 'false'],
    ['is_premium', 'false'],
    ['biometric_enabled', 'false'],
    ['notifications_enabled', 'true'],
    ['last_checkin_date', ''],
  ];
  for (const [key, value] of defaultSettings) {
    await db.runAsync(
      'INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }

  console.log('Database seeded successfully');
};
