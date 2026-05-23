"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import { useDataTableControls, type DataTableControl } from "@/lib/use-data-table-controls"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  control?: DataTableControl
  pageCount?: number
  totalItems?: number
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  control,
  pageCount,
  totalItems,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const backoffControl = useDataTableControls(10)
  const activeControl = control ?? backoffControl

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(control
      ? { pageCount: pageCount ?? 0, manualPagination: true }
      : { getPaginationRowModel: getPaginationRowModel() }
    ),
    state: { pagination: activeControl.pagination },
    onPaginationChange: activeControl.onPaginationChange,
  })

  const displayTotal = totalItems ?? data.length
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="flex-1 overflow-x-auto">
        <Table>
          <TableHeader className="bg-white sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{
                    maxWidth: header.column.columnDef.size,
                    minWidth: header.column.columnDef.size,
                  }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground animate-pulse">
                  Ładowanie...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={`even:bg-muted/50 hover:bg-muted/80 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{
                      maxWidth: cell.column.columnDef.size,
                      minWidth: cell.column.columnDef.size,
                    }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="shrink-0 flex items-center justify-between px-4 py-4 border-t bg-muted/10">
        <div className="text-sm text-muted-foreground font-medium">
          Łącznie: <span className="text-foreground">{displayTotal}</span> pozycji
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center justify-center text-sm font-medium">
            Strona {totalPages === 0 ? 0 : currentPage} z {totalPages}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-24"
            >
              Poprzednia
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-24"
            >
              Następna
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
