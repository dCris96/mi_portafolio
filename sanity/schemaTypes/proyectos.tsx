// schemas/project.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre del proyecto",
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
      name: "description",
      title: "Descripción",
      type: "text",
    }),
    defineField({
      name: "images",
      title: "Imágenes del proyecto",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texto alternativo",
              type: "string",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "technologies",
      title: "Tecnologías",
      type: "array",
      of: [{ type: "reference", to: [{ type: "technology" }] }],
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
    }),
    // CAMBIO AQUÍ: De 'reference' a 'array'
    defineField({
      name: "subcategories", // Pluralizado para mejor semántica
      title: "Subcategorías",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "subcategory" }],
        },
      ],
    }),
  ],
});
