
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getClientBySlug } from "@/services/clientService"
import { getDataUsersOfClientAction } from "@/app/admin/users/(crud)/actions"

interface Props {
  params: {
    slug: string
  }
}

export default async function WinesPage({ params: { slug } }: Props) {
  
  const client= await getClientBySlug(slug)
  if (!client) return <div>Cliente no encontrado</div>

  const users= await getDataUsersOfClientAction(client.id)

  return (
    <div className="w-full">      

      <div className="flex items-center justify-center my-4">
          <p className="text-2xl font-bold dark:text-white">Usuarios de {client.name}</p>
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={users} />      
      </div>
    </div>
)
}
