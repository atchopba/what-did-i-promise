import {
  Promise as PromiseEntity,
  PromiseWithPerson,
  PromisePriority,
  PromiseStatus,
  RiskLevel,
} from '../types';
import {
  RISK_SCORE_THRESHOLD_ATTENTION,
  RISK_SCORE_THRESHOLD_SURVEILLER,
  RISK_SCORE_THRESHOLD_CRITIQUE,
} from '../constants';
import { promiseRepository } from '../repositories/PromiseRepository';

// Weights for each risk factor (total ~100 when all bad)
const WEIGHTS = {
  overdue: 25,           // Past due date
  dueSoon: 15,           // Due within 24h
  highPriority: 15,      // Élevée or Critique
  noActiveReminder: 10,  // No reminder set
  notReviewedLong: 10,   // Not viewed in 14+ days
  alreadySnoozed: 10,    // Was snoozed at least once
  openTooLong: 10,       // Open for 30+ days
  impreciseDueOld: 10,   // Imprecise date, old promise
  noNotes: 5,            // No follow-up notes
  relationshipWeight: 15, // High relationship weight (bonus applied)
};

export const computeRiskScore = async (promise: PromiseEntity | PromiseWithPerson): Promise<number> => {
  // Only score active promises
  if ([PromiseStatus.TENUE, PromiseStatus.ANNULEE, PromiseStatus.ARCHIVEE].includes(promise.status)) {
    return 0;
  }

  let score = 0;
  const now = new Date();
  const createdAt = new Date(promise.createdAt);
  const daysSinceCreation = (now.getTime() - createdAt.getTime()) / 86400000;

  // 1. Overdue
  if (promise.dueDate) {
    const due = new Date(promise.dueDate);
    if (due < now) {
      score += WEIGHTS.overdue;
    } else if (due.getTime() - now.getTime() < 86400000) {
      score += WEIGHTS.dueSoon;
    }
  }

  // 2. High priority
  if (promise.priority === PromisePriority.CRITIQUE) {
    score += WEIGHTS.highPriority;
  } else if (promise.priority === PromisePriority.ELEVEE) {
    score += WEIGHTS.highPriority * 0.6;
  }

  // 3. Not reviewed recently (14+ days)
  if (promise.lastViewedAt) {
    const daysSinceView = (now.getTime() - new Date(promise.lastViewedAt).getTime()) / 86400000;
    if (daysSinceView > 14) score += WEIGHTS.notReviewedLong;
    else if (daysSinceView > 7) score += WEIGHTS.notReviewedLong * 0.5;
  } else if (daysSinceCreation > 7) {
    score += WEIGHTS.notReviewedLong;
  }

  // 4. Already snoozed
  if (promise.status === PromiseStatus.REPORTEE) {
    score += WEIGHTS.alreadySnoozed;
  }

  // 5. Open too long (30+ days)
  if (daysSinceCreation > 30) {
    score += WEIGHTS.openTooLong;
  } else if (daysSinceCreation > 14) {
    score += WEIGHTS.openTooLong * 0.5;
  }

  // 6. Imprecise date, old promise
  if (!promise.dueDate && daysSinceCreation > 7) {
    score += WEIGHTS.impreciseDueOld;
  }

  // 7. No notes / no follow-up
  if (promise.notesCount === 0 && daysSinceCreation > 3) {
    score += WEIGHTS.noNotes;
  }

  // 8. Relationship weight bonus
  const person = (promise as PromiseWithPerson).person;
  if (person && person.relationshipWeight) {
    // Weight 1 = 0 bonus, weight 5 = full bonus
    const relBonus = ((person.relationshipWeight - 1) / 4) * WEIGHTS.relationshipWeight;
    score += relBonus;
  }

  // Cap at 100
  return Math.min(Math.round(score), 100);
};

export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= RISK_SCORE_THRESHOLD_CRITIQUE) return RiskLevel.CRITIQUE;
  if (score >= RISK_SCORE_THRESHOLD_SURVEILLER) return RiskLevel.SURVEILLER;
  if (score >= RISK_SCORE_THRESHOLD_ATTENTION) return RiskLevel.ATTENTION;
  return RiskLevel.FAIBLE;
};

export const getRiskPromises = async (minLevel: RiskLevel = RiskLevel.ATTENTION): Promise<PromiseWithPerson[]> => {
  const active = await promiseRepository.findActive();
  const withScores = await Promise.all(
    active.map(async p => {
      const score = await computeRiskScore(p);
      return { ...p, riskScore: score };
    })
  );

  const minScore =
    minLevel === RiskLevel.CRITIQUE ? RISK_SCORE_THRESHOLD_CRITIQUE :
    minLevel === RiskLevel.SURVEILLER ? RISK_SCORE_THRESHOLD_SURVEILLER :
    RISK_SCORE_THRESHOLD_ATTENTION;

  return withScores
    .filter(p => p.riskScore >= minScore)
    .sort((a, b) => b.riskScore - a.riskScore);
};

export const refreshAllRiskScores = async (): Promise<void> => {
  const active = await promiseRepository.findActive();
  await Promise.all(
    active.map(async p => {
      const score = await computeRiskScore(p);
      await promiseRepository.updateRiskScore(p.id, score);
    })
  );
};
