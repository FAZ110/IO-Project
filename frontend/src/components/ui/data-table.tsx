"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
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
import { useState } from "react"
import { Button } from "./button"

interface ServerPagination {
  pageIndex: number
  pageCount: number
  totalItems: number
  onPageChange: (page: number) => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  serverPagination?: ServerPagination
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  serverPagination,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [clientPagination, setClientPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const isServerSide = !!serverPagination;

  const table = useReactTable(
    isServerSide
      ? {
          data,
          columns,
          getCoreRowModel: getCoreRowModel(),
          manualPagination: true,
          pageCount: serverPagination.pageCount,
          state: {
            pagination: { pageIndex: serverPagination.pageIndex, pageSize: 20 },
          },
          onPaginationChange: () => {},
        }
      : {
          data,
          columns,
          getCoreRowModel: getCoreRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          onPaginationChange: setClientPagination,
          state: { pagination: clientPagination },
        }
  )

  const totalItems = isServerSide ? serverPagination.totalItems : data.length
  const currentPage = isServerSide
    ? serverPagination.pageIndex + 1
    : table.getState().pagination.pageIndex + 1
  const pageCount = isServerSide ? serverPagination.pageCount : table.getPageCount()
  const canPrev = isServerSide
    ? serverPagination.pageIndex > 0
    : table.getCanPreviousPage()
  const canNext = isServerSide
    ? serverPagination.pageIndex < serverPagination.pageCount - 1
    : table.getCanNextPage()

  const handlePrev = () => {
    if (isServerSide) serverPagination.onPageChange(serverPagination.pageIndex - 1)
    else table.previousPage()
  }

  const handleNext = () => {
    if (isServerSide) serverPagination.onPageChange(serverPagination.pageIndex + 1)
    else table.nextPage()
  }

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
          Łącznie: <span className="text-foreground">{totalItems}</span> pozycji
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center justify-center text-sm font-medium">
            Strona {pageCount === 0 ? 0 : currentPage} z {pageCount}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={!canPrev}
              className="h-8 w-24"
            >
              Poprzednia
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!canNext}
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
