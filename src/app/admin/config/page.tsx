import getClients from "@/services/clientService"
import Hook from "./hook"

export default async function ConfigPage() {

    const clients= await getClients()

    return (
        <div className="container mt-10 space-y-5">
            <p className="mb-4 text-3xl font-bold text-center">Hoks para WhatsApp</p>
            {
                clients.map(client => (
                    <div key={client.id} 
                        className="w-full p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{client.name}</p>
                        <Hook clientId={client.id} />
                    </div>
                ))
            }
        </div>
    )
}
