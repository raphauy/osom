"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { EndpointForm, EndpointFormValues } from "./endpoint-form"
import { BudgetPercForm } from "./budget-perc-form"

interface Props{
  title: string
  trigger: React.ReactNode
  id: string
  update: (json: EndpointFormValues) => void
}

export function BudgetPercDialog({ title, trigger, id, update }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <BudgetPercForm id={id} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
