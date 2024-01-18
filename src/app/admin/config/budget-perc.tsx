import { Edit } from "lucide-react"
import { updateEndpoint } from "../clients/(crud)/actions"
import { BudgetPercDialog } from "./(crud)/budget-perc-dialog"

interface Props {
    clientId: string
    budgetPercMin: number | null | undefined
    budgetPercMax: number | null | undefined
}

export default function BudgetPerc({ clientId, budgetPercMin, budgetPercMax }: Props) {

    const editTrigger= (<Edit size={30} className="pr-2 hover:cursor-pointer"/>)

    return (
        <div className="w-full p-4 border rounded-lg">
            <p className="text-2xl font-bold">Porcentajes para presupuesto</p>
            <div className="flex items-end gap-4 pb-3 mb-3 border-b">
                <p className="mt-5"><strong>Mínimo:</strong> {budgetPercMin}%</p>
                <p className="mt-5"><strong>Máximo:</strong> {budgetPercMax}%</p>
                <BudgetPercDialog title="Editar porcentaje de presupuesto" trigger={editTrigger} id={clientId} update={updateEndpoint} />
            </div>
        </div>
    )
}
