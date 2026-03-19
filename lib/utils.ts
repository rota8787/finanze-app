import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { it } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "dd MMM yyyy", { locale: it })
}

export function formatMonth(date: string | Date) {
  return format(new Date(date), "MMMM yyyy", { locale: it })
}
