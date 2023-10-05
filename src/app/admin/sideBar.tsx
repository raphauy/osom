"use client"

import clsx from "clsx";
import { Briefcase, ChevronRightSquare, FlaskConical, LayoutDashboard, MessageCircle, Settings, User } from "lucide-react";
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

  const promptsSelected= path.endsWith("prompts")
  const prompts= clsx(commonClasses, promptsSelected  && selectedClasses)

  const testsSelected= path.endsWith("tests")
  const tests= clsx(commonClasses, testsSelected  && selectedClasses)

  const chatSelected= path.endsWith("chat")
  const chat= clsx(commonClasses, chatSelected  && selectedClasses)

  const experimentoSelected= path.endsWith("experimento")
  const experimento= clsx(commonClasses, experimentoSelected  && selectedClasses)

  const configSelected= path.endsWith("config")
  const config= clsx(commonClasses, configSelected  && selectedClasses)

  const pClasses= "hidden sm:block lg:w-36"

  return (
    <div className="flex flex-col justify-between border-r border-r-osom-color/50">
      <section className="flex flex-col gap-3 py-4 mt-3 ">

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

        <Link href="/admin/prompts" className={prompts}>
          <ChevronRightSquare />
          <p className={pClasses}>Prompts</p>                  
        </Link>

        {divider()}

        <Link href="/admin/tests" className={tests}>
          <FlaskConical />
          <p className={pClasses}>Pruebas</p>                  
        </Link>

        <Link href="/admin/chat?clientId=clm865amy0009jepxozqh2ff9" className={chat}>
          <MessageCircle />
          <p className={pClasses}>Chat</p>                  
        </Link>

        {divider()}

        <Link href="/admin/experimento" className={experimento}>
          <MessageCircle />
          <p className={pClasses}>Experimento</p>                  
        </Link>

        {divider()}


      </section>
      <section className="mb-4">
        {divider()}
        
        <Link href="/admin/config" className={config}>
          <Settings />
          <p className={pClasses}>Config</p>                  
        </Link>
      </section>
    </div>
  );
}


function divider() {
  return <div className="mx-2 my-5 border-b border-b-osom-color/50" />
}
