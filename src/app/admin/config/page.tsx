
import { ClientSelector, SelectorData } from "../client-selector"
import { getDataClients } from "../clients/(crud)/actions"
import APIToken from "./api-token"
import ClientConfig from "./client-config"

type Props = {
    searchParams: {
        clientId: string
    }
}
export default async function ConfigPage({ searchParams }: Props) {

    const clientId= searchParams.clientId
    console.log("clientId", clientId)    

    const clients= await getDataClients()
    const client= clients.find((client) => client.id === clientId)
    const selectors: SelectorData[]= clients.map((client) => ({ slug: client.id, name: client.nombre }))

    const API_TOKEN= process.env.API_TOKEN || "No configurado"

    return (
        <div className="flex flex-col items-center w-full p-5 gap-7">
            <p className="text-3xl font-bold text-center">Configuración</p>
            <div className="min-w-[270px] w-fit">
                <ClientSelector selectors={selectors} />
            </div>
            {
                client && <ClientConfig client={client} />
            }
            <APIToken apiToken={API_TOKEN} />
        </div>
    )
}
