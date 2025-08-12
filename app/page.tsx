import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import { OptimizedImage } from "@/components/optimized-image"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import { Analytics } from "@/components/analytics"
import Link from "next/link"
import { ArrowRight, Brain, Zap, Shield, Sparkles, Rocket, Code, Lightbulb } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <AdaptiveAnimation>
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1">
                <Sparkles className="mr-1 h-3 w-3" />
                AI-Powered Innovation
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Welcome to the Future of{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Technology
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Discover cutting-edge AI solutions that transform how you work, create, and innovate. From intelligent
                automation to creative AI tools, we're building the future today.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <AuthModal defaultTab="signup">
                  <Button size="lg" className="px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </AuthModal>
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    Explore Products
                  </Button>
                </Link>
              </div>
            </div>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AdaptiveAnimation>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Powerful AI Solutions</h2>
              <p className="mt-4 text-lg text-gray-600">
                Experience the next generation of artificial intelligence with our comprehensive suite of tools.
              </p>
            </div>
          </AdaptiveAnimation>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <AdaptiveAnimation delay={0.1}>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Brain className="h-5 w-5 flex-none text-blue-600" />
                    Intelligent Automation
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Streamline your workflows with AI-powered automation that learns and adapts to your needs.
                    </p>
                  </dd>
                </div>
              </AdaptiveAnimation>

              <AdaptiveAnimation delay={0.2}>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Zap className="h-5 w-5 flex-none text-purple-600" />
                    Lightning Fast
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Get results in seconds, not hours. Our optimized AI models deliver unprecedented speed.
                    </p>
                  </dd>
                </div>
              </AdaptiveAnimation>

              <AdaptiveAnimation delay={0.3}>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Shield className="h-5 w-5 flex-none text-teal-600" />
                    Enterprise Security
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Your data is protected with enterprise-grade security and privacy controls.
                    </p>
                  </dd>
                </div>
              </AdaptiveAnimation>
            </dl>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AdaptiveAnimation>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our AI Products</h2>
              <p className="mt-4 text-lg text-gray-600">
                Discover our suite of AI-powered tools designed to enhance your productivity and creativity.
              </p>
            </div>
          </AdaptiveAnimation>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <AdaptiveAnimation delay={0.1}>
              <Card className="flex flex-col overflow-hidden">
                <div className="relative h-48">
                  <OptimizedImage
                    src="/images/products/alexis-ai.png"
                    alt="Alexis AI Assistant"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Alexis AI
                  </CardTitle>
                  <CardDescription>
                    Your intelligent AI assistant for complex tasks and creative projects.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600 mb-4">
                    Advanced conversational AI that understands context and provides intelligent responses.
                  </p>
                  <Link href="/products">
                    <Button variant="outline" className="w-full bg-transparent">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AdaptiveAnimation>

            <AdaptiveAnimation delay={0.2}>
              <Card className="flex flex-col overflow-hidden">
                <div className="relative h-48">
                  <OptimizedImage
                    src="/images/products/image-generator.png"
                    alt="AI Image Generator"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    Image Generator
                  </CardTitle>
                  <CardDescription>
                    Create stunning visuals with our advanced AI image generation technology.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600 mb-4">
                    Transform your ideas into beautiful images with just a text description.
                  </p>
                  <Link href="/products">
                    <Button variant="outline" className="w-full bg-transparent">
                      Try Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AdaptiveAnimation>

            <AdaptiveAnimation delay={0.3}>
              <Card className="flex flex-col overflow-hidden">
                <div className="relative h-48">
                  <OptimizedImage
                    src="/images/products/zyfoox-interface.png"
                    alt="Zyfoox Platform"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-teal-600" />
                    Zyfoox Platform
                  </CardTitle>
                  <CardDescription>
                    Comprehensive AI development platform for businesses and developers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600 mb-4">
                    Build, deploy, and scale AI applications with our powerful platform.
                  </p>
                  <Link href="/try/zyfoox">
                    <Button variant="outline" className="w-full bg-transparent">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AdaptiveAnimation>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AdaptiveAnimation>
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Trusted by innovators worldwide
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Join thousands of users who are already transforming their work with AI.
                </p>
              </div>
              <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">Users</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">50K+</dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">AI Models</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">25+</dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">Uptime</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">99.9%</dd>
                </div>
                <div className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">Countries</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">120+</dd>
                </div>
              </dl>
            </div>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <AdaptiveAnimation>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your workflow?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Join thousands of users who are already using AI to boost their productivity and creativity.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <AuthModal defaultTab="signup">
                  <Button size="lg" variant="secondary" className="px-8">
                    Start Free Trial
                    <Rocket className="ml-2 h-4 w-4" />
                  </Button>
                </AuthModal>
                <AuthModal defaultTab="login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                  >
                    Login
                  </Button>
                </AuthModal>
              </div>
            </div>
          </AdaptiveAnimation>
        </div>
      </section>
    </div>
  )
}
