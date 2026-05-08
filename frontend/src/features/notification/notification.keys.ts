export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  feed: () => [...NOTIFICATION_KEYS.all, 'feed'] as const,
};