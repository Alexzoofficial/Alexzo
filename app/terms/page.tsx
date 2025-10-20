"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Shield, FileText, Users, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import Image from "next/image"

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Terms of Service",
      content: "By accessing and using Alexzo's services, you agree to be bound by these terms and conditions.",
    },
    {
      icon: Users,
      title: "User Responsibilities",
      content: "Users must provide accurate information and use our services in compliance with applicable laws.",
    },
    {
      icon: Shield,
      title: "Privacy Protection",
      content: "We are committed to protecting your privacy and handling your data with the utmost care.",
    },
    {
      icon: AlertTriangle,
      title: "Limitation of Liability",
      content: "Our liability is limited as outlined in the detailed terms below.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-4">
          <ArrowLeft className="h-6 w-6" />
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Alexzo Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold">Alexzo</span>
          </div>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AdaptiveAnimation>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services.
            </p>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Overview Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {sections.map((section, index) => (
              <AdaptiveAnimation key={index} delay={index * 200}>
                <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <section.icon className="h-8 w-8 text-purple-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-3">{section.title}</h3>
                    <p className="text-gray-300 text-sm">{section.content}</p>
                  </CardContent>
                </Card>
              </AdaptiveAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <AdaptiveAnimation>
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-6">Detailed Terms and Conditions</h2>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">1. Acceptance of Terms</h3>
              <p className="text-gray-300 mb-6">
                By accessing and using Alexzo's website and services, you accept and agree to be bound by the terms and
                provision of this agreement. These terms apply to all visitors, users, and others who access or use the
                service.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">2. Use License</h3>
              <p className="text-gray-300 mb-6">
                Permission is granted to temporarily download one copy of the materials on Alexzo's website for
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="text-gray-300 mb-6 list-disc pl-6">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">3. Privacy Policy</h3>
              <p className="text-gray-300 mb-6">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                information when you use our service. By using our service, you agree to the collection and use of
                information in accordance with our Privacy Policy.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">4. User Accounts</h3>
              <p className="text-gray-300 mb-6">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. You are responsible for safeguarding the password and for all activities that occur under
                your account.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">5. Prohibited Uses</h3>
              <p className="text-gray-300 mb-6">
                You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts. You
                may not violate any international, federal, provincial, or state regulations, rules, or laws.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">6. Limitation of Liability</h3>
              <p className="text-gray-300 mb-6">
                In no event shall Alexzo or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on Alexzo's website.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">7. Changes to Terms</h3>
              <p className="text-gray-300 mb-6">
                Alexzo may revise these terms of service at any time without notice. By using this website, you are
                agreeing to be bound by the then current version of these terms of service.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">8. Contact Information</h3>
              <p className="text-gray-300 mb-6">
                If you have any questions about these Terms and Conditions, please contact us at alexzomail@proton.me.
              </p>

              <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-sm text-gray-400">
                  <strong>Last updated:</strong> January 1, 2025
                </p>
              </div>
            </div>
          </AdaptiveAnimation>
        </div>
      </section>
    </div>
  )
}
