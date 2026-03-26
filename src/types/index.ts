// Enums
export enum PromiseStatus {
  OUVERTE = 'ouverte',
  EN_COURS = 'en_cours',
  TENUE = 'tenue',
  REPORTEE = 'reportee',
  ANNULEE = 'annulee',
  EN_RETARD = 'en_retard',
  ARCHIVEE = 'archivee',
}

export enum PromisePriority {
  FAIBLE = 'faible',
  NORMALE = 'normale',
  ELEVEE = 'elevee',
  CRITIQUE = 'critique',
}

export enum ContextType {
  PERSONNEL = 'personnel',
  TRAVAIL = 'travail',
  FAMILLE = 'famille',
  AMITIES = 'amities',
  ADMINISTRATIF = 'administratif',
  SANTE = 'sante',
  FINANCES = 'finances',
  MAISON = 'maison',
  AUTRE = 'autre',
}

export enum PersonType {
  MOI_MEME = 'moi_meme',
  AMI = 'ami',
  FAMILLE = 'famille',
  COLLEGUE = 'collegue',
  CLIENT = 'client',
  PARTENAIRE = 'partenaire',
  AUTRE = 'autre',
}

export enum DuePrecision {
  AUCUNE = 'aucune',
  AUJOURD_HUI = 'aujourd_hui',
  DEMAIN = 'demain',
  CETTE_SEMAINE = 'cette_semaine',
  CE_MOIS = 'ce_mois',
  DATE_EXACTE = 'date_exacte',
}

export enum RecurrenceType {
  AUCUNE = 'aucune',
  QUOTIDIENNE = 'quotidienne',
  HEBDOMADAIRE = 'hebdomadaire',
  BIMENSUELLE = 'bimensuelle',
  MENSUELLE = 'mensuelle',
  TRIMESTRIELLE = 'trimestrielle',
  PERSONNALISEE = 'personnalisee',
}

export enum ReminderType {
  EXACT = 'exact',
  AVANT_ECHEANCE = 'avant_echeance',
  PERSONNALISE = 'personnalise',
  SUIVI = 'suivi',
  CHECKIN = 'checkin',
  SANS_DATE_VIEIL = 'sans_date_vieil',
}

export enum EventType {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  NOTE_ADDED = 'note_added',
  REMINDER_SET = 'reminder_set',
  VIEWED = 'viewed',
  SNOOZED = 'snoozed',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  SHARED = 'shared',
}

export enum RiskLevel {
  FAIBLE = 'faible',
  ATTENTION = 'attention',
  SURVEILLER = 'surveiller',
  CRITIQUE = 'critique',
}

export enum ReliabilityLevel {
  STABLE = 'stable',
  SOLIDE = 'solide',
  A_RENFORCER = 'a_renforcer',
  SOUS_TENSION = 'sous_tension',
}

export enum SourceType {
  MANUAL = 'manual',
  TEMPLATE = 'template',
  RECURRING = 'recurring',
}

// Interfaces
export interface Promise {
  id: string;
  title: string;
  normalizedTitle?: string;
  personId: string | null;
  contextType: ContextType;
  dueDate: string | null;
  duePrecision: DuePrecision;
  priority: PromisePriority;
  status: PromiseStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  snoozedUntil: string | null;
  lastViewedAt: string | null;
  lastReminderAt: string | null;
  isArchived: number; // 0 or 1 for SQLite
  sourceType: SourceType;
  categoryId: string | null;
  riskScore: number;
  notesCount: number;
  followUpCount: number;
  recurrence: RecurrenceType;
  attachmentUri: string | null;
}

export interface Person {
  id: string;
  name: string;
  type: PersonType;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
  colorSeed: number | null;
  archived: number; // 0 or 1
  relationshipWeight: number; // 1-5
}

export interface PromiseNote {
  id: string;
  promiseId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  promiseId: string;
  remindAt: string;
  type: ReminderType;
  isSent: number; // 0 or 1
  notificationId: string | null;
  createdAt: string;
}

export interface PromiseEvent {
  id: string;
  promiseId: string;
  eventType: EventType;
  metadata: string | null; // JSON string
  createdAt: string;
}

export interface PromiseTemplate {
  id: string;
  title: string;
  defaultPriority: PromisePriority;
  defaultContextType: ContextType;
  suggestedPersonType: PersonType | null;
  defaultDueOffsetDays: number | null;
  builtIn: number; // 0 or 1
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  builtIn: number; // 0 or 1
}

export interface Tag {
  id: string;
  label: string;
  createdAt: string;
}

export interface PromiseTag {
  promiseId: string;
  tagId: string;
}

// Composite types for UI
export interface PromiseWithPerson extends Promise {
  person?: Person;
}

export interface PromiseWithDetails extends PromiseWithPerson {
  notes?: PromiseNote[];
  reminders?: Reminder[];
  tags?: Tag[];
  events?: PromiseEvent[];
}

export interface DailyCheckin {
  today: PromiseWithPerson[];
  overdue: PromiseWithPerson[];
  comingSoon: PromiseWithPerson[];
  atRisk: PromiseWithPerson[];
  notReviewedRecently: PromiseWithPerson[];
  lastCheckinDate: string | null;
}

export interface ReliabilityScore {
  score: number; // 0-100
  level: ReliabilityLevel;
  keptCount: number;
  overdueCount: number;
  snoozedCount: number;
  totalClosed: number;
  averageClosureTime: number | null;
  checkinStreak: number;
}

export interface TimeSection {
  key: string;
  title: string;
  data: PromiseWithPerson[];
}

// Feature flags for premium
export interface FeatureFlags {
  maxActivePromises: number | null; // null = unlimited
  maxPeople: number | null;
  maxRemindersPerPromise: number;
  advancedRiskView: boolean;
  fullHistory: boolean;
  customTemplates: boolean;
  exportLocal: boolean;
  advancedFilters: boolean;
  detailedReliabilityScore: boolean;
  recurringPromises: boolean;
  customTags: boolean;
}

// Create/Update DTOs
export interface CreatePromiseDTO {
  title: string;
  personId?: string | null;
  contextType?: ContextType;
  dueDate?: string | null;
  duePrecision?: DuePrecision;
  priority?: PromisePriority;
  recurrence?: RecurrenceType;
  attachmentUri?: string | null;
  categoryId?: string | null;
  sourceType?: SourceType;
  reminderEnabled?: boolean;
  reminderAt?: string | null;
  tagIds?: string[];
}

export interface UpdatePromiseDTO {
  title?: string;
  personId?: string | null;
  contextType?: ContextType;
  dueDate?: string | null;
  duePrecision?: DuePrecision;
  priority?: PromisePriority;
  status?: PromiseStatus;
  recurrence?: RecurrenceType;
  attachmentUri?: string | null;
  categoryId?: string | null;
  snoozedUntil?: string | null;
}

export interface CreatePersonDTO {
  name: string;
  type?: PersonType;
  notes?: string;
  colorSeed?: number;
  relationshipWeight?: number;
}

export interface PromiseFilters {
  status?: PromiseStatus[];
  personId?: string;
  contextType?: ContextType;
  priority?: PromisePriority;
  isAtRisk?: boolean;
  tagIds?: string[];
  searchQuery?: string;
}
