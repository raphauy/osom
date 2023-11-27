import { updateEmbedding } from "@/services/propertyService";
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

        // check if the value of precioVenta and precioAlquiler are numbers and return error if not
        const precioVenta= json.precioVenta
        const precioAlquiler= json.precioAlquiler
        if (precioVenta && isNaN(precioVenta)) {
            console.log("precioVenta is not a number")            
            return NextResponse.json({ error: "precioVenta is not a number" }, { status: 400 })
        }
        if (precioAlquiler && isNaN(precioAlquiler)) {
            console.log("precioAlquiler is not a number")            
            return NextResponse.json({ error: "precioAlquiler is not a number" }, { status: 400 })
        }        


        const updated= await createOrUpdatePropertyWithPrisma(json, clientId)

        if (!updated) return NextResponse.json({ error: "error updating property" }, { status: 502 })

        await updateEmbedding(updated.id)

        console.log("updated!")
        return NextResponse.json({ data: "ACK" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "error: " + error}, { status: 502 })        
    }
   
}

