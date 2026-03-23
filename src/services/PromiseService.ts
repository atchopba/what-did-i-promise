import { promiseRepository } from '../repositories/PromiseRepository';
import { eventRepository } from '../repositories/EventRepository';
import { noteRepository } from '../repositories/NoteRepository';
import { reminderRepository } from '../repositories/ReminderRepository';
import { templateRepository } from '../repositories/TemplateRepository';
import { Share } from 'react-native';
import { scheduleReminder, cancelNotification } from './NotificationService';
import { computeRiskScore } from './RiskService';
import {
  Promise as PromiseEntity,
  CreatePromiseDTO,
  UpdatePromiseDTO,
  PromiseWithPerson,
  PromiseWithDetails,
  PromiseStatus,
  EventType,
  RecurrenceType,
  SourceType,
  DuePrecision,
  ReminderType,
  TimeSection,
} from '../types';
import { FR } from '../constants/strings.fr';
import { addDays, addWeeks, addMonths } from 'date-fns';

// Micro-feedback messages when a promise is kept
const KEPT_MESSAGES = FR.feedback.kept;

export interface CompletePromiseResult {
  promise: PromiseEntity;
  feedbackMessage: string;
  regenerated?: PromiseEntity;
}

export const createPromise = async (dto: CreatePromiseDTO): Promise<PromiseEntity> => {
  const promise = await promiseRepository.create(dto);

  await eventRepository.log(promise.id, EventType.CREATED, { title: promise.title });

  // Schedule reminder if requested
  if (dto.reminderEnabled && dto.reminderAt) {
    const reminder = await reminderRepository.create(promise.id, dto.reminderAt, ReminderType.EXACT);
    const notifId = await scheduleReminder(reminder, promise.title);
    if (notifId) {
      await reminderRepository.updateNotificationId(reminder.id, notifId);
    }
  }

  // Update risk score
  const score = await computeRiskScore(promise);
  await promiseRepository.updateRiskScore(promise.id, score);

  return promise;
};

export const updatePromise = async (id: string, dto: UpdatePromiseDTO): Promise<PromiseEntity | null> => {
  const promise = await promiseRepository.update(id, dto);
  if (!promise) return null;

  await eventRepository.log(id, EventType.UPDATED);

  // Recompute risk score
  const score = await computeRiskScore(promise);
  await promiseRepository.updateRiskScore(id, score);

  return promise;
};

export const completePromise = async (id: string): Promise<CompletePromiseResult | null> => {
  const promise = await promiseRepository.findById(id);
  if (!promise) return null;

  await promiseRepository.updateStatus(id, PromiseStatus.TENUE);

  // Cancel pending reminders
  const reminders = await reminderRepository.findByPromiseId(id);
  for (const r of reminders) {
    if (r.notificationId) await cancelNotification(r.notificationId);
  }

  await eventRepository.log(id, EventType.COMPLETED);

  // Random positive feedback
  const feedbackMessage = KEPT_MESSAGES[Math.floor(Math.random() * KEPT_MESSAGES.length)];

  // Handle recurrence
  let regenerated: PromiseEntity | undefined;
  if (promise.recurrence && promise.recurrence !== RecurrenceType.AUCUNE) {
    regenerated = await regenerateRecurringPromise(promise) ?? undefined;
  }

  const updated = await promiseRepository.findById(id);
  return { promise: updated!, feedbackMessage, regenerated };
};

export const snoozePromise = async (id: string, snoozedUntil: string): Promise<PromiseEntity | null> => {
  const promise = await promiseRepository.update(id, {
    status: PromiseStatus.REPORTEE,
    snoozedUntil,
    dueDate: snoozedUntil,
    duePrecision: DuePrecision.DATE_EXACTE,
  });

  if (promise) {
    await eventRepository.log(id, EventType.SNOOZED, { snoozedUntil });

    // Reschedule reminder
    const reminders = await reminderRepository.findByPromiseId(id);
    for (const r of reminders) {
      if (r.notificationId) await cancelNotification(r.notificationId);
    }
    const newReminder = await reminderRepository.create(id, snoozedUntil, ReminderType.EXACT);
    const notifId = await scheduleReminder(newReminder, promise.title);
    if (notifId) await reminderRepository.updateNotificationId(newReminder.id, notifId);
  }

  return promise;
};

export const archivePromise = async (id: string): Promise<void> => {
  const reminders = await reminderRepository.findByPromiseId(id);
  for (const r of reminders) {
    if (r.notificationId) await cancelNotification(r.notificationId);
  }
  await promiseRepository.archive(id);
  await eventRepository.log(id, EventType.ARCHIVED);
};

