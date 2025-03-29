// Importacion de utilidades
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Funcion para combinar clases usando tailwind-merge y clsx.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}