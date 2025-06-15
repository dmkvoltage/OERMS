"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedGlassCard } from "@/components/ui/enhanced-glass-card"
import { SophisticatedBackground } from "@/components/ui/sophisticated-background"
import {
  BookOpen,
  Users,
  Award,
  Shield,
  ChevronRight,
  GraduationCap,
  FileText,
  Globe,
  Zap,
  Heart,
  Moon,
  Sun,
  MapPin,
  Star,
  Target,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"
import { cameroonExams, cameroonRegions } from "@/lib/cameroon-exams"

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { theme, setTheme } = useTheme()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -30])

  const features = [
    {
      icon: BookOpen,
      title: "Intelligent Exam Management",
      description: "AI-powered examination system with automated scheduling and smart resource allocation",
      color: "from-blue-500 to-indigo-600",
      variant: "primary" as const,
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description: "Seamless integration between institutions, educators, and students nationwide",
      color: "from-purple-500 to-pink-600",
      variant: "secondary" as const,
    },
    {
      icon: Award,
      title: "Advanced Analytics",
      description: "Real-time insights and predictive analytics for educational performance optimization",
      color: "from-amber-500 to-orange-600",
      variant: "accent" as const,
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption with blockchain-verified result authentication",
      color: "from-teal-500 to-cyan-600",
      variant: "default" as const,
    },
  ]

  const stats = [
    { number: "500+", label: "Educational Institutions", icon: Globe, color: "text-blue-600" },
    { number: "450K+", label: "Active Students", icon: Users, color: "text-purple-600" },
    { number: "2.5M+", label: "Examinations Conducted", icon: FileText, color: "text-amber-600" },
    { number: "99.9%", label: "System Reliability", icon: Zap, color: "text-teal-600" },
  ]

  const examCategories = [
    {
      title: "Secondary Education",
      exams: cameroonExams.secondary,
      gradient: "from-purple-400 via-purple-500 to-pink-600",
      icon: "📚",
      variant: "secondary" as const,
    },
    {
      title: "Anglophone System",
      exams: cameroonExams.anglophone,
      gradient: "from-indigo-400 via-indigo-500 to-purple-600",
      icon: "🇬🇧",
      variant: "primary" as const,
    },
    {
      title: "Professional Training",
      exams: cameroonExams.professional,
      gradient: "from-amber-400 via-amber-500 to-orange-600",
      icon: "🔧",
      variant: "accent" as const,
    },
    {
      title: "Higher Education",
      exams: cameroonExams.higher,
      gradient: "from-teal-400 via-teal-500 to-cyan-600",
      icon: "🎯",
      variant: "default" as const,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SophisticatedBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ExamPortal
                </span>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Cameroon</div>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Examinations", "Regions", "Contact"].map((item, index) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all group-hover:w-full" />
                </Link>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full w-10 h-10 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-blue-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </Button>

              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 rounded-xl">
                  Access Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 px-6 py-3 rounded-full mb-8 border border-blue-200/50 dark:border-blue-800/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                Republic of Cameroon - Ministry of Higher Education
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 dark:text-white mb-8 leading-tight">
              <span className="block mb-2">National Digital</span>
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Education Hub
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transforming Cameroon's educational landscape with cutting-edge technology, seamless examination
              management, and intelligent analytics for the digital age.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/auth">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 rounded-2xl px-10 py-5 text-lg font-semibold"
                  >
                    Launch Platform
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>

              <Link href="/results/public">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-2xl px-10 py-5 text-lg font-semibold"
                  >
                    View Results
                    <Award className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <EnhancedGlassCard className="text-center" hover variant="default">
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-r ${
                      index === 0
                        ? "from-blue-500 to-indigo-600"
                        : index === 1
                          ? "from-purple-500 to-pink-600"
                          : index === 2
                            ? "from-amber-500 to-orange-600"
                            : "from-teal-500 to-cyan-600"
                    } rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">{stat.label}</div>
                </EnhancedGlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30">
              Advanced Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Next-Generation Education Technology
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Empowering educational excellence through innovative solutions designed for Cameroon's diverse academic
              landscape.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <EnhancedGlassCard variant={feature.variant} hover className="h-full">
                  <div className="flex items-start space-x-6">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </EnhancedGlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Examinations Section */}
      <section id="examinations" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30">
              Examination Systems
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Comprehensive Assessment Platform
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Supporting all major examination systems in Cameroon with seamless integration and real-time processing.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {examCategories.map((category, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <EnhancedGlassCard variant={category.variant} hover className="h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{category.title}</h3>
                    <div className="space-y-2">
                      {category.exams.slice(0, 3).map((exam, examIndex) => (
                        <div
                          key={examIndex}
                          className="text-sm text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 rounded-lg px-3 py-2"
                        >
                          {exam}
                        </div>
                      ))}
                      {category.exams.length > 3 && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                          +{category.exams.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </EnhancedGlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Regions Section */}
      <section id="regions" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-950/50 dark:to-cyan-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/30">
              National Coverage
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Serving All Regions of Cameroon
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive educational support across all ten regions, ensuring equal access to quality examination
              services nationwide.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {cameroonRegions.map((region, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <EnhancedGlassCard hover className="text-center">
                  <MapPin className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{region.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{region.capital}</p>
                  <div className="mt-3 text-xs text-teal-600 dark:text-teal-400 font-medium">
                    {region.institutions} Institutions
                  </div>
                </EnhancedGlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <EnhancedGlassCard variant="primary" size="lg">
              <div className="flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                <Target className="w-8 h-8 text-blue-500 mr-3" />
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
                Ready to Transform Education?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of institutions and students already benefiting from our advanced examination management
                platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 rounded-2xl px-8 py-4"
                    >
                      Get Started Today
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/results/public">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-2xl px-8 py-4"
                    >
                      Explore Results
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </EnhancedGlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">ExamPortal</span>
                  <div className="text-xs text-blue-400">Cameroon</div>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Empowering Cameroon's educational future through innovative technology and seamless examination
                management.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link href="/auth" className="hover:text-blue-400 transition-colors">
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-blue-400 transition-colors">
                    Institution Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/results/public" className="hover:text-blue-400 transition-colors">
                    Public Results
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-blue-400 transition-colors">
                    Ministry Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link href="/help" className="hover:text-blue-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="hover:text-blue-400 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-blue-400 transition-colors">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ministry</h3>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a
                    href="https://minesup.gov.cm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    MINESUP
                  </a>
                </li>
                <li>
                  <a
                    href="https://minedub.cm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    MINEDUB
                  </a>
                </li>
                <li>
                  <Link href="/policies" className="hover:text-blue-400 transition-colors">
                    Policies
                  </Link>
                </li>
                <li>
                  <Link href="/regulations" className="hover:text-blue-400 transition-colors">
                    Regulations
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 ExamPortal Cameroon. All rights reserved. Ministry of Higher Education.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
