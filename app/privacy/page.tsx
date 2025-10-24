import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: "Privacy Policy | Alexzo - Protecting Your Data & Privacy Rights",
  description:
    "Read Alexzo's comprehensive privacy policy. Learn how we collect, use, protect, and manage your personal data when using Zyfoox AI Image Generator and LearnFlow. GDPR & CCPA compliant privacy practices.",
  keywords:
    "Alexzo privacy policy, data protection, GDPR compliance, CCPA compliance, user privacy rights, data collection, AI privacy, Zyfoox privacy, LearnFlow privacy, personal information protection",
  openGraph: {
    title: "Privacy Policy | Alexzo - Protecting Your Data & Privacy Rights",
    description:
      "Read Alexzo's comprehensive privacy policy. Learn how we collect, use, protect, and manage your personal data when using our AI-powered services.",
    type: "article",
    url: `${siteUrl}/privacy`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Alexzo - Protecting Your Data & Privacy Rights",
    description:
      "Read Alexzo's comprehensive privacy policy. Learn how we collect, use, protect, and manage your personal data.",
  },
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy - Alexzo",
  description: "Comprehensive privacy policy for Alexzo's AI-powered services including Zyfoox and LearnFlow",
  url: `${siteUrl}/privacy`,
  publisher: {
    "@type": "Organization",
    name: "Alexzo",
    url: siteUrl,
    logo: "/logo.png",
  },
  dateModified: "2025-01-27",
  inLanguage: "en-US",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-black text-white">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
        </div>

        <div className="relative z-10">
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

          {/* Main Content */}
          <main className="container mx-auto py-12 px-6 max-w-4xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Your privacy is fundamental to us. This comprehensive policy explains how Alexzo collects, uses,
                protects, and manages your personal information across all our AI-powered services.
              </p>
              <div className="mt-6 text-sm text-gray-400">
                <p>Last Updated: January 27, 2025</p>
                <p>Effective Date: January 1, 2025</p>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-900/50 rounded-lg p-6 mb-12 border border-gray-800">
              <h2 className="text-2xl font-semibold text-purple-300 mb-4">Table of Contents</h2>
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <a href="#information-we-collect" className="text-blue-400 hover:text-blue-300 transition-colors">
                  1. Information We Collect
                </a>
                <a href="#how-we-use-information" className="text-blue-400 hover:text-blue-300 transition-colors">
                  2. How We Use Your Information
                </a>
                <a href="#data-sharing" className="text-blue-400 hover:text-blue-300 transition-colors">
                  3. Data Sharing and Disclosure
                </a>
                <a href="#data-security" className="text-blue-400 hover:text-blue-300 transition-colors">
                  4. Data Security and Retention
                </a>
                <a href="#your-rights" className="text-blue-400 hover:text-blue-300 transition-colors">
                  5. Your Privacy Rights
                </a>
                <a href="#cookies" className="text-blue-400 hover:text-blue-300 transition-colors">
                  6. Cookies and Tracking
                </a>
                <a href="#international-transfers" className="text-blue-400 hover:text-blue-300 transition-colors">
                  7. International Data Transfers
                </a>
                <a href="#children-privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                  8. Children's Privacy
                </a>
                <a href="#third-party-services" className="text-blue-400 hover:text-blue-300 transition-colors">
                  9. Third-Party Services
                </a>
                <a href="#changes" className="text-blue-400 hover:text-blue-300 transition-colors">
                  10. Policy Changes
                </a>
                <a href="#contact" className="text-blue-400 hover:text-blue-300 transition-colors">
                  11. Contact Information
                </a>
                <a href="#legal-basis" className="text-blue-400 hover:text-blue-300 transition-colors">
                  12. Legal Basis for Processing
                </a>
              </nav>
            </div>

            {/* Privacy Policy Content */}
            <div className="space-y-12">
              {/* Introduction */}
              <section className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-4">Introduction</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Welcome to Alexzo ("we," "us," or "our"). We are committed to protecting and respecting your
                    privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                    when you use our website, mobile applications, and services, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Zyfoox:</strong> Our AI-powered image generation platform
                    </li>
                    <li>
                      <strong>LearnFlow:</strong> Our educational AI assistant application
                    </li>
                    <li>
                      <strong>Alexzo Platform:</strong> Our main website and associated services
                    </li>
                  </ul>
                  <p>
                    This policy applies to all users of our services worldwide and complies with applicable data
                    protection laws, including the General Data Protection Regulation (GDPR), California Consumer
                    Privacy Act (CCPA), and other relevant privacy legislation.
                  </p>
                </div>
              </section>

              {/* Section 1: Information We Collect */}
              <section id="information-we-collect" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">1. Information We Collect</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.1 Personal Information You Provide</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Account Information:</strong> Name, email address, username, password
                      </li>
                      <li>
                        <strong>Profile Information:</strong> Profile picture, bio, preferences
                      </li>
                      <li>
                        <strong>Communication Data:</strong> Messages, feedback, support requests
                      </li>
                      <li>
                        <strong>Payment Information:</strong> Billing address, payment method details (processed
                        securely by third-party providers)
                      </li>
                      <li>
                        <strong>Content Data:</strong> Text prompts, images uploaded, generated content
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.2 Automatically Collected Information</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Device Information:</strong> IP address, browser type, operating system, device
                        identifiers
                      </li>
                      <li>
                        <strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns
                      </li>
                      <li>
                        <strong>Technical Data:</strong> Log files, error reports, performance metrics
                      </li>
                      <li>
                        <strong>Location Data:</strong> General geographic location based on IP address
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">1.3 Third-Party Information</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Social Media:</strong> Information from social media platforms when you connect accounts
                      </li>
                      <li>
                        <strong>Analytics:</strong> Data from analytics providers about your interactions
                      </li>
                      <li>
                        <strong>AI Processing:</strong> Data processed through third-party AI services (Google Gemini
                        API, etc.)
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2: How We Use Your Information */}
              <section id="how-we-use-information" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">2. How We Use Your Information</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.1 Service Provision</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide, operate, and maintain our AI-powered services</li>
                      <li>Process your requests and generate AI responses</li>
                      <li>Manage your account and provide customer support</li>
                      <li>Process payments and manage subscriptions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.2 Service Improvement</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Analyze usage patterns to improve our services</li>
                      <li>Develop new features and functionality</li>
                      <li>Train and improve our AI models (with anonymized data)</li>
                      <li>Conduct research and development</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.3 Communication</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Send service-related notifications and updates</li>
                      <li>Respond to your inquiries and provide support</li>
                      <li>Send marketing communications (with your consent)</li>
                      <li>Notify you about changes to our services or policies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">2.4 Legal and Security</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Comply with legal obligations and regulations</li>
                      <li>Protect against fraud, abuse, and security threats</li>
                      <li>Enforce our terms of service and policies</li>
                      <li>Resolve disputes and investigate violations</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3: Data Sharing and Disclosure */}
              <section id="data-sharing" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">3. Data Sharing and Disclosure</h2>
                <div className="text-gray-300 space-y-6">
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                    <p className="font-semibold text-red-300">
                      We do not sell your personal information to third parties.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.1 Service Providers</h3>
                    <p className="mb-3">
                      We may share your information with trusted third-party service providers who assist us in:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>AI Processing:</strong> Google Gemini API for AI-powered responses
                      </li>
                      <li>
                        <strong>Cloud Services:</strong> Hosting, storage, and computing services
                      </li>
                      <li>
                        <strong>Payment Processing:</strong> Secure payment and billing services
                      </li>
                      <li>
                        <strong>Analytics:</strong> Website and application analytics
                      </li>
                      <li>
                        <strong>Customer Support:</strong> Help desk and support services
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.2 Legal Requirements</h3>
                    <p className="mb-3">We may disclose your information when required by law or to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Comply with legal processes, court orders, or government requests</li>
                      <li>Protect our rights, property, or safety</li>
                      <li>Protect the rights, property, or safety of our users</li>
                      <li>Investigate fraud, security issues, or violations of our terms</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">3.3 Business Transfers</h3>
                    <p>
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred as
                      part of the business transaction, subject to the same privacy protections.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4: Data Security and Retention */}
              <section id="data-security" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">4. Data Security and Retention</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.1 Security Measures</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Encryption:</strong> Data encrypted in transit and at rest using industry-standard
                        protocols
                      </li>
                      <li>
                        <strong>Access Controls:</strong> Strict access controls and authentication mechanisms
                      </li>
                      <li>
                        <strong>Regular Audits:</strong> Regular security audits and vulnerability assessments
                      </li>
                      <li>
                        <strong>Secure Infrastructure:</strong> Secure cloud infrastructure with enterprise-grade
                        security
                      </li>
                      <li>
                        <strong>Employee Training:</strong> Regular security training for all personnel
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.2 Data Retention</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Account Data:</strong> Retained while your account is active and for a reasonable period
                        after deletion
                      </li>
                      <li>
                        <strong>Usage Data:</strong> Typically retained for 2-3 years for analytics and improvement
                        purposes
                      </li>
                      <li>
                        <strong>Content Data:</strong> User-generated content may be retained as specified in our terms
                        of service
                      </li>
                      <li>
                        <strong>Legal Requirements:</strong> Some data may be retained longer to comply with legal
                        obligations
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">4.3 Data Deletion</h3>
                    <p>When you delete your account or request data deletion, we will:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Delete your personal information within 30 days</li>
                      <li>Anonymize or aggregate remaining data</li>
                      <li>Notify third-party processors to delete your data</li>
                      <li>Retain only what is legally required</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5: Your Privacy Rights */}
              <section id="your-rights" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">5. Your Privacy Rights</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.1 Universal Rights</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Access:</strong> Request access to your personal information
                      </li>
                      <li>
                        <strong>Correction:</strong> Request correction of inaccurate information
                      </li>
                      <li>
                        <strong>Deletion:</strong> Request deletion of your personal information
                      </li>
                      <li>
                        <strong>Portability:</strong> Request a copy of your data in a portable format
                      </li>
                      <li>
                        <strong>Opt-out:</strong> Opt-out of marketing communications
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.2 GDPR Rights (EU Residents)</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Right to Object:</strong> Object to processing based on legitimate interests
                      </li>
                      <li>
                        <strong>Right to Restrict:</strong> Restrict processing in certain circumstances
                      </li>
                      <li>
                        <strong>Right to Withdraw Consent:</strong> Withdraw consent for consent-based processing
                      </li>
                      <li>
                        <strong>Right to Lodge Complaints:</strong> File complaints with supervisory authorities
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.3 CCPA Rights (California Residents)</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Right to Know:</strong> Know what personal information is collected and how it's used
                      </li>
                      <li>
                        <strong>Right to Delete:</strong> Request deletion of personal information
                      </li>
                      <li>
                        <strong>Right to Opt-out:</strong> Opt-out of the sale of personal information
                      </li>
                      <li>
                        <strong>Right to Non-discrimination:</strong> Not be discriminated against for exercising rights
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">5.4 How to Exercise Your Rights</h3>
                    <p className="mb-3">To exercise your privacy rights, you can:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Email us at:{" "}
                        <a href="mailto:alexzomail@proton.me" className="text-blue-400 hover:text-blue-300">
                          alexzomail@proton.me
                        </a>
                      </li>
                      <li>Use our online privacy request form</li>
                      <li>Contact us through your account settings</li>
                      <li>Write to us at our mailing address (see contact section)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 6: Cookies and Tracking */}
              <section id="cookies" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">6. Cookies and Tracking Technologies</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.1 Types of Cookies We Use</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Essential Cookies:</strong> Required for basic website functionality
                      </li>
                      <li>
                        <strong>Performance Cookies:</strong> Help us understand how visitors use our site
                      </li>
                      <li>
                        <strong>Functional Cookies:</strong> Remember your preferences and settings
                      </li>
                      <li>
                        <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.2 Third-Party Tracking</h3>
                    <p className="mb-3">We use third-party services that may track your activity:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Google Analytics:</strong> Website analytics and performance tracking
                      </li>
                      <li>
                        <strong>Social Media Pixels:</strong> Track interactions with social media content
                      </li>
                      <li>
                        <strong>Advertising Networks:</strong> Deliver targeted advertisements
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">6.3 Managing Cookies</h3>
                    <p className="mb-3">You can control cookies through:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Browser settings to block or delete cookies</li>
                      <li>Our cookie consent banner</li>
                      <li>Opt-out tools provided by advertising networks</li>
                      <li>Privacy settings in your account</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7: International Data Transfers */}
              <section id="international-transfers" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">7. International Data Transfers</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Your information may be transferred to and processed in countries other than your own. We ensure
                    adequate protection through:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Adequacy Decisions:</strong> Transfers to countries with adequate data protection
                    </li>
                    <li>
                      <strong>Standard Contractual Clauses:</strong> EU-approved contractual protections
                    </li>
                    <li>
                      <strong>Binding Corporate Rules:</strong> Internal data protection standards
                    </li>
                    <li>
                      <strong>Certification Programs:</strong> Privacy Shield and similar frameworks
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 8: Children's Privacy */}
              <section id="children-privacy" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">8. Children's Privacy</h2>
                <div className="text-gray-300 space-y-4">
                  <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                    <p className="font-semibold text-yellow-300">
                      Our services are not intended for children under 13 years of age.
                    </p>
                  </div>
                  <p>
                    We do not knowingly collect personal information from children under 13. If you are a parent or
                    guardian and believe your child has provided us with personal information, please contact us
                    immediately. We will take steps to remove such information and terminate the child's account.
                  </p>
                  <p>
                    For users between 13-18 years old, we recommend parental guidance when using our AI-powered
                    services.
                  </p>
                </div>
              </section>

              {/* Section 9: Third-Party Services */}
              <section id="third-party-services" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">9. Third-Party Services</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">9.1 AI Service Providers</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Google Gemini API:</strong> Powers our AI responses and content generation
                      </li>
                      <li>
                        <strong>OpenAI Services:</strong> Additional AI capabilities and processing
                      </li>
                      <li>
                        <strong>Other AI Providers:</strong> Various specialized AI services as needed
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">9.2 Infrastructure Providers</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Vercel:</strong> Website hosting and deployment
                      </li>
                      <li>
                        <strong>Supabase:</strong> Database and authentication services
                      </li>
                      <li>
                        <strong>Cloudinary:</strong> Image and media processing
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">9.3 Analytics and Marketing</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Google Analytics:</strong> Website analytics and user behavior
                      </li>
                      <li>
                        <strong>Social Media Platforms:</strong> Social sharing and authentication
                      </li>
                      <li>
                        <strong>Email Services:</strong> Transactional and marketing emails
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 10: Policy Changes */}
              <section id="changes" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">10. Changes to This Privacy Policy</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
                    legal requirements, or other factors. When we make changes, we will:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Update the "Last Updated" date at the top of this policy</li>
                    <li>Notify you via email if you have an account with us</li>
                    <li>Post a notice on our website for significant changes</li>
                    <li>Provide additional notice as required by applicable law</li>
                  </ul>
                  <p>
                    Your continued use of our services after any changes indicates your acceptance of the updated
                    Privacy Policy.
                  </p>
                </div>
              </section>

              {/* Section 11: Contact Information */}
              <section id="contact" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">11. Contact Information</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Data Protection Officer</h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:alexzomail@proton.me" className="text-blue-400 hover:text-blue-300">
                          alexzomail@proton.me
                        </a>
                      </p>
                      <p>
                        <strong>General Contact:</strong>{" "}
                        <a href="mailto:alexzomail@proton.me" className="text-blue-400 hover:text-blue-300">
                          alexzomail@proton.me
                        </a>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Company Information</h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Company Name:</strong> Alexzo
                      </p>
                      <p>
                        <strong>Website:</strong>{" "}
                        <a href={siteUrl} className="text-blue-400 hover:text-blue-300">
                          {siteUrl}
                        </a>
                      </p>
                      <p>
                        <strong>Founded:</strong> January 1, 2025
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Response Time</h3>
                    <p>We aim to respond to all privacy-related inquiries within:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        <strong>General Inquiries:</strong> 48 hours
                      </li>
                      <li>
                        <strong>Data Subject Requests:</strong> 30 days (as required by law)
                      </li>
                      <li>
                        <strong>Urgent Security Issues:</strong> 24 hours
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 12: Legal Basis for Processing */}
              <section id="legal-basis" className="bg-gray-900/30 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-300 mb-6">12. Legal Basis for Processing (GDPR)</h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">12.1 Contractual Necessity</h3>
                    <p>Processing necessary for the performance of our contract with you, including:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Providing our AI services</li>
                      <li>Managing your account</li>
                      <li>Processing payments</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">12.2 Legitimate Interests</h3>
                    <p>Processing based on our legitimate interests, including:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Improving our services</li>
                      <li>Security and fraud prevention</li>
                      <li>Analytics and research</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">12.3 Consent</h3>
                    <p>Processing based on your explicit consent for:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Marketing communications</li>
                      <li>Optional features</li>
                      <li>Cookies and tracking</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">12.4 Legal Compliance</h3>
                    <p>Processing necessary to comply with legal obligations, including:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Tax and accounting requirements</li>
                      <li>Law enforcement requests</li>
                      <li>Regulatory compliance</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer CTA */}
            <div className="mt-16 text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-8 border border-purple-800">
              <h2 className="text-2xl font-semibold text-white mb-4">Questions About Your Privacy?</h2>
              <p className="text-gray-300 mb-6">
                We're here to help. Contact our privacy team for any questions or concerns about how we handle your
                data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="mailto:alexzomail@proton.me"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Privacy Team
                </Link>
                <Link
                  href="/contact"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  General Contact
                </Link>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="container mx-auto py-8 px-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <Image src="/logo.png" alt="Alexzo Logo" width={32} height={32} className="w-8 h-8" />
                <span className="text-lg font-semibold text-white">Alexzo</span>
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
              <p>&copy; 2025 Alexzo. All rights reserved. | Protecting your privacy since 2025.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
