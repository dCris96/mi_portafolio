import { type SchemaTypeDefinition } from "sanity";
import categoria from "./categoria";
import subcategoria from "./subcategoria";
import tecnologias from "./tecnologias";
import proyectos from "./proyectos";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoria, subcategoria, tecnologias, proyectos],
};
