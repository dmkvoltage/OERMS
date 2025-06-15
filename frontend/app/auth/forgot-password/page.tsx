"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, GraduationCap, Mail } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { EnhancedGlassCard } from "@/components/ui/enhanced-glass-card"
import { Badge } from "@/components/ui/badge"

// Add ResizeObserver error suppression
if (typeof window !== "undefined") {
  const resizeObserverErrorHandler = (e: ErrorEvent) => {
    if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
      e.stopImmediatePropagation()
      return false
    }
  }

  window.addEventListener("error", resizeObserverErrorHandler)
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 dark:opacity-20"></div>
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-blue-100/30 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-indigo-100/30 to-transparent dark:from-indigo-900/10 dark:to-transparent"></div>
      </div>

      <div className="w-full max-w-md z-10 relative">
        {/* Header - Simplified Animation */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Link
            href="/auth"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">ExamPortal</span>
          </div>
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Password Recovery
          </Badge>
        </motion.div>

        {/* Main Card - Simplified Animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          <EnhancedGlassCard variant="primary" size="md" className="shadow-sophisticated-lg">
            {!submitted ? (
              <>
                <div className="text-center p-6 pb-2">
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Reset Password</h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                <div className="p-6 pt-2">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white transition-all duration-200"
                    >
                      Send Reset Link
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Check Your Email</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400">{email}</span>
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-200 transition-all duration-200"
                >
                  Back to Reset Form
                </Button>
              </div>
            )}
          </EnhancedGlassCard>
        </motion.div>

        {/* Footer - Simplified Animation */}
        <motion.div
          className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        >
          <p>
            Remember your password?{" "}
            <Link
              href="/auth"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
