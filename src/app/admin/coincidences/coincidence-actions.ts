"use server"

import { revalidatePath } from "next/cache"
import { CoincidenceDAO, CoincidenceFormValues, createCoincidence, getCoincidenceDAO, deleteCoincidence, updateCoincidence } from "@/services/coincidence-services"

export async function getCoincidenceDAOAction(id: string): Promise<CoincidenceDAO | null> {
  return getCoincidenceDAO(id)
}

export async function createOrUpdateCoincidenceAction(id: string | null, data: CoincidenceFormValues): Promise<CoincidenceDAO | null> {       
  let updated= null
  if (id) {
      updated= await updateCoincidence(id, data)
  } else {
      updated= await createCoincidence(data)
  }     

  revalidatePath("/")

  return updated as CoincidenceDAO
}

export async function deleteCoincidenceAction(id: string): Promise<CoincidenceDAO | null> {    
  const deleted= await deleteCoincidence(id)

  revalidatePath("/")

  return deleted as CoincidenceDAO
}
