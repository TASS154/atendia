import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function waLink(phone: string, message: string) {
  const digits = onlyDigits(phone);
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

export function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => vars[key] ?? "");
}

export function hoursSince(date: Date | string | null | undefined) {
  if (!date) return null;
  const t = typeof date === "string" ? new Date(date) : date;
  return Math.floor((Date.now() - t.getTime()) / 36e5);
}

export function daysSince(date: Date | string | null | undefined) {
  if (!date) return null;
  const t = typeof date === "string" ? new Date(date) : date;
  return Math.floor((Date.now() - t.getTime()) / 864e5);
}

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 36e5);
}

export function serialize(data: unknown) {
  return JSON.parse(JSON.stringify(data));
}
