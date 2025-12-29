// app/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ title, subtitle }`,
    { slug }
  );

  if (!category) notFound();

  return (
    <main>
      <h2>{category.title}</h2>
      <h2>{category.subtitle}</h2>
    </main>
  );
}
