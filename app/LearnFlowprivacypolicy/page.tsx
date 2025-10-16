import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "LearnFlow Privacy Policy",
  description: "Privacy Policy for LearnFlow application",
  robots: "noindex, nofollow", // Prevent search engine indexing
}

export default function LearnFlowPrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
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

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">LearnFlow Privacy Policy</h1>
          <p className="text-gray-400">Last Updated: January 2025</p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none space-y-8">
          <div>
            <p className="text-lg leading-relaxed">
              Your privacy is important to us. This Privacy Policy explains how LearnFlow, powered by Alexzo, ("we,"
              "us," or "our") collects, uses, and discloses information about you when you use our application (the
              "Service").
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information to provide and improve our Service. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>User-Provided Information:</strong> Questions (text and images) you submit for AI responses;
                optional feedback.
              </li>
              <li>
                <strong>Automatically Collected Information (via Google Gemini API):</strong> Your queries are processed
                by Google's Gemini API, subject to Google's Privacy Policy. This may include technical data for API
                function and improvement. LearnFlow itself does not directly log or store your IP address or detailed
                device identifiers for long-term tracking.
              </li>
              <li>
                <strong>Usage Data (Aggregated & Anonymized):</strong> Anonymized data about Service usage (e.g.,
                question counts by subject) for analytics to improve the Service, not personally identifiable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our Service</li>
              <li>Process questions and generate AI responses via Google Gemini API</li>
              <li>Improve the Service using aggregated, anonymized usage patterns</li>
              <li>Monitor Service usage for security and stability</li>
              <li>Respond to inquiries or feedback if contact info is provided</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Sharing and Disclosure</h2>
            <p className="mb-4">LearnFlow does not sell your personal information. We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>AI Service Providers</strong> (Google Gemini API for query processing, subject to their
                policies)
              </li>
              <li>
                <strong>For Legal Reasons</strong> (if required by law or valid public authority requests)
              </li>
              <li>
                <strong>To Protect Rights</strong> (to investigate illegal activities, fraud, safety threats, or
                violations of our Terms)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Retention and Security</h2>
            <p className="leading-relaxed">
              User-provided questions/images are processed by the AI API and not persistently stored by LearnFlow beyond
              the session required for a response. We rely on Google's security for data processed via their API. We
              take reasonable measures to protect your information, but no internet transmission is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Choices and Rights</h2>
            <p className="leading-relaxed">
              You can choose not to provide certain information, which may limit Service features. Rights regarding data
              processed by Google are subject to Google's policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our Service is not for children under 13 (or higher applicable age) without parental consent. We don't
              knowingly collect personal data from children under 13. If you're a parent/guardian and aware your child
              provided Personal Data, contact us. If we learn we collected Personal Data from children without verified
              parental consent, we'll remove it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Changes to This Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy. We'll notify you by posting the new policy here and updating the "Last
              Updated" date. Review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="leading-relaxed">
              For questions about this Privacy Policy, contact us at:{" "}
              <a href="mailto:alexzomail@proton.me" className="text-blue-400 hover:text-blue-300">
                alexzomail@proton.me
              </a>
              .
            </p>
          </section>
        </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-center">
              This privacy policy is effective as of January 2025 and applies to all users of the LearnFlow application.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
