"use client"

import { motion } from "framer-motion"
import { ArrowLeft, AlertTriangle, Info, Shield, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import Image from "next/image"

export default function DisclaimerPage() {
  const disclaimerSections = [
    {
      icon: AlertTriangle,
      title: "General Disclaimer",
      content: "Information provided is for general purposes only and should not be considered as professional advice.",
    },
    {
      icon: Info,
      title: "Accuracy of Information",
      content:
        "While we strive for accuracy, we make no warranties about the completeness or reliability of information.",
    },
    {
      icon: Shield,
      title: "Limitation of Liability",
      content: "We are not liable for any losses or damages arising from the use of our website or services.",
    },
    {
      icon: FileText,
      title: "External Links",
      content: "We are not responsible for the content or practices of external websites linked from our site.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
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
                src="https://alexzo.vercel.app/logo.png"
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
              Disclaimer
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Important information about the use of our website and services.
            </p>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Overview Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {disclaimerSections.map((section, index) => (
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

      {/* Detailed Disclaimer */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <AdaptiveAnimation>
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-6">Website Disclaimer</h2>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">General Information</h3>
              <p className="text-gray-300 mb-6">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law,
                this Company excludes all representations, warranties, conditions and terms (whether express or implied
                by statute, common law or otherwise) which but for this exclusion would or might subsist in favor of
                this Company.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">Professional Advice Disclaimer</h3>
              <p className="text-gray-300 mb-6">
                The information contained in this website is for general information purposes only. The information is
                provided by Alexzo and while we endeavor to keep the information up to date and correct, we make no
                representations or warranties of any kind, express or implied, about the completeness, accuracy,
                reliability, suitability or availability with respect to the website or the information, products,
                services, or related graphics contained on the website for any purpose.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">Limitation of Liability</h3>
              <p className="text-gray-300 mb-6">
                In no event will we be liable for any loss or damage including without limitation, indirect or
                consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits
                arising out of, or in connection with, the use of this website.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">External Links Disclaimer</h3>
              <p className="text-gray-300 mb-6">
                Through this website you are able to link to other websites which are not under the control of Alexzo.
                We have no control over the nature, content and availability of those sites. The inclusion of any links
                does not necessarily imply a recommendation or endorse the views expressed within them.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">AI Technology Disclaimer</h3>
              <p className="text-gray-300 mb-6">
                Our AI-powered products are designed to enhance human cognitive abilities. Results may vary between
                individuals. These products are not intended to diagnose, treat, cure, or prevent any medical condition.
                Please consult with healthcare professionals before using our cognitive enhancement technologies if you
                have any medical concerns.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-300">Data and Privacy</h3>
              <p className="text-gray-300 mb-6">
                While we implement security measures to protect your data, no method of transmission over the internet
                or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
              </p>

              <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-300 mb-2">Important Notice</h4>
                    <p className="text-sm text-gray-300">
                      By using our website and services, you acknowledge that you have read, understood, and agree to
                      this disclaimer. If you do not agree with any part of this disclaimer, please do not use our
                      website.
                    </p>
                  </div>
                </div>
              </div>

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
