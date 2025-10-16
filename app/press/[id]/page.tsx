import { redirect } from "next/navigation"

export default async function PressArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/blog/${id}`)
}
