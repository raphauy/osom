"use server"

import { setBudgetPercentage, setColleaguesMessage, setTokensPrice } from "@/services/clientService"

export async function setBudgetPercentageAction(clientId: string, budgetPercMin: number, budgetPercMax: number) {
    const client= await setBudgetPercentage(clientId, budgetPercMin,budgetPercMax)

    return client    
}

export async function setTokensPriceAction(clientId: string, promptTokensPrice: number, completionTokensPrice: number) {
    const client= await setTokensPrice(clientId, promptTokensPrice,completionTokensPrice)

    return client    
}

export async function setColleaguesMessageAction(clientId: string, message: string) {
    const client= await setColleaguesMessage(clientId, message)

    return client    
}