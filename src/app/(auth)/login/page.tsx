import { Command } from "lucide-react"
import { Metadata } from "next"

import getSession from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserAuthForm } from "./user-auth-form"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default async function AuthenticationPage() {
  const session= await getSession()
  if (session)
    redirect("/")

    return (
      <>
        <div className="container relative h-[800px] mt-5 grid flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex">
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
              }}
            />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Command className="w-6 h-6 mr-2" /> Osom Digital IA
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;La IA es la próxima frontera.&rdquo;
                </p>
                <footer className="text-sm">Autor Desconocido</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Identificación de usuarios
                </h1>
              </div>
              <UserAuthForm />
            </div>
          </div>
        </div>
      </>
    )
  }