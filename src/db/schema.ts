export const CREATE_PROMISES_TABLE = `
  CREATE TABLE IF NOT EXISTS promises (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    normalizedTitle TEXT,
    personId TEXT,
    contextType TEXT NOT NULL DEFAULT 'personnel',
    dueDate TEXT,
    duePrecision TEXT NOT NULL DEFAULT 'aucune',
    priority TEXT NOT NULL DEFAULT 'normale',
    status TEXT NOT NULL DEFAULT 'ouverte',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    completedAt TEXT,
    snoozedUntil TEXT,
    lastViewedAt TEXT,
    lastReminderAt TEXT,
    isArchived INTEGER NOT NULL DEFAULT 0,
    sourceType TEXT NOT NULL DEFAULT 'manual',
    categoryId TEXT,
    riskScore REAL NOT NULL DEFAULT 0,
    notesCount INTEGER NOT NULL DEFAULT 0,
    followUpCount INTEGER NOT NULL DEFAULT 0,
    recurrence TEXT NOT NULL DEFAULT 'aucune',
    attachmentUri TEXT,
    FOREIGN KEY (personId) REFERENCES people(id)
  );
`;

export const CREATE_PEOPLE_TABLE = `
  CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'autre',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    notes TEXT,
    colorSeed INTEGER,
    archived INTEGER NOT NULL DEFAULT 0,
    relationshipWeight INTEGER NOT NULL DEFAULT 3
  );
`;

export const CREATE_PROMISE_NOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS promise_notes (
    id TEXT PRIMARY KEY NOT NULL,
    promiseId TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (promiseId) REFERENCES promises(id) ON DELETE CASCADE
  );
`;

export const CREATE_REMINDERS_TABLE = `
  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY NOT NULL,
    promiseId TEXT NOT NULL,
    remindAt TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'exact',
    isSent INTEGER NOT NULL DEFAULT 0,
    notificationId TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (promiseId) REFERENCES promises(id) ON DELETE CASCADE
  );
`;

export const CREATE_PROMISE_EVENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS promise_events (
    id TEXT PRIMARY KEY NOT NULL,
    promiseId TEXT NOT NULL,
    eventType TEXT NOT NULL,
    metadata TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (promiseId) REFERENCES promises(id) ON DELETE CASCADE
  );
`;

export const CREATE_PROMISE_TEMPLATES_TABLE = `
  CREATE TABLE IF NOT EXISTS promise_templates (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    defaultPriority TEXT NOT NULL DEFAULT 'normale',
    defaultContextType TEXT NOT NULL DEFAULT 'personnel',
    suggestedPersonType TEXT,
    defaultDueOffsetDays INTEGER,
    builtIn INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`;

export const CREATE_CATEGORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    label TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    builtIn INTEGER NOT NULL DEFAULT 0
  );
`;

export const CREATE_TAGS_TABLE = `
  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY NOT NULL,
    label TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`;

export const CREATE_PROMISE_TAGS_TABLE = `
  CREATE TABLE IF NOT EXISTS promise_tags (
    promiseId TEXT NOT NULL,
    tagId TEXT NOT NULL,
    PRIMARY KEY (promiseId, tagId),
    FOREIGN KEY (promiseId) REFERENCES promises(id) ON DELETE CASCADE,
    FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
  );
`;

export const CREATE_APP_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`;

export const ALL_TABLES = [
  CREATE_PEOPLE_TABLE,
  CREATE_PROMISES_TABLE,
  CREATE_PROMISE_NOTES_TABLE,
  CREATE_REMINDERS_TABLE,
  CREATE_PROMISE_EVENTS_TABLE,
  CREATE_PROMISE_TEMPLATES_TABLE,
  CREATE_CATEGORIES_TABLE,
  CREATE_TAGS_TABLE,
  CREATE_PROMISE_TAGS_TABLE,
  CREATE_APP_SETTINGS_TABLE,
];

export const INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_promises_personId ON promises(personId);',
  'CREATE INDEX IF NOT EXISTS idx_promises_status ON promises(status);',
  'CREATE INDEX IF NOT EXISTS idx_promises_dueDate ON promises(dueDate);',
  'CREATE INDEX IF NOT EXISTS idx_promises_isArchived ON promises(isArchived);',
  'CREATE INDEX IF NOT EXISTS idx_promise_notes_promiseId ON promise_notes(promiseId);',
  'CREATE INDEX IF NOT EXISTS idx_reminders_promiseId ON reminders(promiseId);',
  'CREATE INDEX IF NOT EXISTS idx_reminders_remindAt ON reminders(remindAt);',
  'CREATE INDEX IF NOT EXISTS idx_promise_events_promiseId ON promise_events(promiseId);',
  'CREATE INDEX IF NOT EXISTS idx_promise_tags_promiseId ON promise_tags(promiseId);',
];
