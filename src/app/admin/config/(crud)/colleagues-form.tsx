"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { LoadingSpinnerChico } from "@/components/loadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { getColleguesMessageAction } from "../../clients/(crud)/actions"
import { setColleaguesMessageAction } from "./actions"


const formSchema = z.object({  
  colleaguesMessage: z.string().optional(),
  clienteId: z.string().optional(),
})

export type ColleaguesFormValues = z.infer<typeof formSchema>

const defaultValues: Partial<ColleaguesFormValues> = {
  colleaguesMessage: "",
}

interface Props{
  id: string
  closeDialog: () => void
}

export function ColleaguesForm({ id, closeDialog }: Props) {
  const form = useForm<ColleaguesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  async function onSubmit(data: ColleaguesFormValues) {

    setLoading(true)

    setColleaguesMessageAction(id, data.colleaguesMessage || "")
    .then((res) => {
      toast({title: "Se guardó el mensaje para los colegas" })
      window.location.reload()
      closeDialog()
    })
    .catch((err) => {
      toast({title: "Error al guardar el mensaje para los colegas", variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
    })


    
  }

  useEffect(() => {
    getColleguesMessageAction(id)
    .then((res) => {
      if (res)
        form.setValue("colleaguesMessage", res)
    })
    .catch((err) => {
      console.log(err)
    })
    

  }, [form, id])



  return (
    <div className="p-4 bg-white rounded-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="colleaguesMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje para los colegas</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Mensaje para los colegas" {...field} />
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