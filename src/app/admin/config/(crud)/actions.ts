"use server"

import { setBudgetPercentage } from "@/services/clientService"

export async function setBudgetPercentageAction(clientId: string, budgetPercMin: number, budgetPercMax: number) {
    const client= await setBudgetPercentage(clientId, budgetPercMin,budgetPercMax)

    return client    
}