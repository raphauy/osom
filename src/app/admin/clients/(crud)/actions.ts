"use server"

import getClients, { createClient, deleteClient, editClient, getClient, getClientBySlug } from "@/services/clientService";
import { Client } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ClientFormValues } from "./clientForm";
import { getUser } from "@/services/userService";
import { getPropertiesCount } from "@/services/propertyService";

export type DataClient = {
    id: string
    nombre: string
    slug: string
    descripcion: string
    url: string
    cantPropiedades: number
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
    }
    return data
}

export async function getDataClients() {
    const clients= await getClients()

    const data: DataClient[] = await Promise.all(
        clients.map(async (client) => {
            const propertiesCount = await getPropertiesCount(client.id);
            return {
                id: client.id,
                nombre: client.name,
                slug: client.slug,
                descripcion: client.description || "",
                url: client.url || "",
                cantPropiedades: propertiesCount,
            };
        })
    );
    
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

