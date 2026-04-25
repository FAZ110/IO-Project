import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'

export const employeeRequestsKeys = createQueryKeys('employee-requests', {
  detail: (requestId: string) => [requestId],
  list: null
})

export const queryKeys = mergeQueryKeys(employeeRequestsKeys)