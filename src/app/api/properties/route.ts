import { prompt } from "@/services/clientService";
import { SimilaritySearchResult, promptChatGPT } from "@/services/propertyService";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

    try {
        const json= await request.json()
        console.log("json: ", json)

        const apiToken= json.apiToken
        if (!apiToken) return NextResponse.json({ error: "apiToken is required" }, { status: 400 })
        if (apiToken !== process.env.API_TOKEN) return NextResponse.json({ error: "Bad apiToken" }, { status: 400 })


        const model = json.model || "gpt-3.5-turbo"
        const limit = json.limit ? Number(json.limit) : 10

        const clientId = json.clientId
        if (!clientId) {
            return NextResponse.json({ error: "clientId is required" }, { status: 400 })
        }        
        const input = json.input
        if (!input) {
            return NextResponse.json({ error: "input is required" }, { status: 400 })
        }

        const results= await promptChatGPT(clientId, model, prompt, input, limit)
        const apiResults= results.map((item) => getAPIResult(item))
        // print results each in one line
        apiResults.forEach((item) => console.log(item.idPropiedad + ": " + item.titulo))
        

        if (apiResults[0].titulo === "SIN_RESULTADOS") {
            return NextResponse.json({ data: "SIN_RESULTADOS" }, { status: 200 })
        }


        return NextResponse.json({ data: apiResults }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "error: " + error}, { status: 502 })        
    }
   
}

function getAPIResult(serviceResult: SimilaritySearchResult) {
    let titulo= serviceResult.titulo
    
    if (titulo === ""){
        const sentences= serviceResult.content.split(".")
        titulo= sentences[0]
    }
    return {
        idPropiedad: serviceResult.idPropiedad,
        titulo: titulo,
    }
    
}

export type APIResult = {
    idPropiedad: string
    titulo: string
}
  