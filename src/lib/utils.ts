import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export async function validateLMStudioUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/v1/models`);
    return response.ok;
  } catch {
    return false;
  }
}