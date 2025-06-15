"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function GlassCard({ children, className, hover = true, gradient = false }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl",
        gradient
          ? "bg-gradient-to-br from-white/10 to-white/5 dark:from-emerald-900/20 dark:to-green-900/10"
          : "bg-white/80 dark:bg-gray-900/80",
        "shadow-xl shadow-black/5 dark:shadow-emerald-500/5",
        hover && "transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-emerald-500/10",
        className,
      )}
      whileHover={hover ? { y: -2, scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent dark:from-transparent dark:via-emerald-500/5 dark:to-transparent" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
