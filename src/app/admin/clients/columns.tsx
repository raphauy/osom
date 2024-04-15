"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { DataClient, create, eliminate, update } from "./(crud)/actions"
import { ClientDialog } from "./(crud)/client-dialog"
import { DeleteDialog } from "./(crud)/delete-dialog"


export const columns: ColumnDef<DataClient>[] = [
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
    accessorKey: "descripcion",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Descripción
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Web
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data= row.original     
 
      return (
        <div className="flex items-center justify-start flex-1">
          <Link href={`${data.url}`} target="_blank">
              {data.url}
          </Link>
        </div>

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
      const description= `Desea eliminar el cliente ${data.nombre}? Atención, se eliminará también sus propiedades, sus conversaciones y sus usuarios.`
 
      return (
        <div className="flex items-center justify-end gap-2">
          <ClientDialog create={create} update={update} title="Editar Usuario" trigger={editTrigger} id={data.id} />
          <DeleteDialog eliminate={eliminate} title={title} description={description} trigger={eliminateTrigger} id={data.id} />
        </div>

      )
    },
  },
]
