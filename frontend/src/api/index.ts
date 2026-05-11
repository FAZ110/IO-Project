import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'

export const employeeAssignmentsKeys = createQueryKeys('employee-assignments', {
  detail: (requestId: string) => [requestId],
  list: null
})

export const notificationsKeys = createQueryKeys('notifications', {
  feed: (unreadOnly: boolean, page: number) => [{ unreadOnly, page }],
  unreadCount: () => ['count'],
  infinite: (unreadOnly: boolean) => [{ unreadOnly, type: 'infinite' }],
});

export const queryKeys = mergeQueryKeys(employeeAssignmentsKeys, notificationsKeys)