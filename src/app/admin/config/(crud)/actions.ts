"use server"

import { setWhatsAppEndpoing } from "@/services/clientService"
import { EndpointFormValues } from "./endpoint-form"
import { revalidatePath } from "next/cache"

export async function update(json: EndpointFormValues) {

    if (!json.whatsappEndpoint || !json.clienteId)
        return

    setWhatsAppEndpoing(json.whatsappEndpoint, json.clienteId)

    revalidatePath(`/admin/config`)
}