import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { PedidoDAO } from "@/services/pedido-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Info } from "lucide-react"

type Props= {
    pedido: PedidoDAO
}

export default function PedidoBox({pedido}: Props) {
    const numberFormatted= pedido.number.toString().padStart(4, "0")
    const formattedDate= format(pedido.createdAt, "dd MMMM, yyyy - HH:mm 'h'", { locale: es })

    return (
        <Card>
            <CardHeader>
                <div className="flex gap-10">
                <CardTitle>Pedido {numberFormatted}</CardTitle>
                <HoverCard>
                    <HoverCardTrigger><Info size={20}/></HoverCardTrigger>
                    <HoverCardContent className="w-72">
                        <p className="mb-5 text-lg font-bold">Texto original del pedido:</p>
                        <p className="text-sm whitespace-pre-wrap">{pedido.text}</p>
                    </HoverCardContent>
                </HoverCard>

                </div>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </CardHeader>
            <CardContent className="text-muted-foreground">
            <div className="flex gap-2">
                <div className="flex flex-col justify-between">
                    <div className="grid grid-cols-[1fr_2fr] gap-2 w-[260px]">
                        <p>Operación: </p>
                        <p className="font-bold">{pedido.operacion}</p>
                        <p>Tipo: </p>
                        <p className="font-bold whitespace-nowrap">{pedido.tipo}</p>
                        <p>Dormitorios: </p>
                        <p className="font-bold whitespace-nowrap">{pedido.dormitorios}</p>
                        <p>Presupuesto: </p>
                        <p className="font-bold">{pedido.presupuesto}</p>
                    </div>
                    <p className="max-w-xs">Contacto: {pedido.contacto}</p>                    
                </div>
                <div className="flex flex-col justify-between flex-1 pl-2 border-l gap-7">
                    <div>
                        <p className="font-bold">Características: </p>
                        <p>{pedido.caracteristicas}</p>
                    </div>
                    <div>
                        <p><span className="font-bold">Zona:</span> {pedido.zona}</p>
                    </div>
                </div>
            </div>
            </CardContent>
        </Card>

  )
}
