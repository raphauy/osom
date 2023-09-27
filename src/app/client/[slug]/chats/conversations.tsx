import { getClientBySlug } from "@/services/clientService"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { getDataConversations } from "./actions"
import { getDataClient } from "@/app/admin/clients/(crud)/actions"

interface Props {
    clientId: string
}
  
export default async function Conversations({ clientId }: Props) {
  
    const client= await getDataClient(clientId)
    if (!client) return <div>Cliente no encontrado</div>

    const data= await getDataConversations(client.id)

    return (
        <div className="w-72">
            <div className="flex items-center justify-center">
                
            </div>

            <div className="p-3 py-4 mx-auto text-muted-foreground dark:text-white">
                <DataTable columns={columns} data={data} />      
            </div>

        </div>
    )
}
