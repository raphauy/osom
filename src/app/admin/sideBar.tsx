"use client"

import clsx from "clsx";
import { Briefcase, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {

  const path= usePathname()

  const commonClasses= "flex gap-2 items-center py-1 mx-2 rounded hover:bg-gray-200 dark:hover:text-black"
  const selectedClasses= "font-bold text-osom-color dark:border-r-white"

  const dashboardSelected= path.endsWith("admin")
  const dashboard= clsx(commonClasses, dashboardSelected  && selectedClasses)

  const usersSelected= path.endsWith("users")
  const users= clsx(commonClasses, usersSelected  && selectedClasses)

  const clientsSelected= path.endsWith("clients")
  const clients= clsx(commonClasses, clientsSelected  && selectedClasses)

  const pClasses= "hidden sm:block lg:w-36"

  return (
    <>
      <section className="flex flex-col gap-3 py-4 mt-3 border-r border-r-osom-color/50">

        <Link href="/admin" className={dashboard}>
          <LayoutDashboard size={23} />
          <p className={pClasses}>Dashboard</p>                  
        </Link>

        {divider()}

        <Link href="/admin/users" className={users}>
          <User size={23} />
          <p className={pClasses}>Usuarios</p>                  
        </Link>

        <Link href="/admin/clients" className={clients}>
          <Briefcase />
          <p className={pClasses}>Clientes</p>                  
        </Link>


        {divider()}


      </section>
    </>
  );
}


function divider() {
  return <div className="mx-2 my-5 border-b border-b-osom-color/50" />
}
