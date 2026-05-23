import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

export interface DataTableControl {
  pagination: PaginationState
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>
  resetPage: () => void
}

export function useDataTableControls(initialPageSize = 10): DataTableControl {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }))

  return {
    pagination,
    onPaginationChange: setPagination,
    resetPage,
  }
}
