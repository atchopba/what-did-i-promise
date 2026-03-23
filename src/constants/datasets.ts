import { ContextType, PersonType, PromisePriority, PromiseStatus, RecurrenceType } from '../types';

export const CONTEXT_OPTIONS = [
  { value: ContextType.PERSONNEL, label: 'Personnel', icon: 'person-outline', color: '#8B5CF6' },
  { value: ContextType.TRAVAIL, label: 'Travail', icon: 'briefcase-outline', color: '#3B82F6' },
  { value: ContextType.FAMILLE, label: 'Famille', icon: 'home-outline', color: '#EC4899' },
  { value: ContextType.AMITIES, label: 'Amitiés', icon: 'people-outline', color: '#F97316' },
  { value: ContextType.ADMINISTRATIF, label: 'Administratif', icon: 'document-text-outline', color: '#6B7280' },
  { value: ContextType.SANTE, label: 'Santé', icon: 'medical-outline', color: '#10B981' },
  { value: ContextType.FINANCES, label: 'Finances', icon: 'cash-outline', color: '#F59E0B' },
  { value: ContextType.MAISON, label: 'Maison', icon: 'hammer-outline', color: '#84CC16' },
  { value: ContextType.AUTRE, label: 'Autre', icon: 'ellipsis-horizontal-outline', color: '#9CA3AF' },
];

export const PERSON_TYPE_OPTIONS = [
  { value: PersonType.MOI_MEME, label: 'Moi-même' },
  { value: PersonType.AMI, label: 'Ami·e' },
  { value: PersonType.FAMILLE, label: 'Famille' },
  { value: PersonType.COLLEGUE, label: 'Collègue' },
  { value: PersonType.CLIENT, label: 'Client·e' },
  { value: PersonType.PARTENAIRE, label: 'Partenaire' },
  { value: PersonType.AUTRE, label: 'Autre' },
];

export const PRIORITY_OPTIONS = [
  { value: PromisePriority.FAIBLE, label: 'Faible', color: '#9CA3AF' },
  { value: PromisePriority.NORMALE, label: 'Normale', color: '#3B82F6' },
  { value: PromisePriority.ELEVEE, label: 'Élevée', color: '#F59E0B' },
  { value: PromisePriority.CRITIQUE, label: 'Critique', color: '#EF4444' },
];

export const STATUS_OPTIONS = [
  { value: PromiseStatus.OUVERTE, label: 'Ouverte', color: '#3B82F6' },
  { value: PromiseStatus.EN_COURS, label: 'En cours', color: '#8B5CF6' },
  { value: PromiseStatus.TENUE, label: 'Tenue', color: '#10B981' },
  { value: PromiseStatus.REPORTEE, label: 'Reportée', color: '#F59E0B' },
  { value: PromiseStatus.ANNULEE, label: 'Annulée', color: '#9CA3AF' },
  { value: PromiseStatus.EN_RETARD, label: 'En retard', color: '#EF4444' },
  { value: PromiseStatus.ARCHIVEE, label: 'Archivée', color: '#6B7280' },
];

export const RECURRENCE_OPTIONS = [
  { value: RecurrenceType.AUCUNE, label: 'Aucune' },
  { value: RecurrenceType.QUOTIDIENNE, label: 'Quotidienne' },
  { value: RecurrenceType.HEBDOMADAIRE, label: 'Hebdomadaire' },
  { value: RecurrenceType.BIMENSUELLE, label: 'Bimensuelle' },
  { value: RecurrenceType.MENSUELLE, label: 'Mensuelle' },
  { value: RecurrenceType.TRIMESTRIELLE, label: 'Trimestrielle' },
  { value: RecurrenceType.PERSONNALISEE, label: 'Personnalisée' },
];

export const RELATIONSHIP_WEIGHT_OPTIONS = [
  { value: 1, label: '1 – Connaissance' },
  { value: 2, label: '2 – Contact régulier' },
  { value: 3, label: '3 – Important' },
  { value: 4, label: '4 – Très important' },
  { value: 5, label: '5 – Essentiel' },
];

