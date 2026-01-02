"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const filterRow = {
  hidden: { opacity: 0, y: -6, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    filter: "blur(6px)",
    transition: { duration: 0.15 },
  },
};

export default function CategoryClient({
  subcategories,
  projects,
}: {
  subcategories: Subcategory[];
  projects: Project[];
}) {
  const [activeSubcatId, setActiveSubcatId] = useState<string>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (activeSubcatId === "all") return projects;
    return projects.filter((p) =>
      (p.subcategories ?? []).some((s) => s._id === activeSubcatId)
    );
  }, [activeSubcatId, projects]);

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      {/* FILTROS */}
      <motion.div
        className={styles.filtros}
        variants={filterRow}
        initial="hidden"
        animate="show"
      >
        <motion.button
          className={`${styles.filterBtn} ${
            activeSubcatId === "all" ? styles.filterBtnActive : ""
          }`}
          onClick={() => setActiveSubcatId("all")}
          type="button"
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          All
        </motion.button>

        {subcategories.map((s) => (
          <motion.button
            key={s._id}
            className={`${styles.filterBtn} ${
              activeSubcatId === s._id ? styles.filterBtnActive : ""
            }`}
            onClick={() => setActiveSubcatId(s._id)}
            type="button"
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {s.name}
          </motion.button>
        ))}
      </motion.div>

      {/* CARDS */}
      <motion.div
        className={styles.cards}
        variants={gridVariants}
        initial="hidden"
        animate="show"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              onOpen={() => setSelected(p)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* MODAL */}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const imgs = project.images ?? [];
  const hasStack = imgs.length >= 2;

  return (
    <motion.button
      type="button"
      className={styles.cardBtn}
      onClick={onOpen}
      aria-label={`Abrir proyecto ${project.name}`}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      <div className={styles.card} title={project.name}>
        {!imgs.length ? null : hasStack ? (
          <div className={styles.stack}>
            <motion.div
              className={`${styles.stackItem} ${styles.stackBack}`}
              whileHover={{ rotate: -2.2, x: -4, y: 3 }}
              transition={{ type: "spring", stiffness: 250, damping: 22 }}
            >
              <img
                className={styles.cardImg}
                src={imgs[1].url}
                alt={imgs[1].alt ?? project.name}
                loading="lazy"
              />
            </motion.div>

            <motion.div
              className={`${styles.stackItem} ${styles.stackFront}`}
              transition={{ type: "spring", stiffness: 250, damping: 22 }}
            >
              <img
                className={styles.cardImg}
                src={imgs[0].url}
                alt={imgs[0].alt ?? project.name}
                loading="lazy"
              />
            </motion.div>
          </div>
        ) : (
          <img
            className={styles.cardImg}
            src={imgs[0].url}
            alt={imgs[0].alt ?? project.name}
            loading="lazy"
          />
        )}
      </div>
    </motion.button>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            // Cierra si clickeas el overlay (no el contenido)
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Modal del proyecto ${project.name}`}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{project.name}</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={onClose}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Contenido mínimo: galería simple */}
            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                {(project.images ?? []).map((img, i) => (
                  <div key={img.url + i} className={styles.modalImgWrap}>
                    <img
                      className={styles.modalImg}
                      src={img.url}
                      alt={img.alt ?? project.name}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              {/* Si no hay imágenes */}
              {(!project.images || project.images.length === 0) && (
                <p className={styles.modalEmpty}>
                  Este proyecto no tiene imágenes.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
