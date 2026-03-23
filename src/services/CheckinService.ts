import { promiseRepository } from '../repositories/PromiseRepository';
import { settingsRepository } from '../repositories/SettingsRepository';
import { DailyCheckin, PromiseWithPerson } from '../types';
import { NOT_REVIEWED_DAYS, STALE_PROMISE_DAYS } from '../constants';
import { subDays, isBefore } from 'date-fns';

export const buildDailyCheckin = async (): Promise<DailyCheckin> => {
  const [today, overdue, thisWeek, stale] = await Promise.all([
    promiseRepository.findDueToday(),
    promiseRepository.findOverdue(),
    promiseRepository.findDueThisWeek(),
    promiseRepository.findStale(STALE_PROMISE_DAYS),
  ]);

  // At risk: promises with high risk score
  const active = await promiseRepository.findActive();
  const atRisk = active.filter(p => p.riskScore >= 60);

  // Not reviewed recently
  const cutoff = subDays(new Date(), NOT_REVIEWED_DAYS);
  const notReviewedRecently = active.filter(p => {
    if (!p.lastViewedAt) return true;
    return isBefore(new Date(p.lastViewedAt), cutoff);
  });

  const lastCheckin = await settingsRepository.get('last_checkin_date');

  return {
    today,
    overdue,
    comingSoon: thisWeek,
    atRisk,
    notReviewedRecently: notReviewedRecently.slice(0, 5),
    lastCheckinDate: lastCheckin,
  };
};

export const completeCheckin = async (): Promise<void> => {
  await settingsRepository.set('last_checkin_date', new Date().toISOString());
};

export const getCheckinSummary = async (): Promise<{
  todayCount: number;
  overdueCount: number;
  atRiskCount: number;
}> => {
  const checkin = await buildDailyCheckin();
  return {
    todayCount: checkin.today.length,
    overdueCount: checkin.overdue.length,
    atRiskCount: checkin.atRisk.length,
  };
};
