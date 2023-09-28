import { prompt } from "@/services/clientService";
import { SimilaritySearchResult, similaritySearch } from "@/services/propertyService";
import { NextResponse } from "next/server";

type Propiedad= {
    url: string
    titulo: string
    características: string
}

export async function POST(request: Request) {

    try {
        const json= await request.json()
        console.log("json: ", json)

        const apiToken= json.apiToken
        if (!apiToken) return NextResponse.json({ error: "apiToken is required" }, { status: 400 })
        if (apiToken !== process.env.API_TOKEN) return NextResponse.json({ error: "Bad apiToken" }, { status: 400 })

        const limit = json.limit ? Number(json.limit) : 10

        const clientId = json.clientId
        if (!clientId) {
            return NextResponse.json({ error: "clientId is required" }, { status: 400 })
        }        
        const input = json.input
        if (!input) {
            return NextResponse.json({ error: "input is required" }, { status: 400 })
        }

        console.log("input: ", input)        
        
        const similarityArray= await similaritySearch(clientId, input, limit)
        const transformedResults: Propiedad[]= []
        similarityArray.forEach((item) => {
            const transformedItem= {
                url: item.url,
                titulo: item.titulo,
                características: item.content
            }
            transformedResults.push(transformedItem)
        })            

        console.log(transformedResults)        

        return NextResponse.json({ data: transformedResults }, { status: 200 })

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
  