import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'

export const employeeAssignmentsKeys = createQueryKeys('employee-assignments', {
  detail: (requestId: string) => [requestId],
  list: null
})

export const queryKeys = mergeQueryKeys(employeeAssignmentsKeys)