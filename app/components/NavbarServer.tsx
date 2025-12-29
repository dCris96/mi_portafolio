import Navbar from "./Navbar";
import { client } from "@/sanity/lib/client";

type LinkItem = {
  label: string;
  href: string;
};

async function getCategories(): Promise<LinkItem[]> {
  const query = `*[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current
  }`;

  const categories: { _id: string; name: string; slug: string }[] =
    await client.fetch(query);

  return categories.map((cat) => ({
    label: cat.name,
    href: `/${cat.slug}`,
  }));
}

export default async function NavbarServer() {
  const categoryLinks = await getCategories();

  // 🔑 LINK FIJO: Inicio
  const links: LinkItem[] = [{ label: "Inicio", href: "/" }, ...categoryLinks];

  return <Navbar links={links} />;
}
