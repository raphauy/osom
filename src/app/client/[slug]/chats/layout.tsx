import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export default async function ChatLayout({ children, params }: Props) {

  let client= null
  if (!params.slug) return <div>Cliente no encontrado</div>
  
  const currentUser = await getCurrentUser()

  if (currentUser?.role !== "admin" && currentUser?.role !== "osom" && currentUser?.role !== "cliente") {
    return redirect("/unauthorized?message=You are not authorized to access this page")
  }

  return (
    <>
      <div className="flex flex-grow w-full">
        <div className="flex flex-col items-center flex-grow p-1">{children}</div>
      </div>
    </>
  )
}
