"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Subcategory = {
  _id: string;
  name: string;
  slug: string;
};

type ProjectImage = {
  url: string;
  alt?: string;
};

type Project = {
  _id: string;
  name: string;
  slug: string;
  images?: ProjectImage[];
  subcategories?: Subcategory[];
};

export default function CategoryClient({
  subcategories,
  projects,
}: {
  subcategories: Subcategory[];
  projects: Project[];
}) {
  const [activeSubcatId, setActiveSubcatId] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    if (activeSubcatId === "all") return projects;

    return projects.filter((p) =>
      (p.subcategories ?? []).some((s) => s._id === activeSubcatId)
    );
  }, [activeSubcatId, projects]);

  return (
    <>
      {/* FILTROS */}
      <div className={styles.filtros}>
        <button
          className={`${styles.filterBtn} ${
            activeSubcatId === "all" ? styles.filterBtnActive : ""
          }`}
          onClick={() => setActiveSubcatId("all")}
          type="button"
        >
          All
        </button>

        {subcategories.map((s) => (
          <button
            key={s._id}
            className={`${styles.filterBtn} ${
              activeSubcatId === s._id ? styles.filterBtnActive : ""
            }`}
            onClick={() => setActiveSubcatId(s._id)}
            type="button"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className={styles.cards}>
        {filteredProjects.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
      </div>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const imgs = project.images ?? [];
  const hasStack = imgs.length >= 2;

  if (!imgs.length) {
    // si un proyecto no tiene imágenes, puedes ocultarlo o mostrar un placeholder
    return <div className={styles.card} title={project.name} />;
  }

  if (hasStack) {
    const imgA = imgs[0];
    const imgB = imgs[1];

    return (
      <div className={styles.card} title={project.name}>
        <div className={styles.stack}>
          <div className={`${styles.stackItem} ${styles.stackBack}`}>
            <img
              className={styles.cardImg}
              src={imgB.url}
              alt={imgB.alt ?? project.name}
              loading="lazy"
            />
          </div>

          <div className={`${styles.stackItem} ${styles.stackFront}`}>
            <img
              className={styles.cardImg}
              src={imgA.url}
              alt={imgA.alt ?? project.name}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  // Solo 1 imagen
  return (
    <div className={styles.card} title={project.name}>
      <img
        className={styles.cardImg}
        src={imgs[0].url}
        alt={imgs[0].alt ?? project.name}
        loading="lazy"
      />
    </div>
  );
}
