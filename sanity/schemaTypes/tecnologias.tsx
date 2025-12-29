// schemas/technology.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "technology",
  title: "Tecnología",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Imagen / Icono",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
