import { Edit } from "lucide-react"
import { TokensPriceDialog } from "./(crud)/tokens-price-dialog"
import { ColleaguesDialog } from "./(crud)/colleagues-dialog"

interface Props {
    clientId: string
    colleaguesMessage: string
}

export default function Colleagues({ clientId, colleaguesMessage }: Props) {

    const editTrigger= (<Edit size={30} className="pr-2 hover:cursor-pointer"/>)

    return (
        <div className="w-full p-4 border rounded-lg">
            <p className="text-2xl font-bold">Mensaje a colegas</p>
            <div className="flex items-end gap-4 pb-3 mb-3 border-b">
                <p className="mt-5 whitespace-pre-line">{colleaguesMessage}</p>
                <ColleaguesDialog title="Editar mensaje para colegas" trigger={editTrigger} id={clientId} />
            </div>
        </div>
    )
}
