"use client";

import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const links = [
  { label: "Branding", href: "#" },
  { label: "Social Media", href: "#" },
  { label: "Illustration", href: "#" },
  { label: "Editorial", href: "#" },
  { label: "Web design", href: "#" },
  { label: "3D", href: "#" },
];

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    scale: 0.94,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 34,
    },
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.96,
    filter: "blur(6px)",
    transition: { duration: 0.15 },
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Cerrar con ESC (opcional pero recomendado)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Bloquear scroll cuando el menú esté abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  //CERRAR EL MENU MOVIL AL PASAR A ESCRITORIO
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Links desktop */}
        <motion.div
          className={styles.links}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              variants={{
                hidden: { opacity: 0, y: -6 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Botón fijo */}
        <motion.div
          className={styles.cta}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
        >
          <a href="#">
            <IconBrandWhatsapp stroke={2} /> Contáctame
          </a>
        </motion.div>

        {/* Burger / X (móvil) */}
        <button
          className={styles.burger}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <motion.span
            className={styles.fmLine}
            animate={open ? { y: 11, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
          <motion.span
            className={styles.fmLine}
            animate={
              open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
            }
            transition={{ duration: 0.15 }}
            style={{ top: 11 }}
          />
          <motion.span
            className={styles.fmLine}
            animate={open ? { y: -11, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{ top: 22 }}
          />
        </button>
      </nav>

      {/* Overlay (solo móvil) */}
      <AnimatePresence>
        {open && (
          <>
            {/* Panel */}
            <motion.div
              className={styles.mobileMenuFull}
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
            >
              <motion.div
                className={styles.mobileInnerCentered}
                variants={listVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                {links.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className={styles.mobileLink}
                    onClick={() => setOpen(false)}
                    variants={itemVariants}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
