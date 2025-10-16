"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Send, MessageSquare, Users, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import Image from "next/image"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // TODO: Implement Supabase form submission
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", company: "", subject: "", category: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactReasons = [
    {
      icon: MessageSquare,
      title: "General Inquiries",
      description: "Questions about our products or services",
    },
    {
      icon: Users,
      title: "Partnership",
      description: "Collaboration and business opportunities",
    },
    {
      icon: Lightbulb,
      title: "Feedback",
      description: "Share your thoughts and suggestions",
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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions about Mind Gorw or our other AI products? We'd love to hear from you.
            </p>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Contact Reasons */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AdaptiveAnimation>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Can We Help?</h2>
            </div>
          </AdaptiveAnimation>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactReasons.map((reason, index) => (
              <AdaptiveAnimation key={index} delay={index * 200}>
                <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full group">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <reason.icon className="h-8 w-8 text-purple-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-3">{reason.title}</h3>
                    <p className="text-gray-300 text-sm">{reason.description}</p>
                  </CardContent>
                </Card>
              </AdaptiveAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Contact Info */}
            <AdaptiveAnimation>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Connect</h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Whether you have questions about our products, want to explore partnerships, or want to learn more about our AI platform
                  partnership opportunities, we're here to help.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Us</h3>
                      <p className="text-gray-300">alexzomail@proton.me</p>
                    </div>
                  </div>
                </div>
              </div>
            </AdaptiveAnimation>

            {/* Right Column - Contact Form */}
            <AdaptiveAnimation delay={200}>
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                          Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-sm font-medium mb-2 block">
                        Company
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        placeholder="Your company"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                          Category *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="press">Press & Media</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-sm font-medium mb-2 block">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          placeholder="What's this about?"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-medium mb-2 block">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[120px]"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>

                    {submitStatus === "success" && (
                      <div className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                        Thank you for your message! We'll get back to you within 24 hours.
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                        There was an error sending your message. Please try again or email us directly.
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AdaptiveAnimation>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AdaptiveAnimation>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Quick Response Guaranteed</h2>
            <p className="text-gray-300">
              We typically respond to all inquiries within 24 hours. For urgent matters, please mention it in your
              subject line.
            </p>
          </AdaptiveAnimation>
        </div>
      </section>
    </div>
  )
}
