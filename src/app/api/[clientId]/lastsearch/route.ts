import { getLastSearch, messageArrived, processMessage } from "@/services/conversationService";
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
        const message= json.message
        console.log("json: ", json)
        console.log("message: ", message)

        const phone = message.phone
        if (!phone) {
            return NextResponse.json({ error: "phone is required" }, { status: 400 })
        }


        console.log("phone: ", phone)

        const lastSearch = await getLastSearch(clientId, phone)
        console.log("lastSearch: ", lastSearch)

        if (!lastSearch) {
            return NextResponse.json({ data: "Last Search not found" }, { status: 200 })
        }

        const data: LastSearchResponse = {
            data: {
                clientId: lastSearch.clientId,
                phone: lastSearch.phone,
                operacion: lastSearch.operacion?.toUpperCase() || "",
                tipo: lastSearch.tipo || "",
                zona: lastSearch.zona || "",
                presupuesto: lastSearch.presupuesto || "",
                fecha: lastSearch.updatedAt?.toISOString().split("T")[0] || "",
            }
        }

        return NextResponse.json( data, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "error: " + error}, { status: 502 })        
    }
   
}

type LastSearchResponse = {
    data:{
        clientId: string,
        phone: string,
        operacion: string,
        tipo: string,
        zona: string,
        presupuesto: string,
        fecha: string,
    }
}