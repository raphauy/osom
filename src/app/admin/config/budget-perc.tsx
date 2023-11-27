"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useCopyToClipboard from "@/lib/useCopyToClipboard"
import { Copy, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { EndpointDialog } from "./(crud)/endpoint-dialog"
import { getDataClient, updateEndpoint } from "../clients/(crud)/actions"
import { usePathname } from "next/navigation"
import { BudgetPercDialog } from "./(crud)/budget-perc-dialog"

interface Props {
    clientId: string
}

export default function BudgetPerc({ clientId }: Props) {

    const [percMin, setPercMin] = useState(0)
    const [percMax, setPercMax] = useState(0)

    useEffect(() => {
        getDataClient(clientId).then((data) => {
            if (!data) return
            data.budgetPercMin && setPercMin(data.budgetPercMin)
            data.budgetPercMax && setPercMax(data.budgetPercMax)
        })
        
    }, [clientId])

    const editTrigger= (<Edit size={30} className="pr-2 hover:cursor-pointer"/>)

    return (
        <div>
            <div className="flex items-end gap-4 pb-3 mb-3 border-b">
                <p className="mt-5"><strong>Porcentaje Presupuesto:  </strong></p>
                <p className="mt-5"><strong>Mínimo:</strong> {percMin}%</p>
                <p className="mt-5"><strong>Máximo:</strong> {percMax}%</p>
                <BudgetPercDialog title="Editar porcentaje de presupuesto" trigger={editTrigger} id={clientId} update={updateEndpoint} />
            </div>
        </div>
    )
}
