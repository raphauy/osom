import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPresupuesto(presupuestoStr: string | undefined) {
  // in: 200000 USD, out: 200.000 USD
  // in: 200000, out: 200.000
  // in: 200000 UYU, out: 200.000 UYU

  if (!presupuestoStr) return ""

  const [presupuesto, moneda] = presupuestoStr.split(" ")
  // if presupuesto is not a number, return the original string
  if (isNaN(parseInt(presupuesto))) return presupuestoStr

  const presupuestoFormateado = parseInt(presupuesto).toLocaleString("es-UY")

  const monedaOut= moneda ? moneda : ""

  return `${presupuestoFormateado} ${monedaOut}`
}