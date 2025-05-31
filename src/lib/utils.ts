import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Use nanoid for more reliable unique code generation
const generateId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

export function generateUniqueCode(): string {
  return generateId()
}
