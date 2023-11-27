
import { getDataClients } from "../clients/(crud)/actions"
import APIToken from "./api-token"
import BudgetPerc from "./budget-perc"
import Hook from "./hook"

export default async function ConfigPage() {

    const clients= await getDataClients()

    const API_TOKEN= process.env.API_TOKEN || "No configurado"

    return (
        <div className="container mt-10 space-y-5">
            <p className="mb-4 text-3xl font-bold text-center">Hooks para WhatsApp</p>
            {
                clients.map(client => (
                    <div key={client.id} 
                        className="w-full p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{client.nombre}</p>
                        <Hook clientId={client.id} />
                        <BudgetPerc clientId={client.id} />
                    </div>
                ))
            }
            <p className="mt-3 mb-4 text-3xl font-bold text-center">Authorization tokens</p>
            <APIToken apiToken={API_TOKEN} />
        </div>
    )
}
