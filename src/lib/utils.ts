import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and merges Tailwind classes using twMerge
 * @param inputs - Class names to combine
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a localized format
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Generates a random string of specified length
 * @param length - Length of the string to generate
 * @returns Random string
 */
export function generateId(length: number = 8) {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Safely access nested object properties with improved type safety
 * @param obj - Object to access
 * @param path - Path to the property
 * @param defaultValue - Default value if property doesn't exist
 * @returns Property value or default value
 */
export function get<T, D = undefined>(
  obj: T, 
  path: string, 
  defaultValue?: D
): D extends undefined 
  ? (T extends Record<string, unknown> 
     ? unknown 
     : D) 
  : D {
  const keys = path.replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);

  let result: unknown = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      result = undefined;
      break;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return (result === undefined || result === obj 
    ? defaultValue 
    : result) as D extends undefined 
      ? (T extends Record<string, unknown> 
         ? unknown 
         : D) 
      : D;
}