import Image from "next/image"
import { redirect } from "next/navigation"

export default function PressPage() {
  redirect("/blog")

  const pressReleases = [
    {
      id: "1",
      title: "Alexzo Raises $50M Series A to Revolutionize AI-Powered Human Enhancement",
      excerpt: "Leading venture capital firms invest in the future of cognitive enhancement technology",
      image: "/images/press/series-a-funding.png",
      date: "October 26, 2023",
      source: "TechCrunch",
      link: "https://techcrunch.com/2023/10/26/alexzo-raises-50m-series-a/",
    },
    {
      id: "2",
      title: "Alexzo Unveils New AI Chipset for Enhanced Cognitive Performance",
      excerpt: "The company's latest innovation promises to boost brainpower and accelerate learning",
      image: "/images/press/ai-chipset.png",
      date: "September 15, 2023",
      source: "Wired",
      link: "https://www.wired.com/story/alexzo-ai-chipset-cognitive-performance/",
    },
    {
      id: "3",
      title: "Alexzo Partners with Leading Universities to Advance Neuroscience Research",
      excerpt: "Collaboration aims to unlock the secrets of the human brain and develop new therapies",
      image: "/images/press/university-partnership.png",
      date: "August 1, 2023",
      source: "Nature",
      link: "https://www.nature.com/articles/alexzo-university-partnership",
    },
  ]

  return (
    <div className="container mx-auto py-12">
      <header className="text-center mb-8">
        {/* Update header logo: */}
        <div className="w-16 h-16 flex items-center justify-center mx-auto">
          <Image src="https://alexzo.vercel.app/logo.png" alt="Alexzo Logo" width={64} height={64} className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl font-bold">Press Releases</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pressReleases.map((release) => (
          <div key={release.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={release.image || "/placeholder.svg"}
              alt={release.title}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{release.title}</h2>
              <p className="text-gray-700 mb-4">{release.excerpt}</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">
                  {release.date} - {release.source}
                </p>
                <a
                  href={release.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
