"use server"

import { getBillingData } from "@/services/conversationService"


export type BillingData= {
    clientName: string
    promptTokens: number
    promptTokensCost: number
    completionTokens: number
    completionTokensCost: number
}

export type CompleteData= {
    totalCost: number
    pricePerPromptToken: number
    pricePerCompletionToken: number
    billingData: BillingData[]
}
  
export async function getBillingDataAction(from: Date, to: Date, clientId?: string): Promise<CompleteData> {
    const data= await getBillingData(from, to, clientId)

    return data
}