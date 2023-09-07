"use server"

import getUsers, { createUser, deleteUser, editUser, getUser, getUsersOfClient } from "@/services/userService";
import { revalidatePath } from "next/cache";
import { User } from "@prisma/client";
import { UserFormValues } from "./userForm";

export type DataUser = {
    id: string
    nombre: string | null
    email: string
    verificado: Date | null
    rol: string
    cliente: string
    clienteId?: string
}
      

export async function getDataUser(userId: string): Promise<DataUser | null>{
    const user= await getUser(userId)
    if (!user) return null

    const data: DataUser= {
        id: user.id,
        nombre: user.name,
        email: user.email,
        verificado: user.emailVerified,
        rol: user.role,
        cliente: user.client?.name ?? "",
        clienteId: user.client?.id
    }
    return data
}

export async function getDataUsers() {
    const users= await getUsers()

    const data: DataUser[]= users.map(user => ({
        id: user.id,
        nombre: user.name,
        email: user.email,
        verificado: user.emailVerified,
        rol: user.role,
        cliente: user.client?.name ?? "",
        clienteId: user.client?.id
    }))
    
    return data    
}

export async function getDataUsersOfClientAction(clientId: string) {
    const users= await getUsersOfClient(clientId)

    const data: DataUser[]= users.map(user => ({
        id: user.id,
        nombre: user.name,
        email: user.email,
        verificado: user.emailVerified,
        rol: user.role,
        cliente: user.client?.name ?? "",
        clienteId: user.client?.id
    }))
    
    return data    
}


export async function create(data: UserFormValues): Promise<User | null> {       
    const created= await createUser(data)

    console.log(created);

    revalidatePath(`/admin/users`)

    return created
}
  
export async function update(userId: string, data: UserFormValues): Promise<User | null> {  
    const edited= await editUser(userId, data)    

    revalidatePath(`/admin/users`)
    
    return edited
}


export async function eliminate(userId: string): Promise<User | null> {    
    const deleted= await deleteUser(userId)

    revalidatePath(`/admin/users`)

    return deleted
}

