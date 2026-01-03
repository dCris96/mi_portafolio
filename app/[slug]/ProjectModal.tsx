"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./modal.module.css";

type ProjectImage = {
  url: string;
  alt?: string;
};

type Project = {
  _id: string;
  name: string;
  description?: string;
  images?: ProjectImage[];
};

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const images = project?.images ?? [];
  const hasMany = images.length > 1;

  // "grid" = galería patrón, "viewer" = vista completa
  const [mode, setMode] = useState<"grid" | "viewer">("grid");
  const [index, setIndex] = useState(0);

  // Reset al cambiar de proyecto / abrir modal
  useEffect(() => {
    if (!isOpen) return;
    setMode("grid");
    setIndex(0);
  }, [project?._id, isOpen]);

  // Navegación infinita
  const go = (dir: 1 | -1) => {
    const n = images.length;
    if (n === 0) return;
    setIndex((prev) => (prev + dir + n) % n);
  };

  const current = useMemo(() => images[index], [images, index]);

  const swipeThreshold = 80;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label={project ? `Modal de ${project.name}` : "Modal"}
          >
            {/* HEADER (sin absolute) */}
            <div className={styles.modalHeader}>
              {hasMany && mode === "viewer" ? (
                <button
                  type="button"
                  className={styles.modalBack}
                  onClick={() => setMode("grid")}
                  aria-label="Volver a la galería"
                >
                  ←
                </button>
              ) : (
                <span />
              )}

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
              {/* ====== CASO: MUCHAS IMÁGENES ====== */}
              {hasMany ? (
                <>
                  {/* Título + descripción ANTES de la galería */}
                  <div className={styles.textos}>
                    <h3 className={styles.modalTitle}>{project?.name}</h3>
                    {project?.description ? (
                      <p className={styles.modalParrafo}>
                        {project.description}
                      </p>
                    ) : null}
                  </div>

                  {/* GRID o VIEWER */}
                  {mode === "grid" ? (
                    <div className={styles.galleryGrid}>
                      {images.map((img, i) => (
                        <button
                          key={img.url + i}
                          type="button"
                          className={styles.tileBtn}
                          onClick={() => {
                            setIndex(i);
                            setMode("viewer");
                          }}
                          aria-label={`Abrir imagen ${i + 1}`}
                        >
                          <div className={styles.tile}>
                            <img
                              className={styles.tileImg}
                              src={img.url}
                              alt={img.alt ?? project?.name ?? "Imagen"}
                              decoding="async"
                              loading="lazy"
                              draggable={false}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.viewerWrap}>
                      <div className={styles.viewerStage}>
                        <motion.div
                          className={styles.viewerDrag}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.12}
                          onDragEnd={(_, info) => {
                            const offset = info.offset.x;
                            if (offset > swipeThreshold) go(-1);
                            else if (offset < -swipeThreshold) go(1);
                          }}
                        >
                          {/* Vista completa en el mismo modal */}
                          {current ? (
                            <img
                              className={styles.viewerImg}
                              src={current.url}
                              alt={current.alt ?? project?.name ?? "Imagen"}
                              decoding="async"
                              loading="lazy"
                              draggable={false}
                            />
                          ) : null}
                        </motion.div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ====== CASO: 0 o 1 IMAGEN (tu comportamiento actual) ====== */
                <>
                  {images[0] ? (
                    <div className={styles.singleWrap}>
                      <img
                        className={styles.singleImg}
                        src={images[0].url}
                        alt={images[0].alt ?? project?.name ?? "Imagen"}
                        decoding="async"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
