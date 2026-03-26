export * from './strings.fr';
export * from './theme';
export * from './datasets';

export const FREE_TIER_LIMITS = {
  maxActivePromises: 25,
  maxPeople: 10,
  maxRemindersPerPromise: 1,
};

export const PREMIUM_FEATURES = {
  maxActivePromises: null,
  maxPeople: null,
  maxRemindersPerPromise: 10,
  advancedRiskView: true,
  fullHistory: true,
  customTemplates: true,
  exportLocal: true,
  advancedFilters: true,
  detailedReliabilityScore: true,
  recurringPromises: true,
  customTags: true,
};

export const STALE_PROMISE_DAYS = 7;
export const RECENT_VIEW_DAYS = 3;
export const NOT_REVIEWED_DAYS = 14;
export const RISK_SCORE_THRESHOLD_ATTENTION = 30;
export const RISK_SCORE_THRESHOLD_SURVEILLER = 60;
export const RISK_SCORE_THRESHOLD_CRITIQUE = 80;
