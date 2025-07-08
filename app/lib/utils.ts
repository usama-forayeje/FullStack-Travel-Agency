import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const day = date.getDate().toString().padStart(2, "0");

  // Output: ( Jan, Feb, Mar)
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Output: 08-Jul-2025 11:52
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
