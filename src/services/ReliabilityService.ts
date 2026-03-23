import { promiseRepository } from '../repositories/PromiseRepository';
import { settingsRepository } from '../repositories/SettingsRepository';
import { ReliabilityScore, ReliabilityLevel, PromiseStatus } from '../types';
import { differenceInDays } from 'date-fns';

export const computeReliabilityScore = async (): Promise<ReliabilityScore> => {
  const allPromises = await promiseRepository.findAll();

  const kept = allPromises.filter(p => p.status === PromiseStatus.TENUE);
  const overdue = allPromises.filter(p => p.status === PromiseStatus.EN_RETARD);
  const snoozed = allPromises.filter(p => p.status === PromiseStatus.REPORTEE);
  const totalClosed = kept.length + allPromises.filter(p => p.status === PromiseStatus.ANNULEE).length;

  // Average closure time (days) for kept promises
  let avgClosure: number | null = null;
  const closureTimes = kept
    .filter(p => p.completedAt && p.createdAt)
    .map(p => differenceInDays(new Date(p.completedAt!), new Date(p.createdAt)));

  if (closureTimes.length > 0) {
    avgClosure = Math.round(closureTimes.reduce((a, b) => a + b, 0) / closureTimes.length);
  }

  // Check-in streak
  const lastCheckin = await settingsRepository.get('last_checkin_date');
  const checkinStreak = lastCheckin ? computeCheckinStreak(lastCheckin) : 0;

  // Score computation (0-100)
  let score = 50; // Base

  if (totalClosed > 0) {
    const keptRate = kept.length / totalClosed;
    score = Math.round(keptRate * 70); // 70 points max for kept rate
  }

  // Penalties
  if (overdue.length > 0) {
    score -= Math.min(overdue.length * 3, 20);
  }
  if (snoozed.length > 0) {
    score -= Math.min(snoozed.length * 2, 10);
  }

  // Bonuses
  if (checkinStreak >= 7) score += 10;
  else if (checkinStreak >= 3) score += 5;

  if (avgClosure !== null && avgClosure <= 3) score += 5;

  score = Math.max(0, Math.min(100, score));

  const level = getReliabilityLevel(score);

  return {
    score,
    level,
    keptCount: kept.length,
    overdueCount: overdue.length,
    snoozedCount: snoozed.length,
    totalClosed,
    averageClosureTime: avgClosure,
    checkinStreak,
  };
};

const getReliabilityLevel = (score: number): ReliabilityLevel => {
  if (score >= 80) return ReliabilityLevel.SOLIDE;
  if (score >= 60) return ReliabilityLevel.STABLE;
  if (score >= 40) return ReliabilityLevel.A_RENFORCER;
  return ReliabilityLevel.SOUS_TENSION;
};

const computeCheckinStreak = (lastCheckinDate: string): number => {
  if (!lastCheckinDate) return 0;
  const last = new Date(lastCheckinDate);
  const today = new Date();
  const days = differenceInDays(today, last);
  if (days <= 1) return 1;
  return 0;
};
