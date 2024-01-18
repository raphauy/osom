"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { TokensPriceForm } from "./tokens-price-form"

interface Props{
  title: string
  trigger: React.ReactNode
  id: string
}

export function TokensPriceDialog({ title, trigger, id }: Props) {
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
        <TokensPriceForm id={id} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
