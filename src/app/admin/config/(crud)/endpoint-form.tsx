"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { LoadingSpinnerChico } from "@/components/loadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { getDataClient } from "../../clients/(crud)/actions"
import { useRouter } from "next/navigation"


const formSchema = z.object({  
  whatsappEndpoint: z.string().optional(),
  clienteId: z.string().optional(),
})

export type EndpointFormValues = z.infer<typeof formSchema>

// This can come from your database or API.
const defaultValues: Partial<EndpointFormValues> = {}

interface Props{
  id: string
  update: (json: EndpointFormValues) => void
  closeDialog: () => void
}

export function EndpointForm({ id, update, closeDialog }: Props) {
  const form = useForm<EndpointFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const router= useRouter()

  async function onSubmit(data: EndpointFormValues) {

    setLoading(true)
    let message= null
    await update(data)
    message= "Endpoint configurado"
    toast({title: message })
    setLoading(false)
    
    window.location.reload()

    closeDialog && closeDialog()
  }

  useEffect(() => {
    getDataClient(id).then((data) => {
      if (!data) return
      data.whatsAppEndpoint && form.setValue("whatsappEndpoint", data.whatsAppEndpoint)
      data.id && form.setValue("clienteId", id)
    })

  }, [form, id])



  return (
    <div className="p-4 bg-white rounded-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="whatsappEndpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Endpoint</FormLabel>
              <FormControl>
                <Input placeholder="Endpoint para enivar mensajes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <div className="flex justify-end">
          <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
          <Button type="submit" className="w-32 ml-2" >{loading ? <LoadingSpinnerChico /> : <p>Guardar</p>}</Button>
        </div>
      </form>
    </Form>
   </div>
 )
}