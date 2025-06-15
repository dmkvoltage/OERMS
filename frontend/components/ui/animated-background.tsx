"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function AnimatedBackground() {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          theme === "dark"
            ? "bg-gradient-to-br from-emerald-400 to-teal-600"
            : "bg-gradient-to-br from-blue-400 to-purple-600"
        }`}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 ${
          theme === "dark"
            ? "bg-gradient-to-tr from-green-400 to-emerald-600"
            : "bg-gradient-to-tr from-purple-400 to-pink-600"
        }`}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 ${
          theme === "dark"
            ? "bg-gradient-to-bl from-teal-400 to-green-600"
            : "bg-gradient-to-bl from-orange-400 to-red-600"
        }`}
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${theme === "dark" ? "bg-emerald-400/30" : "bg-blue-400/30"}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}
