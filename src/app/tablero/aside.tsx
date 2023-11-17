import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Aside() {
    return (
        <aside className="hidden overflow-auto border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
            <div className="flex flex-col gap-2 p-4">
                <h2 className="text-lg font-semibold">Pedidos</h2>
                <div className="p-2 border rounded-lg shadow-sm">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Operación</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Presupuesto</TableHead>
                        <TableHead>Fecha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                        <TableCell className="font-medium">#3201</TableCell>
                        <TableCell>ALQUILER</TableCell>
                        <TableCell>Casa</TableCell>
                        <TableCell className="text-right">$1,500</TableCell>
                        <TableCell>June 23, 2023</TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell className="font-medium">#3202</TableCell>
                        <TableCell>VENTA</TableCell>
                        <TableCell>Apartamento</TableCell>
                        <TableCell className="text-right">$300,000</TableCell>
                        <TableCell>June 20, 2023</TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </div>
            </div>
        </aside>    
    )
}
