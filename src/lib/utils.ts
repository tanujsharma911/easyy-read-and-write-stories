import { config } from "@/components/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function groupBy<T, _K extends keyof T>(
  array: T[],
  key: _K
): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const keyValue = String(item[key]);
    if (!acc[keyValue]) acc[keyValue] = [];
    acc[keyValue].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function absoluteUrl(path: string) {
  return process.env.NODE_ENV === "development"
    ? `http://localhost:3000${path}`
    : `https://${config.appUrl}${path}`;
}
