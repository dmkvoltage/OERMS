"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface EnhancedGlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  variant?: "default" | "primary" | "secondary" | "accent"
  size?: "sm" | "md" | "lg"
}

export function EnhancedGlassCard({
  children,
  className,
  hover = true,
  variant = "default",
  size = "md",
}: EnhancedGlassCardProps) {
  const variants = {
    default: "bg-white/70 dark:bg-slate-800/70 border-white/20 dark:border-slate-700/30",
    primary:
      "bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200/30 dark:border-blue-800/30",
    secondary:
      "bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200/30 dark:border-purple-800/30",
    accent:
      "bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200/30 dark:border-amber-800/30",
  }

  const sizes = {
    sm: "p-4 rounded-xl",
    md: "p-6 rounded-2xl",
    lg: "p-8 rounded-3xl",
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden backdrop-blur-xl border shadow-lg",
        "transition-all duration-300",
        hover && "hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5",
        variants[variant],
        sizes[size],
        className,
      )}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
