import { SimilaritySearchResult, getSpecificPropertiesOfClient, promptChatGPT, similaritySearch } from "@/services/propertyService"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { TestTool, ToolValues } from "./test-tool"

interface Props {
    searchParams: {
        ids: string
    }
}
export default async function TestPage({ searchParams }: Props) {
    const idPropiedades= searchParams.ids ? searchParams.ids.split(",") : []

    // const clientId= 'clm865amy0009jepxozqh2ff9'

    // const idPropiedades= ["120", "330", "253", "401"]
    const clientId= 'clm865amy0009jepxozqh2ff9'
    const data= await getSpecificPropertiesOfClient(clientId, idPropiedades)

    async function update(data: ToolValues): Promise<SimilaritySearchResult[] | null> {
        "use server"
        
        try {
            //const results= await similaritySearch(clientId, data.input, 10)
            const limit= data.limit ? Number(data.limit) : 10
            const results= await promptChatGPT(clientId, data.model, data.prompt, data.input, limit)
    
            return results
        } catch (error) {
            console.log(error)
            return null            
        }
        
    }

    return (
        <div className="w-full">      

            <div className="flex justify-center">
                <p className="text-3xl font-bold">Pruebas</p>
            </div>

            <TestTool update={update} />

            <div className="container p-3 mx-auto mt-4 border rounded-md text-muted-foreground dark:text-white">
                <DataTable 
                    columns={columns} 
                    columnsOff={["precioVenta", "descripcion", "pais", "enAlquiler", "alquilada", "dormitorios", "banios", "garages", "parrilleros", "piscinas", "calefaccion", "amueblada", "piso", "seguridad", "asensor", "lavadero", "superficieConstruida"]}
                    data={data} 
                    idPropiedades={idPropiedades} />
            </div>
        </div>
    )
}
