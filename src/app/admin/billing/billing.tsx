"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowDownCircle, ArrowUpCircle, CalendarClock, ChevronLeft, ChevronRight, Disc, Loader, PercentCircle, Search, Sigma } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { BillingData, CompleteData, getBillingDataAction } from "./actions"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Overview } from "./overview"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import TokensCard from "./tokens-card"
import ValueCard from "./value-card"
import ValueClientCard from "./value-client-card"
import { cn } from "@/lib/utils"

type Props = {
  clientId?: string
}

export function Billing({ clientId }: Props) {

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    getBillingDataAction(from, to, clientId)
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
            {
              !clientId && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="overview">
                    <AccordionTrigger>Gráfico</AccordionTrigger>
                    <AccordionContent>
                      <Overview billingData={data} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>  
              )
            }

            <BillingCard data={data} adminPanel={clientId ? false : true} />

          </div>
            

        }
      </main>
    </div>
  )
}


type BillingCardProps = {
  data: CompleteData | undefined
  adminPanel?: boolean
}
function BillingCard({ data, adminPanel }: BillingCardProps) {
  return data?.billingData.map((item) => {

    const totalPromptCost = (item.promptTokens / 1000) * data.pricePerPromptToken
    const totalCompletionCost = (item.completionTokens / 1000) * data.pricePerCompletionToken
    const totalCost = totalPromptCost + totalCompletionCost

    const totalPromptSell = (item.promptTokens / 1000) * item.clientPricePerPromptToken
    const totalCompletionSell = (item.completionTokens / 1000) * item.clientPricePerCompletionToken

    const percentage= data.totalCost ? totalCost / data.totalCost * 100 : 0


    return (
      <div key={item.clientName} className="grid gap-6 mt-5 mb-24 md:grid-cols-2">
        <p className="col-span-2 mt-5 text-3xl font-bold text-center">{item.clientName}</p>

        {/** Total tokens */}
        <TokensCard promptTokens={item.promptTokens} completionTokens={item.completionTokens} />
        
        {/** Porcentaje */}
        {
          adminPanel ? (
            <>
              <Card className={cn("flex flex-col justify-between", totalCost === 0 && "opacity-20")}>
                <CardHeader>
                  <CardDescription>
                    <div className="flex justify-between">
                      <p>Utilización en el período</p>
                      <PercentCircle />
                    </div>
                  </CardDescription>
                  <CardTitle>
                    <div className="flex items-center justify-between">
                      <p>{percentage.toFixed(1)}%</p>
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

              {/** Total Compra */}
              <ValueCard  promptPrice={data.pricePerPromptToken} completionPrice={data.pricePerCompletionToken} promptCost={totalPromptCost} completionCost={totalCompletionCost} costIcon={true} />

              {/** Total Venta */}
              <ValueCard promptPrice={item.clientPricePerPromptToken} completionPrice={item.clientPricePerCompletionToken} promptCost={totalPromptSell} completionCost={totalCompletionSell} costIcon={false} />
            </>
          ) : (
            <ValueClientCard promptPrice={item.clientPricePerPromptToken} completionPrice={item.clientPricePerCompletionToken} promptCost={totalPromptSell} completionCost={totalCompletionSell} />
          )
        }


      </div>            
    )}          
  )           

}

