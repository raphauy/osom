"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Client } from "@prisma/client"
import { useState } from "react"
import { ClientForm, ClientFormValues } from "./clientForm"
import { useRouter } from "next/navigation"

interface Props{
  title: string
  trigger: React.ReactNode
  id?: string
  create: (json: ClientFormValues) => Promise<Client | null>
  update: (clientId: string, json: ClientFormValues) => Promise<Client | null>
}

export function ClientDialog({ title, trigger, id, create, update }: Props) {
  const [open, setOpen] = useState(false);
  const router= useRouter()

  function handleClose() {
    setOpen(false)
    router.push(`/admin/clients?refresh=${Date.now()}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ClientForm create={create} update={update} closeDialog={handleClose} id={id} />
      </DialogContent>
    </Dialog>
  )
}
