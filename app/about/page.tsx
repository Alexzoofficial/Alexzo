import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const teamMembers = [
  {
    name: "Sar",
    role: "CEO & Founder",
    bio: "Visionary leader and founder of Alexzo, pioneering the future of AI-powered human enhancement technology.",
  },
]

export default function AboutPage() {
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

      <div className="relative z-10 container mx-auto py-10 px-6">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">About Alexzo</h1>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Our mission is to enhance human potential through revolutionary AI technology.
          </p>
        </section>

        <section className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6">Our Story</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Founded on January 1st, 2025, Alexzo was born from a vision to merge the power of artificial intelligence
            with the innate capabilities of the human mind. We believe that AI should be a tool for empowerment, not
            replacement. Our journey began with a passionate commitment to create technology that truly enhances human
            lives, democratizing access to advanced AI capabilities through intuitive and powerful platforms like ISI.
          </p>
        </section>

        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6">Leadership</h2>
          <div className="grid grid-cols-1 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-purple-400 mb-4 text-lg">{member.role}</p>
                  <p className="text-gray-300 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
