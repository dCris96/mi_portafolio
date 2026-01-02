"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
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
  description?: string;
  images?: ProjectImage[];
  subcategories?: Subcategory[];
};

const filterRow: Variants = {
  hidden: {
    opacity: 0,
    y: -6,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
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
                decoding="async"
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
                decoding="async"
                className={styles.cardImg}
                src={imgs[0].url}
                alt={imgs[0].alt ?? project.name}
                loading="lazy"
              />
            </motion.div>
          </div>
        ) : (
          <img
            decoding="async"
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
  const images = project?.images ?? [];
  const hasMany = images.length > 1;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const swipeConfidenceThreshold = 80;

  useEffect(() => {
    setIndex(0);
    setDirection(1);
  }, [project?._id]);

  const clampIndex = (i: number) => {
    const max = images.length - 1;
    return Math.max(0, Math.min(i, max));
  };

  const goTo = (nextIndex: number) => {
    const ni = clampIndex(nextIndex);
    if (ni === index) return;
    setDirection(ni > index ? 1 : -1);
    setIndex(ni);
  };

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  // Animación direccional
  const slideVariants = {
    enter: (dir: 1 | -1) => ({
      x: dir === 1 ? 40 : -40,
      opacity: 0,
      scale: 0.99,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: 1 | -1) => ({
      x: dir === 1 ? -40 : 40,
      opacity: 0,
      scale: 0.99,
    }),
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* 👇 layout para que el modal anime el cambio de tamaño */}
          <motion.div
            className={styles.modal}
            layout
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Modal del proyecto ${project.name}`}
          >
            <div className={styles.modalHeader}>
              <button
                type="button"
                className={styles.modalClose}
                onClick={onClose}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.textos}>
                <h3 className={styles.modalTitle}>{project.name}</h3>
                {project.description ? (
                  <p className={styles.modalParrafo}>{project.description}</p>
                ) : null}
              </div>

              {images.length === 0 ? (
                <p className={styles.modalEmpty}>
                  Este proyecto no tiene imágenes.
                </p>
              ) : (
                <div className={styles.gallery}>
                  {/* 👇 layout aquí también, para suavizar cambios de altura */}
                  <motion.div
                    className={styles.mainImageWrap}
                    layout
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  >
                    {hasMany && (
                      <button
                        type="button"
                        className={`${styles.navBtn} ${styles.navLeft}`}
                        onClick={prev}
                        aria-label="Anterior"
                        disabled={index === 0}
                      >
                        ‹
                      </button>
                    )}

                    <motion.div
                      className={styles.mainImageDragArea}
                      drag={hasMany ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.12}
                      onDragEnd={(_, info) => {
                        if (!hasMany) return;
                        const offset = info.offset.x;
                        if (offset > swipeConfidenceThreshold) prev();
                        else if (offset < -swipeConfidenceThreshold) next();
                      }}
                    >
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.img
                          key={images[index].url}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className={styles.mainImg}
                          src={images[index].url}
                          alt={images[index].alt ?? project.name}
                          decoding="async"
                          loading="lazy"
                          draggable={false}
                        />
                      </AnimatePresence>
                    </motion.div>

                    {hasMany && (
                      <button
                        type="button"
                        className={`${styles.navBtn} ${styles.navRight}`}
                        onClick={next}
                        aria-label="Siguiente"
                        disabled={index === images.length - 1}
                      >
                        ›
                      </button>
                    )}
                  </motion.div>

                  {hasMany && (
                    <div
                      className={styles.thumbsRow}
                      aria-label="Carrusel de miniaturas"
                    >
                      {images.map((img, i) => (
                        <button
                          key={img.url + i}
                          type="button"
                          className={`${styles.thumbBtn} ${
                            i === index ? styles.thumbBtnActive : ""
                          }`}
                          onClick={() => goTo(i)}
                          aria-label={`Ver imagen ${i + 1}`}
                        >
                          <img
                            className={styles.thumbImg}
                            src={img.url}
                            alt={img.alt ?? project.name}
                            decoding="async"
                            loading="lazy"
                            draggable={false}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
