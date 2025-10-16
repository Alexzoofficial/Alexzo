// This fixes: Type error about params needing to be a Promise.

import BlogPostPageClient from "@/components/blog-post-page-client"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <BlogPostPageClient id={id} />
}
