"use user"

import { zodResolver } from "@hookform/resolvers/zod"
import { ControllerRenderProps, useForm } from "react-hook-form"
import * as z from "zod"

import { LoadingSpinnerChico } from "@/components/loadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { User } from "@prisma/client"
import { useEffect, useState } from "react"
import { getDataUser } from "./actions"
import { DataClient, getDataClients } from "../../clients/(crud)/actions"
import { get } from "http"

export const roles= [
  "admin",
  "osom",
  "cliente",
]

const formSchema = z.object({  
  nombre: z.string().optional(),
  email: z.string().email(),    
  rol: z.string({required_error: "Role is required."}),
  clienteId: z.string().optional(),
})

export type UserFormValues = z.infer<typeof formSchema>

// This can come from your database or API.
const defaultValues: Partial<UserFormValues> = {}

interface Props{
  id?: string
  create: (data: UserFormValues) => Promise<User | null>
  update: (userId: string, json: UserFormValues) => Promise<User | null>
  closeDialog: () => void
}

export function UserForm({ id, create, update, closeDialog }: Props) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<DataClient[]>([])
  const [clientName, setClientName] = useState("")

  async function onSubmit(data: UserFormValues) {

    setLoading(true)
    let message= null
    if (id) {
      await update(id, data)
      message= "Usuario editado 🏁"
    } else {
      await create(data)
      message= "Usuario creado 🏁"
    }
    setLoading(false)
      
    toast({title: message })

    closeDialog && closeDialog()
  }

  useEffect(() => {
    getDataClients().then((data) => {
      setClients(data)
    })

    if (id) {
      getDataUser(id).then((data) => {
        if (!data) return
        data.nombre && form.setValue("nombre", data.nombre)
        form.setValue("email", data.email)
        form.setValue("rol", data.rol)
        data.cliente && setClientName(data.cliente)
      })
    }  
  }, [form, id])



  return (
    <div className="p-4 bg-white rounded-md">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email del usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    {
                      id ? 
                      <SelectValue className="text-muted-foreground">{form.getValues("rol")}</SelectValue> :
                      <SelectValue className="text-muted-foreground" placeholder="Selecciona un Rol" />
                    }
                    
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))
                  }
                </SelectContent>
              </Select>
              <FormDescription>admin: puede hacer todo</FormDescription>
              <FormDescription>osom: puede ver/editar todos los clientes</FormDescription>
              <FormDescription>client: puede ver/editar solo la info de un cliente</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
        control={form.control}
        name="clienteId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  {
                    id ? 
                    <SelectValue className="text-muted-foreground" placeholder={clientName} /> :
                    <SelectValue className="text-muted-foreground" placeholder="Selecciona un Cliente" />
                  }
                  
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.nombre}</SelectItem>
                ))
                }
              </SelectContent>
            </Select>
            <FormDescription>El cliente solo afecta a usuarios con rol &ldquo;cliente&ldquo;</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-end">
          <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
          <Button type="submit" className="w-32 ml-2" >{loading ? <LoadingSpinnerChico /> : <p>Save</p>}</Button>
        </div>
      </form>
    </Form>
   </div>
 )
}