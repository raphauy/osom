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
import { setBudgetPercentageAction, setTokensPriceAction } from "./actions"


const formSchema = z.object({  
  promptTokensPrice: z.coerce.number(),
  completionTokensPrice: z.coerce.number(),
  clienteId: z.string().optional(),
})

export type TokensPriceFormValues = z.infer<typeof formSchema>

const defaultValues: Partial<TokensPriceFormValues> = {}

interface Props{
  id: string
  closeDialog: () => void
}

export function TokensPriceForm({ id, closeDialog }: Props) {
  const form = useForm<TokensPriceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  async function onSubmit(data: TokensPriceFormValues) {

    setLoading(true)

    setTokensPriceAction(id, data.promptTokensPrice, data.completionTokensPrice)
    .then((res) => {
      toast({title: "Se guardaron los precios de tokens" })
      window.location.reload()
      closeDialog()
    })
    .catch((err) => {
      toast({title: "Error al guardar los precios de tokens" })
    })
    .finally(() => {
      setLoading(false)
    })


    
  }

  useEffect(() => {
    getDataClient(id).then((data) => {
      if (!data) return
      data.promptTokensPrice && form.setValue("promptTokensPrice", data.promptTokensPrice)
      data.completionTokensPrice && form.setValue("completionTokensPrice", data.completionTokensPrice)
    })

  }, [form, id])



  return (
    <div className="p-4 bg-white rounded-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="promptTokensPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt Tokens Price en USD</FormLabel>
              <FormControl>
                <Input placeholder="0.02" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="completionTokensPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Completion Tokens Price en USD</FormLabel>
              <FormControl>
                <Input placeholder="0.06" {...field} />
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