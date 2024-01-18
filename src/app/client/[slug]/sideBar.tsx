"use client"

import clsx from "clsx";
import { Briefcase, Home, LayoutDashboard, MessageCircle, MessagesSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  slug: string
}
export default function SideBar({ slug }: Props) {

  const path= usePathname()

  const commonClasses= "flex gap-2 items-center py-1 mx-2 rounded hover:bg-gray-200 dark:hover:text-black"
  const selectedClasses= "font-bold text-osom-color dark:border-r-white"

  const dashboardSelected= path.endsWith(`client/${slug}`)
  const dashboard= clsx(commonClasses, dashboardSelected  && selectedClasses)

  const propertiesSelected= path.endsWith("properties")
  const properties= clsx(commonClasses, propertiesSelected  && selectedClasses)

  const chatsSelected= path.includes("chats")
  const chats= clsx(commonClasses, chatsSelected  && selectedClasses)

  const billingSelected= path.includes("billing")
  const billing= clsx(commonClasses, billingSelected  && selectedClasses)

  const usersSelected= path.endsWith("users")
  const users= clsx(commonClasses, usersSelected  && selectedClasses)

  const pClasses= "hidden sm:block lg:w-36"

  return (
    <>
      <section className="flex flex-col gap-3 py-4 mt-3 border-r border-r-osom-color/50">

        <Link href={`/client/${slug}`} className={dashboard}>
          <LayoutDashboard size={23} />
          <p className={pClasses}>Dashboard</p>                  
        </Link>

        {divider()}

        <Link href={`/client/${slug}/properties`} className={properties}>
          <Home />
          <p className={pClasses}>Propiedades</p>                  
        </Link>

        <Link href={`/client/${slug}/chats`} className={chats}>
          <MessageCircle />
          <p className={pClasses}>Chats</p>                  
        </Link>

        {divider()}

        <Link href={`/client/${slug}/billing`} className={billing}>
          <MessageCircle />
          <p className={pClasses}>Costos por uso</p>
        </Link>

        {divider()}
        <Link href={`/client/${slug}/users`} className={users}>
          <User size={23} />
          <p className={pClasses}>Usuarios</p>                  
        </Link>

        {divider()}


      </section>
    </>
  );
}


function divider() {
  return <div className="mx-2 my-5 border-b border-b-osom-color/50" />
}
