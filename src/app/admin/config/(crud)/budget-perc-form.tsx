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
import { setBudgetPercentageAction } from "./actions"


const formSchema = z.object({  
  percMin: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  percMax: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  clienteId: z.string().optional(),
})

export type BudgetPercFormValues = z.infer<typeof formSchema>

const defaultValues: Partial<BudgetPercFormValues> = {}

interface Props{
  id: string
  closeDialog: () => void
}

export function BudgetPercForm({ id, closeDialog }: Props) {
  const form = useForm<BudgetPercFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  async function onSubmit(data: BudgetPercFormValues) {

    setLoading(true)

    const percMin= data.percMin ? parseInt(data.percMin) : 0
    const percMax= data.percMax ? parseInt(data.percMax) : 0
    setBudgetPercentageAction(id, percMin, percMax)
    .then((res) => {
      toast({title: "Se guardó el porcentaje de presupuesto" })
      window.location.reload()
      closeDialog()
    })
    .catch((err) => {
      toast({title: "Error al guardar el porcentaje de presupuesto" })
    })
    .finally(() => {
      setLoading(false)
    })


    
  }

  useEffect(() => {
    getDataClient(id).then((data) => {
      if (!data) return
      data.budgetPercMin && form.setValue("percMin", data.budgetPercMin + "")
      data.budgetPercMax && form.setValue("percMax", data.budgetPercMax + "")
    })

  }, [form, id])



  return (
    <div className="p-4 bg-white rounded-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="percMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porcentaje de presupuesto Mínimo (hacia abajo)</FormLabel>
              <FormControl>
                <Input placeholder="20%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="percMax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porcentaje de presupuesto Máximo (hacia arriba)</FormLabel>
              <FormControl>
                <Input placeholder="20%" {...field} />
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