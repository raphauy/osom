"use server"

import { revalidatePath } from "next/cache"
import { PedidoDAO, PedidoFormValues, createPedido, updatePedido, getPedidoDAO, deletePedido, runThread, createCoincidencesProperties } from "@/services/pedido-services"

export async function getPedidoDAOAction(id: string): Promise<PedidoDAO | null> {
  return getPedidoDAO(id)
}

export async function createOrUpdatePedidoAction(id: string | null, data: PedidoFormValues): Promise<PedidoDAO | null> {       
  let updated= null
  if (id) {
      updated= await updatePedido(id, data)
  } else {
      updated= await createPedido(data)
  }

  if (!updated) throw new Error("Error al crear el pedido")
  
  await createCoincidencesProperties(updated.id)

  revalidatePath("/admin/pedidos")
  revalidatePath("/tablero")

  return updated as PedidoDAO
}

export async function deletePedidoAction(id: string): Promise<PedidoDAO | null> {    
  const deleted= await deletePedido(id)

  revalidatePath("/")

  return deleted as PedidoDAO
}

export async function runThreadAction(id: string): Promise<boolean> {
  const ok= await runThread(id)

  console.log("revalidating...");
  
  revalidatePath("/admin/pedidos")
  revalidatePath("/tablero")
  
  return ok
}