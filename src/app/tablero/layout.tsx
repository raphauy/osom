import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { DataTable } from "./pedido-table";
import PedidoBox from "./pedido-box";
import { getPedidosDAO } from "@/services/pedido-services";
import { columns } from "./pedido-columns";

interface Props {
  children: React.ReactNode;
}

export default async function TableroLayout({ children }: Props) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/login")
  }

  if (currentUser?.role !== "admin") {
    return redirect("/unauthorized?message=You are not authorized to access this page")
  }

  const data = await getPedidosDAO();
 
  return (
    <div className="flex flex-col w-full gap-2 lg:items-start xl:gap-4 lg:flex-row sm:items-center">
      <div className="sm:w-full lg:w-[450px] mt-3">
        <DataTable columns={columns} data={data} subject="Pedido" columnsOff={["tipo"]} />
      </div>
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  )
}
