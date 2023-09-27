import { getCurrentUser } from "@/lib/auth";
import NotAlowedPage from "@/app/(auth)/unauthorized/page";
import { getDataClientBySlug, getDataClientOfUser } from "@/app/admin/clients/(crud)/actions";
import Conversations from "./conversations";

interface Props {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export default async function AdminLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser()
  const slug = params.slug

  if (!currentUser) {
    return <NotAlowedPage message="Deberías estar logueado." />
  }

  let client= await getDataClientOfUser(currentUser.id)
  if (currentUser.role === "admin" || currentUser.role === "osom") {
    client = await getDataClientBySlug(slug)
  }
  if (!client) 
    return <div>Cliente no encontrado</div>
    
  if (client.slug !== slug) 
    return <NotAlowedPage message="No tienes permisos para ver este cliente." />

  return (
    <>
      <div className="flex flex-grow w-full">
        <Conversations clientId={client.id} />
        <div className="flex flex-col items-center flex-grow p-1">{children}</div>
      </div>
    </>
  )
}
