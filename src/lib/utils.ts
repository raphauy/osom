import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithDots(numberString: string): string {
  // Convertir el string a un número.
  const number = parseInt(numberString);
  
  // Utilizar toLocaleString para formatear con el punto como separador de miles.
  // Asegúrate de especificar las opciones de localización correctas para el punto.
  // Por ejemplo, 'de-DE' para Alemania usa el punto como separador de miles.
  return number.toLocaleString('es-UY');
}

