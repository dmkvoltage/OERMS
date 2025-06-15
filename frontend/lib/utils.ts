import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Enhanced ResizeObserver error suppression utility
export const suppressResizeObserverErrors = () => {
  if (typeof window !== "undefined") {
    // Already handled in layout.tsx
    return () => {}
  }
}
