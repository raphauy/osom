import { Edit } from "lucide-react"
import { TokensPriceDialog } from "./(crud)/tokens-price-dialog"

interface Props {
    clientId: string
    promptTokensPrice: number | null | undefined
    completionTokensPrice: number | null | undefined
}

export default function TokensPrice({ clientId, promptTokensPrice, completionTokensPrice }: Props) {

    const editTrigger= (<Edit size={30} className="pr-2 hover:cursor-pointer"/>)

    return (
        <div className="w-full p-4 border rounded-lg">
            <p className="text-2xl font-bold">Precio de tokens</p>
            <div className="flex items-end gap-4 pb-3 mb-3 border-b">
                <p className="mt-5"><strong>Prompt Tokens Price:</strong> {promptTokensPrice ? Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", minimumFractionDigits: 3, maximumFractionDigits:3 }).format(promptTokensPrice) : "N/D"}</p>
                <p className="mt-5"><strong>Completion Tokens Price:</strong> {completionTokensPrice ? Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", minimumFractionDigits: 3, maximumFractionDigits:3}).format(completionTokensPrice) : "N/D"}</p>
                <TokensPriceDialog title="Editar precios de tokens" trigger={editTrigger} id={clientId} />
            </div>
        </div>
    )
}
