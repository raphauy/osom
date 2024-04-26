"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { LoadingSpinnerChico } from "@/components/loadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { SimilaritySearchResult } from "@/services/propertyService"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { prompt } from "@/services/clientService"
import { Info } from "lucide-react"

const models= ["gpt-3.5-turbo", "gpt-4-turbo"]
  
const formSchema = z.object({  
    prompt: z.string(({required_error: "Tienes que escribir un prompt."})),
    input: z.string(({required_error: "Tienes que escribir un input."})),
    model: z.string(({required_error: "Tienes que seleccionar un modelo."})),
    limit: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
})

export type ToolValues = z.infer<typeof formSchema>

// This can come from your database or API.
const defaultValues: Partial<ToolValues> = {
    limit: "5",
}

interface Props{
  update: (json: ToolValues) => Promise<SimilaritySearchResult[] | null>
}

export function TestTool({ update }: Props) {
  const form = useForm<ToolValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [consulta, setConsulta] = useState("")
  const [searchResults, setSearchResults] = useState<SimilaritySearchResult[] | null>([])
  const [sinResultados, setSinResultados] = useState(false)
  const router = useRouter()

  async function onSubmit(data: ToolValues) {

    if (data.input === "") {
        toast({title: "Tienes que escribir algo." })
        return
    }

    setLoading(true)
    setConsulta(data.input)
    toast({title: "Buscando..." })
    const results: SimilaritySearchResult[] | null= await update(data)
    setLoading(false)

    if (results === null) {
        toast({title: "Error al buscar." })
        return
    }

    if (results[0].idPropiedad === "SIN_RESULTADOS") {
        setSinResultados(true)
        results.shift()
        toast({title: "No se encontraron resultados." })
    } else { 
        setSinResultados(false)
        toast({title: "Mejor score: " + results[0].distance })
    }

    form.setValue("input", "")
    setSearchResults(results) 
    router.push("/admin/tests?ids=" + results.map((result) => result.idPropiedad).join(","))

}

  useEffect(() => {
    form.setValue("prompt", prompt)
    form.setValue("input", "")
    form.getValues("model") || form.setValue("model", models[0])
  }, [form, consulta])

    function handleClickConsulta() {
        form.setValue("input", consulta)
    }



  return (
    <div className="flex flex-col items-center w-full gap-2 my-2">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full max-w-4xl gap-2">
                <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prompt para ChatGPT</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder=""                  
                            {...field}
                            rows={10}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                /> 
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    { form.getValues("model") ?
                                        <SelectValue className="text-muted-foreground">{form.getValues("model")}</SelectValue> :
                                        <SelectValue className="text-muted-foreground">{models[0]}</SelectValue>
                                    }
                                    
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {models.map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))
                            }
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="limit" render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Cantidad de propiedades a enviar a ChatGPT</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                </div>
                <FormField control={form.control} name="input" render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Input del usuario</FormLabel>
                        <FormControl>
                            <Input placeholder="ej: busco casa de dos dormitorios para alquilar en zona Pocitos" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-32" >{loading ? <LoadingSpinnerChico /> : <p>Consultar</p>}</Button>
            </form>
        </Form>
        { consulta &&
            <p className="text-xl font-bold cursor-pointer" onClick={handleClickConsulta}>Consulta:  &quot;{consulta}&quot;</p>
        }
        { sinResultados &&
            <p className="text-xl font-bold text-red-400" >ChatGPT descartó todas propiedades enviadas:</p>
        }
        { searchResults && searchResults.length > 0 &&
            <div className="flex items-center justify-center w-full gap-2 text-muted-foreground dark:text-white">
                <p>Similarity:</p>
                { searchResults.map((result) => (
                    <HoverCard key={result.idPropiedad}>
                        <HoverCardTrigger>                            
                            <div key={result.idPropiedad} className="flex flex-col justify-center p-1 my-2 border rounded-md ">

                                <div className="flex justify-center">
                                    <Info size={11} />
                                </div>                           

                                <div className="flex items-center gap-2 ">
                                    <p className="font-bold">{result.idPropiedad + ":"}</p>
                                    <p className="font-bold">{result.distance.toFixed(3)}</p>
                                </div>

                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex items-center justify-between gap-4 border-b">
                                <p className="font-bold">Propiedad {result.idPropiedad}</p>
                                <p className="font-bold">similarity: {result.distance.toFixed(3)}</p>
                            </div>
                            <div>
                                <p className="font-bold">Info enviada a ChatGPT:</p>
                                {result.content}
                            </div>
                            
                        </HoverCardContent>
                    </HoverCard>
                  
                ))}
            </div>
        }
        
    </div>
 )
}