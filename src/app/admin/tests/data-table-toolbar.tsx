"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  idPropiedades: string[]
}

export function DataTableToolbar<TData>({ table, idPropiedades }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex">
        <div>
          {table.getColumn("idPropiedad") && idPropiedades.length>0 && (
            <DataTableFacetedFilter
              column={table.getColumn("idPropiedad")}
              title="Id Propiedad"
              options={idPropiedades}
            />
          )}
        </div>
        <div className="flex-1 ">
          <DataTableViewOptions table={table}/>
        </div>

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
  )
}