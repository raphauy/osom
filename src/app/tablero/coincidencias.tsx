import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { BedSingle, CheckCircle2, ExternalLink, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CoincidenceDAO } from "@/services/coincidence-services"
import { cn, formatNumberWithDots } from "@/lib/utils"

type Props = {
    coincidencias: CoincidenceDAO[]
    operacion: string
}

export default function Coincidencias({ coincidencias, operacion }: Props) {
    if (coincidencias.length === 0) 
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No hay Coincidencias</CardTitle>
                </CardHeader>
            </Card>
    )
    return (
        <Card>
            <CardHeader>
                <CardTitle>Coincidencias</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
                <div className="p-2 border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead><BedSingle /></TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead>Zona</TableHead>
                        <TableHead>Inmobiliaria</TableHead>
                        <TableHead>Dist.</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            coincidencias.map((coincidencia) => {
                                const precioVenta= operacion.toUpperCase() === "VENTA" ? `${formatNumberWithDots(coincidencia.property.precioVenta)} ${coincidencia.property.monedaVenta}` : ""
                                const precioAlquiler= operacion.toUpperCase() === "ALQUILER" ? `${formatNumberWithDots(coincidencia.property.precioAlquiler)}${coincidencia.property.monedaVenta}/mes` : ""
                                const precio= precioVenta || precioAlquiler

                                const distance= coincidencia.distance
                                return (
                                <TableRow key={coincidencia.id}>
                                    <TableCell>{coincidencia.property.tipo}</TableCell>
                                    <TableCell>{coincidencia.property.dormitorios}</TableCell>
                                    <TableCell className="text-right">{precio}</TableCell>
                                    <TableCell>{coincidencia.property.zona}</TableCell>
                                    <TableCell>
                                        {coincidencia.property.clientName} <br />
                                        #{coincidencia.number} 
                                    </TableCell>
                                    <TableCell className="flex items-center">
                                        <p>{distance}{distance < 0.5 && <CheckCircle2 className="text-green-500"/>}</p>
                                        <Link href={coincidencia.property.url} target="_blank">
                                            <Button size="sm" variant="link"><ExternalLink /></Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )})
                        }
                    </TableBody>
                </Table>
                </div>
            </CardContent>
        </Card>
  )
}
