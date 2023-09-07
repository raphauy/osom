import { getDataClientBySlug } from "@/app/admin/clients/(crud)/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientBySlug } from "@/services/clientService"
import { getPropertiesOfClient } from "@/services/propertyService"
import { getUsersOfClient } from "@/services/userService"
import { HomeIcon, MessageCircle, User } from "lucide-react"
import Link from "next/link"

interface Props{
  params: {
    slug: string
  },
}
 
type TipoCant = {
  tipo: string | null,
  cant: number
}
export default async function ClientPage({ params: { slug } }: Props) {

  const dataClient= await getDataClientBySlug(slug)
  if (!dataClient) return <div>Cliente no encontrado</div>

  const client= await getClientBySlug(slug)
  if (!client) return <div>Cliente no encontrado</div>

  const users= await getUsersOfClient(client?.id)

  const properties= await getPropertiesOfClient(client.id)
 
  const tipos: TipoCant[]= properties.reduce((acc, property) => {
    const index= acc.findIndex(item => item.tipo === property.tipo)
    if (index === -1) {
      acc.push({ tipo: property.tipo, cant: 1 })
    } else {
      acc[index].cant++
    }
    return acc
  }, [] as TipoCant[])

  const cantCasas= properties.filter(property => property.tipo === 'Casa').length
  const cantApartamentos= properties.filter(property => property.tipo === 'Apartamento').length
  const cantOtros= properties.filter(property => (property.tipo !== 'Casa' && property.tipo !== 'Apartamento')).length

  return (
    <div className="flex flex-col">
      <p className="mt-10 mb-5 text-3xl font-bold text-center">{dataClient.nombre}</p>
      <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center">
          <Link href={`/client/${slug}/properties`}>
            <Card className="w-64">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
                <HomeIcon className="text-gray-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dataClient.cantPropiedades}</div>
                <div className="flex justify-between">
                  {
                    properties.length === 0 ? 
                      <p className="text-xs text-muted-foreground">
                        no hay propiedades
                      </p> :
                      <>
                        <p className="text-xs text-muted-foreground">
                          Casas ({cantCasas})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Aptos ({cantApartamentos})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Otros ({cantOtros})
                        </p>
                      </>                    
                  }
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Link href={`/client/${slug}/chats`}>
            <Card className="w-64">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Chats</CardTitle>
                <MessageCircle className="text-gray-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    no implementado
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Link href={`/client/${slug}/users`}>
            <Card className="w-64">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                <User className="text-gray-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{client?.users.length}</div>
                <div className="flex justify-between">
                  {
                    users.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        no hay usuarios
                      </p>
                    )                  
                  }
                  {
                    users.map(user => (
                      <p key={user.id} className="text-xs text-muted-foreground">
                        {user.name}
                      </p>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
