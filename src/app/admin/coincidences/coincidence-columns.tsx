"use client";

import { Button } from "@/components/ui/button";
import { CoincidenceDAO } from "@/services/coincidence-services";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  DeleteCoincidenceDialog,
  CoincidenceDialog,
} from "./coincidence-dialogs";

export const columns: ColumnDef<CoincidenceDAO>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      );
    },
  },

  {
    accessorKey: "distance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Distance
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      );
    },
  },

  {
    accessorKey: "pedidoId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PedidoId
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      );
    },
  },

  {
    accessorKey: "propertyId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PropertyId
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      );
    },
  },

  // {
  //   accessorKey: "role",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="pl-0 dark:text-white"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Rol
  //         <ArrowUpDown className="w-4 h-4 ml-1" />
  //       </Button>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      const description = `Do you want to delete Coincidence ${data.id}?`;

      return (
        <div className="flex items-center justify-end gap-2">
          <CoincidenceDialog id={data.id} />
          <DeleteCoincidenceDialog description={description} id={data.id} />
        </div>
      );
    },
  },
];
