"use client";

import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PedidoDAO } from "@/services/pedido-services";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState, Table as TanstackTable, VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { PlusCircle, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { PedidoDialog } from "./pedido-dialogs";

interface DataTableToolbarProps<TData> {
  table: TanstackTable<TData>;
}

export function DataTableToolbar<TData>({table}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between dark:text-white">
      <div className="flex items-center flex-1 gap-1">
        <h2 className="text-2xl font-semibold leading-none tracking-tight text-black dark:text-white">Pedidos</h2>
        <PedidoDialog />

      </div>
      <div className="flex gap-1">
        {table.getColumn("operacion") && (
          <DataTableFacetedFilter
            column={table.getColumn("operacion")}
            title="Operación"
            options={["ALQUILER", "VENTA"]}
          />
        )}
        {table.getColumn("tipo") && (
          <DataTableFacetedFilter
            column={table.getColumn("tipo")}
            title="Tipo"
            options={["Casa", "Apartamento", "Casa o Apartamento", "Local", "Terreno"]}
          />
        )}



        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnsOff?: string[];
  subject: string;
}

export function DataTable<TData, TValue>({columns, data, columnsOff, subject}: DataTableProps<TData, TValue>) {
  const searchParams= useSearchParams()
  const actualId= searchParams.get("id")

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  React.useEffect(() => {
    columnsOff &&
      columnsOff.forEach((colName) => {
        table.getColumn(colName)?.toggleVisibility(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full mt-3 space-y-1 dark:text-white">
      <DataTableToolbar table={table} />
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {                   
                    const data= cell.row.original as PedidoDAO
                    
                    return (                 
                      <TableCell key={cell.id} className={cn(actualId === data.id && "bg-green-200 dark:text-black font-bold")}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                  )})}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} subject={subject} />
    </div>
  );
}
