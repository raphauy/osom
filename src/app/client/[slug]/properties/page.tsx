
import { Button } from "@/components/ui/button"
import getUsers from "@/services/userService"
import { PlusCircle } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getPropertiesOfClient } from "@/services/propertyService"
import { getClient, getClientBySlug } from "@/services/clientService"
import { DeleteDialog } from "./(crud)/delete-all-dialog"

interface Props {
  params: {
    slug: string
  }
}
export default async function PropertiesPage({ params: { slug } }: Props) {
  
  const client= await getClientBySlug(slug)
  if (!client) return <div>Cliente no encontrado</div>

  const properties= await getPropertiesOfClient(client.id)
  const tipos: string[]= (Array.from(new Set(properties.map((p) => p.tipo))).filter((tipo) => tipo !== null && tipo !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const zonas: string[]= (Array.from(new Set(properties.map((p) => p.zona))).filter((zona) => zona !== null && zona !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const ciudades: string[]= (Array.from(new Set(properties.map((p) => p.ciudad))).filter((ciudad) => ciudad !== null && ciudad !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const departamentos: string[]= (Array.from(new Set(properties.map((p) => p.departamento))).filter((departamento) => departamento !== null && departamento !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const paises: string[]= (Array.from(new Set(properties.map((p) => p.pais))).filter((pais) => pais !== null && pais !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const enVentas: string[]= (Array.from(new Set(properties.map((p) => p.enVenta))).filter((enVenta) => enVenta !== null && enVenta !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const enAlquileres: string[]= (Array.from(new Set(properties.map((p) => p.enAlquiler))).filter((enAlquiler) => enAlquiler !== null && enAlquiler !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const alquiladas: string[]= (Array.from(new Set(properties.map((p) => p.alquilada))).filter((alquilada) => alquilada !== null && alquilada !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const dormitorios: string[]= (Array.from(new Set(properties.map((p) => p.dormitorios))).filter((dormitorio) => dormitorio !== null && dormitorio !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const banios: string[]= (Array.from(new Set(properties.map((p) => p.banios))).filter((banio) => banio !== null && banio !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const garages: string[]= (Array.from(new Set(properties.map((p) => p.garages))).filter((garage) => garage !== null && garage !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const parrilleros: string[]= (Array.from(new Set(properties.map((p) => p.parrilleros))).filter((parrillero) => parrillero !== null && parrillero !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const piscinas: string[]= (Array.from(new Set(properties.map((p) => p.piscinas))).filter((piscina) => piscina !== null && piscina !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const calefacciones: string[]= (Array.from(new Set(properties.map((p) => p.calefaccion))).filter((calefaccion) => calefaccion !== null && calefaccion !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const amuebladas: string[]= (Array.from(new Set(properties.map((p) => p.amueblada))).filter((amueblada) => amueblada !== null && amueblada !== "") as string[]).sort((a, b) => a.localeCompare(b))
  const pisos: string[]= (Array.from(new Set(properties.map((p) => p.piso))).filter((piso) => piso !== null && piso !== "") as string[]).sort((a, b) => a.localeCompare(b))

  const eliminateTrigger= (<Button variant="destructive" >Elimar todas las propiedades</Button>)
  const title= "Eliminar Propiedades"
  const description= `Seguro que desea eliminar todas las propiedades del cliente ${client.name} (${properties.length} propiedades)?`

  return (
    <div className="w-full">
      <div className="flex items-center justify-center my-4">
        <p className="text-2xl font-bold dark:text-white">Propiedades de {client.name}</p>
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable 
          columns={columns}
          columnsOff={["descripcion", "pais", "enVenta", "enAlquiler", "alquilada", "dormitorios", "banios", "garages", "parrilleros", "piscinas", "calefaccion", "amueblada", "piso", "seguridad", "asensor", "lavadero", "superficieConstruida", "ciudad", "departamento"]}
          data={properties} 
          tipos={tipos} 
          zonas={zonas} 
          ciudades={ciudades} 
          departamentos={departamentos}
          paises={paises}
          enVentas={enVentas}
          enAlquileres={enAlquileres}
          alquiladas={alquiladas}
          dormitorios={dormitorios}
          banios={banios}
          garages={garages}
          parrilleros={parrilleros}
          piscinas={piscinas}          
          calefacciones={calefacciones}
          amuebladas={amuebladas}
          pisos={pisos}
        />
      </div>


      <div className="flex justify-end py-7">
        <DeleteDialog title={title} description={description} trigger={eliminateTrigger} clientId={client.id} />
      </div>

    </div>
)
}
