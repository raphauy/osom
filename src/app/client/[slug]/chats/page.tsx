import { getClientBySlug } from "@/services/clientService"

interface Props {
    params: {
      slug: string
    }
  }
  
export default async function ChatPage({ params: { slug } }: Props) {
  
    const client= await getClientBySlug(slug)
    if (!client) return <div>Cliente no encontrado</div>

    return (
        <div className="w-full">
            <div className="flex items-center justify-center my-4">
                <p className="text-2xl font-bold dark:text-white">Chats de {client.name}</p>
            </div>

            <div className="mt-10 text-xl text-center text-muted-foreground">No implementdo</div>
        </div>
    )
}
