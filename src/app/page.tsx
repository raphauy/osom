import { Button } from "@/components/ui/button"
import getSession from "@/lib/auth"
import { getUsersOfClient } from "@/services/userService"
import { redirect } from "next/navigation"
import { getDataClientOfUser } from "./admin/clients/(crud)/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon } from "lucide-react"
import getClients from "@/services/clientService"
import Link from "next/link"

export default async function Home() {
  const session= await getSession()

  if (!session) return redirect("/login")

  const user= session.user

  if (user.role === "cliente") {
    const client= await getDataClientOfUser(user.id)
    if (!client) return <div>Usuario sin cliente asignado</div>
    
    return redirect(`/client/${client.slug}`)
  }

  const clients= await getClients()



  return (
    <div className="flex flex-col">
      <p className="mt-10 mb-3 text-3xl text-center">Dashboard</p>
      <div className="grid max-w-xl grid-cols-1 gap-10 sm:grid-cols-2">
      {clients.map(client => (
        <div key={client.id} className="flex flex-col items-center">
          <p className="mt-10 mb-3 text-2xl font-bold text-center">{client.name}</p>
          <Link href={`/client/${client.slug}`}>
            <Card className="w-64">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
                <HomeIcon className="text-gray-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">254</div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    25% alquiler
                  </p>
                  <p className="text-xs text-muted-foreground">
                    35% venta
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))
      }
      </div>
    </div>
  )
}