// 30+ promise templates in French
export const BUILT_IN_TEMPLATES = [
  { id: 'tpl_01', title: 'Envoyer le document', priority: PromisePriority.NORMALE, context: ContextType.TRAVAIL, dueOffsetDays: 2 },
  { id: 'tpl_02', title: 'Répondre au message', priority: PromisePriority.NORMALE, context: ContextType.PERSONNEL, dueOffsetDays: 1 },
  { id: 'tpl_03', title: 'Rappeler cette personne', priority: PromisePriority.NORMALE, context: ContextType.PERSONNEL, dueOffsetDays: 3 },
  { id: 'tpl_04', title: 'Confirmer le rendez-vous', priority: PromisePriority.ELEVEE, context: ContextType.PERSONNEL, dueOffsetDays: 1 },
  { id: 'tpl_05', title: 'Envoyer le devis', priority: PromisePriority.ELEVEE, context: ContextType.TRAVAIL, dueOffsetDays: 2 },
  { id: 'tpl_06', title: 'Faire le paiement', priority: PromisePriority.CRITIQUE, context: ContextType.FINANCES, dueOffsetDays: 3 },
  { id: 'tpl_07', title: "Acheter ce que j'ai dit", priority: PromisePriority.NORMALE, context: ContextType.PERSONNEL, dueOffsetDays: 7 },
  { id: 'tpl_08', title: 'Réserver la table / le lieu', priority: PromisePriority.ELEVEE, context: ContextType.PERSONNEL, dueOffsetDays: 5 },
  { id: 'tpl_09', title: 'Prendre des nouvelles', priority: PromisePriority.NORMALE, context: ContextType.AMITIES, dueOffsetDays: 7 },
  { id: 'tpl_10', title: "Partager l'information", priority: PromisePriority.NORMALE, context: ContextType.TRAVAIL, dueOffsetDays: 2 },
  { id: 'tpl_11', title: 'Faire une introduction', priority: PromisePriority.NORMALE, context: ContextType.TRAVAIL, dueOffsetDays: 5 },
  { id: 'tpl_12', title: 'Envoyer le lien / la ressource', priority: PromisePriority.FAIBLE, context: ContextType.PERSONNEL, dueOffsetDays: 3 },
  { id: 'tpl_13', title: 'Vérifier et revenir', priority: PromisePriority.NORMALE, context: ContextType.TRAVAIL, dueOffsetDays: 3 },
  { id: 'tpl_14', title: 'Planifier la réunion', priority: PromisePriority.NORMALE, context: ContextType.TRAVAIL, dueOffsetDays: 2 },
  { id: 'tpl_15', title: 'Réviser le document', priority: PromisePriority.ELEVEE, context: ContextType.TRAVAIL, dueOffsetDays: 3 },
  { id: 'tpl_16', title: 'Passer à la pharmacie', priority: PromisePriority.NORMALE, context: ContextType.SANTE, dueOffsetDays: 2 },
  { id: 'tpl_17', title: 'Prendre rendez-vous médical', priority: PromisePriority.ELEVEE, context: ContextType.SANTE, dueOffsetDays: 7 },
  { id: 'tpl_18', title: 'Déposer les documents admin', priority: PromisePriority.ELEVEE, context: ContextType.ADMINISTRATIF, dueOffsetDays: 5 },
  { id: 'tpl_19', title: "Renouveler l'abonnement", priority: PromisePriority.NORMALE, context: ContextType.FINANCES, dueOffsetDays: 7 },
  { id: 'tpl_20', title: 'Rembourser', priority: PromisePriority.CRITIQUE, context: ContextType.FINANCES, dueOffsetDays: 3 },
  { id: 'tpl_21', title: 'Aider à déménager', priority: PromisePriority.ELEVEE, context: ContextType.AMITIES, dueOffsetDays: 14 },
  { id: 'tpl_22', title: 'Prêter un objet', priority: PromisePriority.FAIBLE, context: ContextType.PERSONNEL, dueOffsetDays: 7 },
  { id: 'tpl_23', title: 'Rendre un objet emprunté', priority: PromisePriority.NORMALE, context: ContextType.PERSONNEL, dueOffsetDays: 7 },
  { id: 'tpl_24', title: 'Faire une recommandation', priority: PromisePriority.NORMALE, context: ContextType.TRAVAIL, dueOffsetDays: 5 },
  { id: 'tpl_25', title: 'Écrire une lettre de recommandation', priority: PromisePriority.ELEVEE, context: ContextType.TRAVAIL, dueOffsetDays: 7 },
  { id: 'tpl_26', title: 'Livrer le projet', priority: PromisePriority.CRITIQUE, context: ContextType.TRAVAIL, dueOffsetDays: 7 },
  { id: 'tpl_27', title: "Venir à l'événement", priority: PromisePriority.ELEVEE, context: ContextType.FAMILLE, dueOffsetDays: 14 },
  { id: 'tpl_28', title: 'Faire la réparation', priority: PromisePriority.NORMALE, context: ContextType.MAISON, dueOffsetDays: 7 },
  { id: 'tpl_29', title: 'Garder le secret', priority: PromisePriority.CRITIQUE, context: ContextType.PERSONNEL, dueOffsetDays: null },
  { id: 'tpl_30', title: 'Soutenir cette personne', priority: PromisePriority.ELEVEE, context: ContextType.FAMILLE, dueOffsetDays: 3 },
  { id: 'tpl_31', title: 'Transmettre le feedback', priority: PromisePriority.NORMALE, context: ContextType.TRAVAIL, dueOffsetDays: 2 },
  { id: 'tpl_32', title: 'Faire une surprise', priority: PromisePriority.NORMALE, context: ContextType.AMITIES, dueOffsetDays: 14 },
];
