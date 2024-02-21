"use server"

import getClients, { createClient, deleteClient, editClient, getClient, getClientBySlug, setPrompt, setWhatsAppEndpoing } from "@/services/clientService";
import { Client } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ClientFormValues } from "./clientForm";
import { getUser } from "@/services/userService";
import { getPercentages, getPropertiesCount } from "@/services/propertyService";
import { EndpointFormValues } from "../../config/(crud)/endpoint-form";
import { PromptFormValues } from "../../prompts/prompt-form";

export type DataClient = {
    id: string
    nombre: string
    slug: string
    descripcion: string
    url: string
    cantPropiedades: number
    rentPercentage?: string
    salePercentage?: string
    whatsAppEndpoint: string | null
    budgetPercMin?: number | null
    budgetPercMax?: number | null
    prompt?: string | null
    promptTokensPrice?: number | null
    completionTokensPrice?: number | null
    colleaguesMessage?: string | null
  }
    

export async function getDataClient(clientId: string): Promise<DataClient | null>{
    const client= await getClient(clientId)
    if (!client) return null

    const propertiesCount= await getPropertiesCount(clientId)

    const data: DataClient= {
        id: client.id,
        nombre: client.name,
        slug: client.slug,
        descripcion: client.description || '',
        url: client.url || '',
        cantPropiedades: propertiesCount,
        whatsAppEndpoint: client.whatsappEndpoint,
        budgetPercMin: client.budgetPercMin || 20,
        budgetPercMax: client.budgetPercMax || 20,
        prompt: client.prompt,
        promptTokensPrice: client.promptTokensPrice,
        completionTokensPrice: client.completionTokensPrice,
        colleaguesMessage: client.colleaguesMessage
    }
    return data
}

export async function getDataClientOfUser(userId: string): Promise<DataClient | null>{
    const user= await getUser(userId)
    if (!user) return null

    const client= user.client
    if (!client) return null

    const propertiesCount= await getPropertiesCount(client.id)

    const data: DataClient= {
        id: client.id,
        nombre: client.name,
        slug: client.slug,
        descripcion: client.description || '',
        url: client.url || '',
        cantPropiedades: propertiesCount,
        whatsAppEndpoint: client.whatsappEndpoint,
        budgetPercMin: client.budgetPercMin || 20,
        budgetPercMax: client.budgetPercMax || 20,    
        prompt: client.prompt,
        promptTokensPrice: client.promptTokensPrice,
        completionTokensPrice: client.completionTokensPrice,
        colleaguesMessage: client.colleaguesMessage
    }
    return data
}

export async function getDataClientBySlug(slug: string): Promise<DataClient | null>{
    
    const client= await getClientBySlug(slug)
    if (!client) return null

    const propertiesCount= await getPropertiesCount(client.id)

    const data: DataClient= {
        id: client.id,
        nombre: client.name,
        slug: client.slug,
        descripcion: client.description || '',
        url: client.url || '',
        cantPropiedades: propertiesCount,
        whatsAppEndpoint: client.whatsappEndpoint,
        budgetPercMin: client.budgetPercMin || 20,
        budgetPercMax: client.budgetPercMax || 20,
        prompt: client.prompt,
        promptTokensPrice: client.promptTokensPrice,
        completionTokensPrice: client.completionTokensPrice,
        colleaguesMessage: client.colleaguesMessage
    }
    return data
}

export type Percentages = {
    sales: string
    rents: string
}

export async function getDataClients() {
    const clients= await getClients()

    const data: DataClient[] = await Promise.all(
        clients.map(async (client) => {
            const propertiesCount = await getPropertiesCount(client.id);
            const percentages= await getPercentages(client.id)

            return {
                id: client.id,
                nombre: client.name,
                slug: client.slug,
                descripcion: client.description || "",
                url: client.url || "",
                cantPropiedades: propertiesCount,
                rentPercentage: percentages?.rents,
                salePercentage: percentages?.sales,
                whatsAppEndpoint: client.whatsappEndpoint,
                budgetPercMin: client.budgetPercMin || 20,
                budgetPercMax: client.budgetPercMax || 20,
                prompt: client.prompt,
                promptTokensPrice: client.promptTokensPrice,
                completionTokensPrice: client.completionTokensPrice,
                colleaguesMessage: client.colleaguesMessage
            };
        })
    );

    revalidatePath(`/admin/config`)
    
    return data    
}

export async function create(data: ClientFormValues): Promise<Client | null> {       
    const created= await createClient(data)

    console.log(created);

    revalidatePath(`/admin`)

    return created
}
  
export async function update(clientId: string, data: ClientFormValues): Promise<Client | null> {  
    const edited= await editClient(clientId, data)    

    revalidatePath(`/admin`)
    
    return edited
}


export async function eliminate(clientId: string): Promise<Client | null> {    
    const deleted= await deleteClient(clientId)

    revalidatePath(`/admin`)

    return deleted
}

export async function updateEndpoint(json: EndpointFormValues) {

    if (!json.whatsappEndpoint || !json.clienteId)
        return

    setWhatsAppEndpoing(json.whatsappEndpoint, json.clienteId)

    revalidatePath(`/admin/config`)
}

export async function updatePrompt(json: PromptFormValues) {

    if (!json.prompt || !json.clienteId)
        return

    setPrompt(json.prompt, json.clienteId)

    revalidatePath(`/admin/prompts`)
}

export async function getColleguesMessageAction(clientId: string): Promise<string | null>{
    const client= await getClient(clientId)
    if (!client) return null

    return client.colleaguesMessage
}