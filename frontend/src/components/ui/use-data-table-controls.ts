import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

export interface DataTableControl {
  pagination: PaginationState
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>
}

export function useDataTableControls(initialPageSize = 10): DataTableControl {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  return {
    pagination,
    onPaginationChange: setPagination,
  }
}
