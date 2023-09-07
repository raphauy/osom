"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Client } from "@prisma/client"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { getDataUsersOfClientAction } from "../../users/(crud)/actions"
import DeleteForm from "./deleteForm"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props{
  title: string
  description: string
  trigger: React.ReactNode
  id: string
  eliminate: (id: string) =>  Promise<Client | null>
}

export function DeleteDialog({ title, description, trigger, id, eliminate }: Props) {
  const [open, setOpen] = useState(false)
  const [usersCount, setUsersCount] = useState(0)
  const [descriptionDialog, setDescriptionDialog] = useState(description)
  const router= useRouter()

  useEffect(() => {
    getDataUsersOfClientAction(id).then((users) => {
      setUsersCount(users.length)
      if (users.length > 0)
        setDescriptionDialog("No se puede eliminar el cliente porque tiene usuarios asociados")
    })
  
  }, [id])

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
          <DialogDescription className="py-8">{descriptionDialog}</DialogDescription>
        </DialogHeader>
        {
          usersCount > 0 ? (
            <div className="flex flex-col items-center">
              <p className="text-red-500">Elimine primero los usuarios asociados</p>
              <Button onClick={() => router.push(`/admin/users`)} className="mt-4">Ir a usuarios</Button>
            </div>
            ) :
            <DeleteForm eliminate={eliminate} closeDialog={handleClose} id={id} />
          
        }
        
      </DialogContent>
    </Dialog>
  )
}
