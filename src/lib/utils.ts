import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const numberToEnglish = (numbers: string) => {
  if (!numbers) {
    return numbers
  }

  return numbers
    .replace(/[۰٠]/g, '0')
    .replace(/[۱١]/g, '1')
    .replace(/[۲٢]/g, '2')
    .replace(/[۳٣]/g, '3')
    .replace(/[۴٤]/g, '4')
    .replace(/[۵٥]/g, '5')
    .replace(/[۶٦]/g, '6')
    .replace(/[۷٧]/g, '7')
    .replace(/[۸٨]/g, '8')
    .replace(/[۹٩]/g, '9')
}

export function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const numberToPersian = (number: number) => {
  return new Intl.NumberFormat('fa-IR').format(number)
}

export function normalizeNumericInput(str: string): string {
  // Convert Persian/Arabic digits → English
  const english = str.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))

  // Allow digits and a single decimal point
  return english
    .replace(/[^0-9.]/g, '') // keep 0-9 and .
    .replace(/(\..*?)\./g, '$1') // remove any extra dots beyond the first
}
