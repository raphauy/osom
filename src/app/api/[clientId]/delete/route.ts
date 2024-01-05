import { deleteAllPropertiesOfClient, deleteProperty, deletePropertyOfClientByIdPropiedad, updateEmbedding } from "@/services/propertyService";
import { createOrUpdatePropertyWithPrisma } from "@/services/propertyUpdateService";
import { NextResponse } from "next/server";


export async function POST(request: Request, { params }: { params: { clientId: string } }) {

    try {
        const authorization = request.headers.get("authorization")
        if (!authorization) return NextResponse.json({ error: "authorization is required" }, { status: 400 })
        const apiToken= authorization.replace("Bearer ", "")
        if (!apiToken) return NextResponse.json({ error: "apiToken is required" }, { status: 400 })
        if (apiToken !== process.env.API_TOKEN) return NextResponse.json({ error: "Bad apiToken" }, { status: 400 })
        
        const clientId = params.clientId
        if (!clientId) return NextResponse.json({ error: "clientId is required" }, { status: 400 })

        const json= await request.json()
        console.log("json: ", json)

        const idPropiedad= json.idPropiedad
        if (!idPropiedad) {
            console.log("idPropiedad is required")            
            return NextResponse.json({ error: "idPropiedad is required" }, { status: 400 })
        }

        if (idPropiedad === "ALL") {
            const deleted= await deleteAllPropertiesOfClient(clientId)
            if (!deleted) return NextResponse.json({ error: "properties not found" }, { status: 404 })
            console.log(`properties of client ${clientId} deleted`)
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        } else {

            const deleted= await deletePropertyOfClientByIdPropiedad(clientId, idPropiedad)
            if (!deleted) return NextResponse.json({ error: "property not found" }, { status: 404 })
            console.log(`property ${idPropiedad} of client ${clientId} deleted`)
            return NextResponse.json({ data: "ACK" }, { status: 200 })
        }

    } catch (error) {
        return NextResponse.json({ error: "error: " + error}, { status: 502 })        
    }
   
}

