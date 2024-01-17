"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarClock, ChevronLeft, ChevronRight, Loader, Search, Sigma } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { BillingData, CompleteData, getBillingDataAction } from "./actions"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Overview } from "./overview"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


export function Billing() {

  const [loading, setLoading] = useState(false)

  const [from, setFrom] = useState<Date | undefined>(new Date())
  const [to, setTo] = useState<Date | undefined>(new Date())

  const [monthLabel, setMonthLabel] = useState("")

  const [data, setData] = useState<CompleteData>()

  useEffect(() => {
    // monthLabel is a string like "January", "February", "march" or "range"
    // if range start and end are the same month, we show the month name
    // if range start and end are different months, we show "range"
    const startMonth = format(from ?? new Date(), "MMMM", { locale: es })
    const endMonth = format(to ?? new Date(), "MMMM", { locale: es })
    const startYear = format(from ?? new Date(), "yyyy", { locale: es })
    const endYear = format(to ?? new Date(), "yyyy", { locale: es })
    if (startMonth === endMonth && startYear === endYear) {
      setMonthLabel(startMonth)
    } else {
      setMonthLabel("personalizado")
    }
  }, [from, to])

  useEffect(() => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    setFrom(firstDay)
    setTo(lastDay)
    search(firstDay, lastDay)
  }, [])

  function upMonth() {
    const newDate = new Date(from ?? new Date())
    const firstDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1)
    const lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 2, 0)
    setFrom(firstDay)
    setTo(lastDay)
    search(firstDay, lastDay)
  }

  function downMonth() {
    const newDate = new Date(from ?? new Date())
    const firstDay = new Date(newDate.getFullYear(), newDate.getMonth() - 1, 1)
    const lastDay = new Date(newDate.getFullYear(), newDate.getMonth(), 0)
    setFrom(firstDay)
    setTo(lastDay)
    search(firstDay, lastDay)
  }

  function search(from: Date, to: Date) {
    setLoading(true)
    if (!from || !to) {
      console.log("no dates")
      return
    }
    to.setHours(23)
    to.setMinutes(59)
    to.setSeconds(59)
    to.setMilliseconds(999)
    getBillingDataAction(from, to)
    .then((data) => {
      console.log(data)
      setData(data)
    })
    .catch((err) => {
      toast({ title: "Error al cargar los datos", variant: "destructive" })
    })
    .finally(() => {
      setLoading(false)
    })   
  }

  return (
    <div className="flex flex-col w-full">
      <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="outline" onClick={downMonth} disabled={loading}>
              <ChevronLeft className="w-5 h-5" />
              <span className="sr-only">Previous month</span>
            </Button>
            <p className="w-20 text-center">{monthLabel}</p>
            {/* disable the button if the month of to is the current month or later */}
            <Button size="icon" variant="outline" onClick={upMonth} disabled={to && to > new Date() || loading}>
              <ChevronRight className="w-5 h-5" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-[280px] justify-center text-left font-normal" id="date" variant="outline">
                  <CalendarClock className="w-4 h-4 mr-2" />
                  <p>Desde: {format(from ?? new Date(), "PPP", { locale: es })}</p>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0">
                <Calendar
                  mode="single"
                  onSelect={setFrom}
                  selected={from}
                  defaultMonth={from}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-[280px] justify-start text-left font-normal" id="date" variant="outline">
                  <CalendarClock className="w-4 h-4 mr-2" />
                  <p>Hasta: {format(to ?? new Date(), "PPP", { locale: es })}</p>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0">
                <Calendar
                  mode="single"
                  onSelect={setTo}
                  selected={to}
                  defaultMonth={to}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }           
                />
              </PopoverContent>
            </Popover>
            <Button className="hidden sm:flex" onClick={() => search(from ?? new Date(), to ?? new Date())}>
              {
                loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )
              }
            </Button>
          </div>
        </div>
        {
          loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Loader className="w-10 h-10 animate-spin" />
            </div>
          ) : 

          <div>
            {/* <Overview billingData={data} /> */}
            <Accordion type="single" collapsible>
              <AccordionItem value="overview">
                <AccordionTrigger>Gráfico</AccordionTrigger>
                <AccordionContent>
                  <Overview billingData={data} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <BillingCard data={data} />

          </div>
            

        }
      </main>
    </div>
  )
}



function BillingCard({ data }: { data: CompleteData | undefined }) {
  return data?.billingData.map((item) => {

    const totalCost = item.promptTokensCost + item.completionTokensCost
    const percentage= data.totalCost ? totalCost / data.totalCost * 100 : 0


    return (
      <div key={item.clientName} className="grid gap-6 md:grid-cols-3">
        <p className="col-span-3 mt-5 text-3xl font-bold text-center">{item.clientName}</p>
        <Card className="flex flex-col">
          <CardHeader>
            <CardDescription>
              <div className="flex justify-between">
                <p>Prompt Tokens</p>
                <p>{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD" }).format(data.pricePerPromptToken)}</p>
              </div>
            </CardDescription>
            <CardTitle>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD" }).format(item.promptTokensCost)}</p>                        
                <p>{Intl.NumberFormat("es-UY").format(item.promptTokens)}</p>
              </div>                      
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-right">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD" }).format(item.completionTokensCost)}</p>                        
                <p>{Intl.NumberFormat("es-UY").format(item.completionTokens)}</p>                        
              </div>
            </CardTitle>
            <CardDescription>
              <div className="flex justify-between">
                <p>Completion Tokens</p>
                <p>{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD" }).format(data.pricePerCompletionToken)}</p>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="mt-8">
            <CardDescription>
              <div className="flex justify-between">
                <p>Total Tokens</p>
                <p>Total Cost</p>
              </div>
            </CardDescription>
            <CardTitle>
              <div className="flex items-center justify-between">
                <p>{Intl.NumberFormat("es-UY").format(item.promptTokens + item.completionTokens)}</p>
                <p>{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD" }).format(totalCost)}</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardDescription>Porcentaje de uso</CardDescription>
            <CardTitle>
              <div className="flex items-center justify-between">
                <p>{percentage.toFixed(1)}%</p>
                <Sigma />
              </div>                    
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-muted-foreground">
              <p>{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD" }).format(totalCost)}</p>
              <p>{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD" }).format(data.totalCost)}</p>
            </div>
            <Progress value={percentage} indicatorColor="bg-blue-500" className="h-2" />
          </CardContent>                  
        </Card>
      </div>            
    )}          
  )           

}

