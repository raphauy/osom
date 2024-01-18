"use server"

import { getBillingData } from "@/services/conversationService"


export type CompleteData= {
    totalCost: number
    pricePerPromptToken: number
    pricePerCompletionToken: number
    billingData: BillingData[]
}

export type BillingData= {
    clientName: string   
    promptTokens: number
    completionTokens: number
    clientPricePerPromptToken: number
    clientPricePerCompletionToken: number
}

  
export async function getBillingDataAction(from: Date, to: Date, clientId?: string): Promise<CompleteData> {
    const data= await getBillingData(from, to, clientId)

    return data
}