export const addNote = async (promiseId: string, content: string) => {
  const note = await noteRepository.create(promiseId, content);
  await promiseRepository.incrementNotesCount(promiseId);
  await eventRepository.log(promiseId, EventType.NOTE_ADDED, { noteId: note.id });
  return note;
};

export const createFromTemplate = async (
  templateId: string,
  overrides?: Partial<CreatePromiseDTO>
): Promise<PromiseEntity | null> => {
  const template = await templateRepository.findById(templateId);
  if (!template) return null;

  const dueDate = template.defaultDueOffsetDays
    ? addDays(new Date(), template.defaultDueOffsetDays).toISOString()
    : null;

  const dto: CreatePromiseDTO = {
    title: template.title,
    contextType: template.defaultContextType,
    priority: template.defaultPriority,
    dueDate,
    duePrecision: dueDate ? DuePrecision.DATE_EXACTE : DuePrecision.AUCUNE,
    sourceType: SourceType.TEMPLATE,
    ...overrides,
  };

  return createPromise(dto);
};

export const regenerateRecurringPromise = async (
  completed: PromiseEntity
): Promise<PromiseEntity | null> => {
  if (!completed.recurrence || completed.recurrence === RecurrenceType.AUCUNE) return null;

  let nextDueDate: Date | null = null;
  const base = completed.dueDate ? new Date(completed.dueDate) : new Date();

  switch (completed.recurrence) {
    case RecurrenceType.QUOTIDIENNE:
      nextDueDate = addDays(base, 1);
      break;
    case RecurrenceType.HEBDOMADAIRE:
      nextDueDate = addWeeks(base, 1);
      break;
    case RecurrenceType.BIMENSUELLE:
      nextDueDate = addWeeks(base, 2);
      break;
    case RecurrenceType.MENSUELLE:
      nextDueDate = addMonths(base, 1);
      break;
    case RecurrenceType.TRIMESTRIELLE:
      nextDueDate = addMonths(base, 3);
      break;
    default:
      return null;
  }

  return createPromise({
    title: completed.title,
    personId: completed.personId,
    contextType: completed.contextType,
    priority: completed.priority,
    dueDate: nextDueDate.toISOString(),
    duePrecision: DuePrecision.DATE_EXACTE,
    recurrence: completed.recurrence,
    categoryId: completed.categoryId,
    sourceType: SourceType.RECURRING,
  });
};

export const groupPromisesByTimeSection = (promises: PromiseWithPerson[]): TimeSection[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = addDays(today, 7);

  const sections: TimeSection[] = [
    { key: 'today', title: FR.promises.sections.today, data: [] },
    { key: 'overdue', title: FR.promises.sections.overdue, data: [] },
    { key: 'thisWeek', title: FR.promises.sections.thisWeek, data: [] },
    { key: 'noDate', title: FR.promises.sections.noDate, data: [] },
    { key: 'recentlyDone', title: FR.promises.sections.recentlyDone, data: [] },
  ];

  for (const p of promises) {
    if (p.status === PromiseStatus.TENUE) {
      sections[4].data.push(p);
      continue;
    }
    if (!p.dueDate) {
      sections[3].data.push(p);
      continue;
    }
    const due = new Date(p.dueDate);
    due.setHours(0, 0, 0, 0);
    if (due < today) {
      sections[1].data.push(p);
    } else if (due.getTime() === today.getTime()) {
      sections[0].data.push(p);
    } else if (due <= weekEnd) {
      sections[2].data.push(p);
    } else {
      sections[2].data.push(p);
    }
  }

  return sections.filter(s => s.data.length > 0);
};

export const deriveDisplayStatus = (promise: PromiseEntity): PromiseStatus => {
  if (promise.status === PromiseStatus.OUVERTE && promise.dueDate) {
    const due = new Date(promise.dueDate);
    if (due < new Date()) return PromiseStatus.EN_RETARD;
  }
  return promise.status;
};

export const sharePromise = async (promise: PromiseWithPerson): Promise<void> => {
  const message = FR.share.message.replace('{title}', promise.title);
  try {
    await Share.share({ message, title: FR.share.title });
    await eventRepository.log(promise.id, EventType.SHARED);
  } catch (_) {
    // User dismissed share sheet
  }
};

export const getPromiseWithDetails = async (id: string): Promise<PromiseWithDetails | null> => {
  const promise = await promiseRepository.findWithPerson(id);
  if (!promise) return null;

  await promiseRepository.updateLastViewed(id);

  const [notes, reminders, events] = await Promise.all([
    noteRepository.findByPromiseId(id),
    reminderRepository.findByPromiseId(id),
    eventRepository.findByPromiseId(id),
  ]);

  return { ...promise, notes, reminders, events };
};
