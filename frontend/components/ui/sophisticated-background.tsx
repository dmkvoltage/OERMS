"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function SophisticatedBackground() {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
        }`}
      />

      {/* Animated gradient orbs - more subtle and harmonious */}
      <motion.div
        className={`absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 ${
          theme === "dark"
            ? "bg-gradient-to-br from-blue-500 to-indigo-600"
            : "bg-gradient-to-br from-blue-300 to-indigo-400"
        }`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15 ${
          theme === "dark"
            ? "bg-gradient-to-tr from-purple-500 to-pink-600"
            : "bg-gradient-to-tr from-purple-300 to-pink-400"
        }`}
        animate={{
          scale: [1.1, 1, 1.1],
          rotate: [180, 90, 0],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className={`absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-10 ${
          theme === "dark"
            ? "bg-gradient-to-bl from-amber-500 to-orange-600"
            : "bg-gradient-to-bl from-amber-300 to-orange-400"
        }`}
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Subtle floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${theme === "dark" ? "bg-blue-400/40" : "bg-blue-500/30"}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Mesh gradient overlay */}
      <div
        className={`absolute inset-0 opacity-30 ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"
        }`}
      />
    </div>
  )
}
