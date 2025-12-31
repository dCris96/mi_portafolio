import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
    title,
    subtitle,

    // subcategorías (desde el array de referencias en category)
    "subcategories": subcategories[]->{
      _id,
      name,
      "slug": slug.current
    },

    // proyectos que pertenecen a esta categoría
    "projects": *[_type == "project" && category._ref == ^._id] | order(_createdAt desc){
      _id,
      name,
      "slug": slug.current,

      // imágenes con url directa (para mostrar en <img /> sin builder)
      images[]{
        alt,
        "url": asset->url
      },

      // subcategorías del proyecto (para el filtro luego)
      "subcategories": subcategories[]->{
        _id,
        name,
        "slug": slug.current
      }
    }
  }`,
    { slug }
  );

  if (!data) notFound();

  return (
    <section className={styles.main}>
      <div className={styles.encabezado}>
        <h2 className={styles.titulo}>{data.title}</h2>
        <h2 className={styles.subtitulo}>{data.subtitle}</h2>
      </div>
      <CategoryClient
        subcategories={data.subcategories ?? []}
        projects={data.projects ?? []}
      />
    </section>
  );
}
