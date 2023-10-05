"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { LoadingSpinnerChico } from "@/components/loadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { getDataClient } from "@/app/admin/clients/(crud)/actions"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"


const formSchema = z.object({  
  prompt: z.string().optional(),
  clienteId: z.string().optional(),
})

export type PromptFormValues = z.infer<typeof formSchema>

const defaultValues: Partial<PromptFormValues> = {
  prompt: "Eres un asistente inmobiliario",
}

interface Props{
  id: string
  update: (json: PromptFormValues) => void
}

export function PromptForm({ id, update }: Props) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })
  const router= useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(data: PromptFormValues) {

    setLoading(true)
    let message= null
    await update(data)
    message= "Prompt configurado"
    toast({title: message })
    setLoading(false)

    router.push("/admin/prompts")

  }

  useEffect(() => {
    getDataClient(id).then((data) => {
      if (!data) return
      data.prompt && form.setValue("prompt", data.prompt)
      data.id && form.setValue("clienteId", id)
    })

  }, [form, id])



  return (
    <div className="p-4 bg-white rounded-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Prompt del cliente"                  
                  {...field}
                  rows={18}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
      <div className="flex justify-end">
          <Button onClick={() => router.back() } type="button" variant={"secondary"} className="w-32">Cancelar</Button>
          <Button type="submit" className="w-32 ml-2" >{loading ? <LoadingSpinnerChico /> : <p>Guardar</p>}</Button>
        </div>
      </form>
    </Form>
   </div>
 )
}