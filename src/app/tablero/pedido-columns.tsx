"use client";

import { Button } from "@/components/ui/button";
import { PedidoDAO } from "@/services/pedido-services";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUpDown, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<PedidoDAO>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original
      const numberFormatted= data.number.toString().padStart(4, "0")

      return (<p className="">#{numberFormatted}</p>)
    },
  },

  {
    accessorKey: "operacion",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Operacion
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original

      return (
        <Link href={`/tablero?id=${data.id}`} prefetch={false}>
          <Button size="sm" variant="link" className="p-0 text-left text-muted-foreground">
            <div className="w-[110px]">
              <p className="">{data.operacion}</p>
              <p className="whitespace-nowrap">{data.tipo}</p>
            </div>
          </Button>
        </Link>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "tipo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original
      const hourFormatted= format(data.createdAt, "HH:mm 'h'", { locale: es })
      const dateFormatted= format(data.createdAt, "MMM dd", { locale: es })

      return (
      <div>
        <p className="">{hourFormatted}</p>
        <p className="whitespace-nowrap">{dateFormatted}</p>
      </div>
      )
    },
  },
  {
    accessorKey: "look",
    header: ({ column }) => {
      return null
    },
    cell: ({ row }) => {
      const data = row.original

      return (
        <Link href={`/tablero?id=${data.id}`} prefetch={false}>
          <Button size="sm" variant="outline" className="bg-green-100 dark:text-black"><Eye /></Button>
        </Link>
)
    },
  },
];
