"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./modal.module.css";

// Variantes para el efecto de slide entre imágenes
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
};

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  const images = project?.images ?? [];
  const hasMany = images.length > 1;

  const [mode, setMode] = useState<"grid" | "viewer">("grid");
  const [[page, direction], setPage] = useState([0, 0]);

  const index = useMemo(() => {
    const n = images.length;
    if (n === 0) return 0;
    return ((page % n) + n) % n;
  }, [page, images.length]);

  useEffect(() => {
    if (!isOpen) return;
    setMode("grid");
    setPage([0, 0]);
  }, [project?._id, isOpen]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const swipeThreshold = 50;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div className={styles.modalHeader}>
              {hasMany && mode === "viewer" ? (
                <button
                  type="button"
                  className={styles.modalBack}
                  onClick={() => setMode("grid")}
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
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {hasMany ? (
                <AnimatePresence mode="wait">
                  {mode === "grid" ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={styles.gridContainer} // Contenedor para agrupar textos y grid
                    >
                      {/* TEXTOS: Solo visibles en modo grid y si hay muchas imágenes */}
                      <div className={styles.textos}>
                        <h3 className={styles.modalTitle}>{project?.name}</h3>
                        {project?.description && (
                          <p className={styles.modalParrafo}>
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className={styles.galleryGrid}>
                        {images.map((img: any, i: number) => (
                          <button
                            key={i}
                            className={styles.tileBtn}
                            onClick={() => {
                              setPage([i, 0]);
                              setMode("viewer");
                            }}
                          >
                            <div className={styles.tile}>
                              <img
                                className={styles.tileImg}
                                src={img.url}
                                alt=""
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div
                      className={styles.viewerWrap}
                      style={{ overflow: "hidden", position: "relative" }}
                    >
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key={page}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                          }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={1}
                          onDragEnd={(e, { offset }) => {
                            const swipe = offset.x;
                            if (swipe < -swipeThreshold) {
                              paginate(1);
                            } else if (swipe > swipeThreshold) {
                              paginate(-1);
                            }
                          }}
                          className={styles.viewerDrag}
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <img
                            className={styles.viewerImg}
                            src={images[index].url}
                            alt=""
                            draggable={false}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </AnimatePresence>
              ) : (
                <div className={styles.singleWrap}>
                  {images[0] && (
                    <img
                      className={styles.singleImg}
                      src={images[0].url}
                      alt=""
                    />
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
