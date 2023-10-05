import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getClients from "@/services/clientService";
import getUsers from "@/services/userService";
import { Briefcase, User } from "lucide-react";
import Link from "next/link";
import { getDataClients } from "./clients/(crud)/actions";

export default async function AdminPage() {

  const users= await getUsers()
  const clients= await getClients()
  const dataClients= await getDataClients()
  
  return (
    <div className="flex flex-col">
      <p className="mt-10 mb-5 text-3xl font-bold text-center">Admin Dashboard</p>
      <div className="grid max-w-xl grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="flex flex-col items-center">
          <Link href="/admin/users">
            <Card className="w-64">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                <User className="text-gray-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      admin ({users.filter(user => user.role === "admin").length})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      osom ({users.filter(user => user.role === "osom").length})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      cliente ({users.filter(user => user.role === "cliente").length})
                    </p>
                </div>
                <div className="flex justify-between">
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Link href="/admin/clients">
            <Card className="w-64">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Briefcase className="text-gray-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    {dataClients.reduce((acc, client) => acc + client.cantPropiedades, 0)} propiedades
                  </p>                  
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
