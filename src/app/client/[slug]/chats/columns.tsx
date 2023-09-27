"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowUpDown } from "lucide-react"
import { DataConversation } from "./actions"
import Link from "next/link"

export const columns: ColumnDef<DataConversation>[] = [
  {
    accessorKey: "fecha",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Creado
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
  },
  {
    accessorKey: "celular",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Celular
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )
    },
    cell: ({ row }) => {
      const data= row.original     
 
      return (
        <div className="flex items-center justify-start flex-1">
          <Link href={`/client/${data.clienteSlug}/chats/${data.id}`}>
              <Button variant="link" className="pl-0 dark:text-white">
                {data.celular}
              </Button>
          </Link>
        </div>

      )
    },

  },
]
