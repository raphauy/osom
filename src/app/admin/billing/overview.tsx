"use client"

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { CompleteData } from "./actions"

const dataOld = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

type Props = {
    billingData: CompleteData | undefined
}
export function Overview({ billingData }: Props) {

    const data: { name: string; Compra: number; Venta: number }[] = []

    billingData?.billingData.map((item) => {
          const totalPromptCost = (item.promptTokens / 1000) * billingData.pricePerPromptToken
          const totalCompletionCost = (item.completionTokens / 1000) * billingData.pricePerCompletionToken
          const totalCost = Math.round((totalPromptCost + totalCompletionCost) * 100) / 100
          const totalPromptSell = (item.promptTokens / 1000) * item.clientPricePerPromptToken
          const totalCompletionSell = (item.completionTokens / 1000) * item.clientPricePerCompletionToken
          const totalSell = Math.round((totalPromptSell + totalCompletionSell) * 100) / 100
          const clientData = {
            name: item.clientName,
            Compra: totalCost,
            Venta: totalSell,
        }
        data.push(clientData)
    })
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="Compra"
          fill="#8884d8"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="Venta"
          fill="#82ca9d"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
    
  )
}