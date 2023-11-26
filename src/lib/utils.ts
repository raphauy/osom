import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithDots(numberString: string): string {
  const number = parseInt(numberString);
  
  return number.toLocaleString('es-UY');
}

