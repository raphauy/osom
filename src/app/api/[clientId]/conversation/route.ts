import { getDataClient } from "@/app/admin/clients/(crud)/actions";
import { getValue } from "@/services/config-services";
import { messageArrived, processMessage } from "@/services/conversationService";
import { MessageDelayResponse, isMessageReadyToProcess, onMessageReceived, processDelayedMessage } from "@/services/messageDelayService";
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

        const text = message.text
        if (!text) {
            return NextResponse.json({ error: "text is required" }, { status: 400 })
        }

        console.log("phone: ", phone)
        console.log("text: ", text)

        const DELAY_SOLO_HUS= await getValue("DELAY_SOLO_HUS")
        let delaySoloHus= false
        if(DELAY_SOLO_HUS) {
            delaySoloHus= DELAY_SOLO_HUS === "true"
        } else console.log("DELAY_SOLO_HUS not found")    

        console.log("delaySoloHus:", delaySoloHus)
        
        if (delaySoloHus) {
            const client= await getDataClient(clientId)
            if (client && client.nombre === "Hus") {

                const delayResponse: MessageDelayResponse= await onMessageReceived(phone, text, clientId, "user", "")
                console.log(`delayResponse wasCreated: ${delayResponse.wasCreated}`)
                console.log(`delayResponse message: ${delayResponse.message ? delayResponse.message.id : "null"}`)
        
                if (delayResponse.wasCreated ) {
                    if (delayResponse.message) {
                        processDelayedMessage(delayResponse.message.id, phone)
                        
                    } else {
                        console.log("delayResponse.message wasCreated but is null")
                        return NextResponse.json({ error: "there was an error processing the message" }, { status: 502 })
                    }
                } else {
                    console.log(`message from ${phone} was updated, not processed`)
                }        
            } else {
                console.log("client is not HUS")
                const messageStored= await messageArrived(phone, text, clientId, "user", "")
                console.log("message stored")
                processMessage(messageStored.id)
            }
        } else {

            const delayResponse: MessageDelayResponse= await onMessageReceived(phone, text, clientId, "user", "")
            console.log(`delayResponse wasCreated: ${delayResponse.wasCreated}`)
            console.log(`delayResponse message: ${delayResponse.message ? delayResponse.message.id : "null"}`)
    
            if (delayResponse.wasCreated ) {
                if (delayResponse.message) {
                    processDelayedMessage(delayResponse.message.id, phone)
                    
                } else {
                    console.log("delayResponse.message wasCreated but is null")
                    return NextResponse.json({ error: "there was an error processing the message" }, { status: 502 })
                }
            } else {
                console.log(`message from ${phone} was updated, not processed`)
            }        
        }

        
        

        return NextResponse.json({ data: "ACK" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "error: " + error}, { status: 502 })        
    }
   
}

