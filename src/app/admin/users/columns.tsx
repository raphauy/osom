"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { DataUser, create, eliminate, update } from "./(crud)/actions"
import { UserDialog } from "./(crud)/user-dialog"
import { DeleteDialog } from "./(crud)/delete-dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<DataUser>[] = [
  {
    accessorKey: "nombre",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
    )
  },
  },
  {
    accessorKey: "rol",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rol
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "verificado",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Verificado
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.original
      if (!data.verificado) return <div></div> 
      return (<p>{data.verificado && format(data.verificado, "MMMM dd, yyyy", { locale: es})}</p>)
    },
  },
  {
    accessorKey: "cliente",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Cliente
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const editTrigger= (<Edit size={30} className="pr-2 hover:cursor-pointer text-sky-400"/>)
      const eliminateTrigger= (<Trash2 className="text-red-400 hover:cursor-pointer"/>)
      const title= "Eliminar Cliente"
      const description= `Desea eliminar el cliente ${data.nombre}?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          <UserDialog create={create} update={update} title="Editar Usuario" trigger={editTrigger} id={data.id} />
          <DeleteDialog eliminate={eliminate} title={title} description={description} trigger={eliminateTrigger} id={data.id} />
        </div>

      )
    },
  },
]
