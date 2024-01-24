import { prisma } from "@/lib/db";
import { messageArrived, processMessage } from "./conversationService";
import { Message } from "@prisma/client";
import { getValue } from "./config-services";
import { addMilliseconds } from "date-fns";

export type MessageDelayResponse = {
    wasCreated: boolean,
    message: Message | null
}
// función que recibe un mensaje y lo guarda en la base de datos de la siguiente forma:
// - Si hay un mensaje para ese phone, ese clientId y que además haya sido actualizado hace menos de 5 segundos, se actualiza el mensaje pegando el texto al final del texto que ya había
// - Si no, se crea un nuevo mensaje con el texto recibido
export async function onMessageReceived(phone: string, text: string, clientId: string, role: string, gptData: string, promptTokens?: number, completionTokens?: number): Promise<MessageDelayResponse> {
    let messageResponse= null
    let wasCreated= false

    const message = await getMessage(phone, clientId)
    if (message) {
        console.log("message found: ", message)        
        const updated= await updateTextMessage(message, text)
        if (updated) {
            messageResponse= updated
            console.log("message updated: ", updated)
        }
    } else {
        console.log("message not found")
        messageResponse= await messageArrived(phone, text, clientId, role, gptData, promptTokens, completionTokens)
        if (messageResponse) {
            wasCreated= true
        }
        console.log(`message stored for phone ${phone}`)
    }

    const res: MessageDelayResponse= {
        wasCreated: wasCreated,
        message: messageResponse
    }

    return res
}

// un message tiene una conversation y una conversation tiene un client
// un mensaje tiene un role (user, assistant o function)
// el phone es el phone de la conversation
// esta función devuelve el último mensaje recibido para un phone (de una conversation), clientId y role
// este mensaje además debe cumplir que haya sido actualizado hace menos de 5 segundos
export async function getMessage(phone: string, clientId: string) {
    const MESSAGE_ARRIVED_DELAY= await getValue("MESSAGE_ARRIVED_DELAY")
    let messageArrivedDelay= 5
    if(MESSAGE_ARRIVED_DELAY) {
        messageArrivedDelay= parseInt(MESSAGE_ARRIVED_DELAY)
        console.log("MESSAGE_ARRIVED_DELAY: ", messageArrivedDelay, " seconds")
    } else console.log("MESSAGE_ARRIVED_DELAY not found")    

    const conversation = await prisma.conversation.findFirst({
        where: {
            phone: phone,
            clientId: clientId,
        },
        include: {
            messages: {
                where: {
                    role: "user",
                    updatedAt: {
                        gte: addMilliseconds(new Date(), -messageArrivedDelay * 1000)
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 1
            }
        },
        orderBy: {
            createdAt: "desc"
        },
    });
    if (conversation && conversation.messages.length > 0) {
        return conversation.messages[0];
    } else {
        return null;
    }   
}

async function updateTextMessage(message: Message, text: string) {
    const updated= await prisma.message.update({
        where: {
            id: message.id
        },
        data: {
            content: message.content + "\n" + text
        }
    });

    return updated
}

// función que recibe un messageId, lo busca, chequea si fue actualizado hace menos de 5 segundos
// si fue actualizado hace menos de 5 segundos, devuelve false
// si no, devuelve true
export async function isMessageReadyToProcess(messageId: string) {
    const MESSAGE_ARRIVED_DELAY= await getValue("MESSAGE_ARRIVED_DELAY")
    let messageArrivedDelay= 5
    if(MESSAGE_ARRIVED_DELAY) {
        messageArrivedDelay= parseInt(MESSAGE_ARRIVED_DELAY)
    } else console.log("MESSAGE_ARRIVED_DELAY not found")    

    const message = await prisma.message.findFirst({
        where: {
            id: messageId,
            updatedAt: {
                gte: new Date(Date.now() - messageArrivedDelay * 1000)
            }
        }
    });

    if (message) {
        return false
    } else {
        return true
    }
}

export async function processDelayedMessage(id: string, phone: string) {
    console.log(`message from ${phone} created with id ${id}`)
    // check every second if the message is ready to process
    let isReady= await isMessageReadyToProcess(id)
    while (!isReady) {
        console.log(`sleeping 1 second for phone ${phone}`)
        await new Promise(r => setTimeout(r, 1000))
        isReady= await isMessageReadyToProcess(id)
    }
    console.log(`message from ${phone} ready to process`)

    await processMessage(id)
    console.log(`message from ${phone} processed`)    

}