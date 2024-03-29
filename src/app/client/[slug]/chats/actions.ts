"use server"

import { revalidatePath } from "next/cache"
import { Client, Conversation, Message } from "@prisma/client"
import { deleteConversation, getConversation, getConversationsOfClient, getLastConversation } from "@/services/conversationService"
import { format } from "date-fns"
import { getClientBySlug } from "@/services/clientService"


export type DataMessage = {
    id: string
    fecha: string
    updatedAt: Date
    role: string
    content: string
    gptData: string | null
    promptTokens: number
    completionTokens: number
}

export type DataConversation = {
    id: string
    fecha: string
    updatedAt: string
    celular: string
    messages: DataMessage[]
    clienteNombre: string
    clienteSlug: string
    clienteId?: string
    operacion?: string
    tipo?: string
    zona?: string
    presupuesto?: string
}
      

export async function getDataConversationAction(conversationId: string): Promise<DataConversation | null>{
    const conversation= await getConversation(conversationId)
    if (!conversation) return null

    const data= getData(conversation)
    
    return data
}

export async function getLastDataConversationAction(slug: string): Promise<DataConversation | null>{
    const conversation= await getLastConversation(slug)
    if (!conversation) return null

    const data= getData(conversation)
    
    return data
}

function getData(conversation: Conversation & { messages: Message[], client: Client }): DataConversation {
    const data: DataConversation= {
        id: conversation.id,
        fecha: getFormat(conversation.createdAt),
        updatedAt: getFormat(conversation.updatedAt),
        celular: conversation.phone,
        messages: conversation.messages.map((message: Message) => ({
            id: message.id,
            fecha: getFormat(message.createdAt),
            updatedAt: message.updatedAt,
            role: message.role,
            content: message.content,
            gptData: message.gptData,
            promptTokens: message.promptTokens,
            completionTokens: message.completionTokens,
        })),
        clienteNombre: conversation.client.name,
        clienteSlug: conversation.client.slug,
        clienteId: conversation.clientId,
        operacion: conversation.operacion || undefined,
        tipo: conversation.tipo || undefined,
        zona: conversation.zona || undefined,
        presupuesto: conversation.presupuesto || undefined        
    }
    return data
}

function getFormat(date: Date): string {
    // if date is today return only the time
    const today= new Date()
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        return format(date, "HH:mm")
    } else {
        return format(date, "yyyy/MM/dd")
    }
}

export async function getDataConversations(clientId: string) {
    const conversations= await getConversationsOfClient(clientId)

    const data: DataConversation[]= conversations.map(conversation => getData(conversation))
    
    return data    
}

export async function getDataConversationsBySlugAction(slug: string) {
    const client= await getClientBySlug(slug)
    if (!client) {
        console.log("Client not found by slug: ", slug)        
        return []
    }
   
    const conversations= await getConversationsOfClient(client.id)

    console.log("conversations count: ", conversations.length + " for client: ", client.name)

    const data: DataConversation[]= conversations.map(conversation => getData(conversation))
    
    return data    
}

export async function getTotalMessages(clientId: string) {
    const conversations= await getConversationsOfClient(clientId)

    let total= 0
    conversations.forEach(conversation => {
        total+= conversation.messages.length
    })
    return total
    
}


export async function eliminate(conversationId: string): Promise<Conversation | null> {    
    const deleted= await deleteConversation(conversationId)

    revalidatePath(`/admin/conversations`)

    return deleted
}

