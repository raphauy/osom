import { getClientBySlug } from "@/services/clientService"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { getDataConversations } from "./actions"
import { MoveLeft } from "lucide-react"

interface Props {
    params: {
      slug: string
    }
  }
  
export default async function ChatPage({ params: { slug } }: Props) {
  
    const client= await getClientBySlug(slug)
    if (!client) return <div>Cliente no encontrado</div>

    return (
        <div className="flex items-center justify-center w-full gap-4 mt-32 text-2xl">
            
            <MoveLeft /> <p>Seleccione un chat</p>

        </div>
    )
}
