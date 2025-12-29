"use client";
import { WandSparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ThemePicker.module.css";

const themes = [
  { id: "", color: "#1a1a1c", label: "Default" },
  { id: "Wellness", color: "#e6f0e8", label: "Wellness" },
  { id: "Editorial", color: "#fdf6ec", label: "Editorial" },
  { id: "Mora", color: "#4B006E", label: "Mora" },
  { id: "Rosa", color: "#FF8AD8", label: "Rosa" },
];

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "";
    setCurrentTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const applyTheme = (id: string) => {
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("theme", id);
    setCurrentTheme(id);
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {isOpen && (
          <div className={styles.fan}>
            {themes.map((t, index) => {
              const total = themes.length;
              const angle = 180 + index * (90 / (total - 1));
              const radius = 100;

              const x = radius * Math.cos(angle * (Math.PI / 180));
              const y = radius * Math.sin(angle * (Math.PI / 180));

              return (
                <motion.button
                  key={t.id}
                  className={styles.option}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x,
                    y,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                    transition: { delay: (total - index) * 0.05 }, // Desaparecen en orden inverso
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.08, // <--- AQUÍ sucede la magia de la secuencia
                  }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => applyTheme(t.id)}
                  style={{ backgroundColor: t.color }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        className={styles.mainBtn}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 15,
        }}
        style={{
          backgroundColor: "var(--acento)",
          color: "var(--texto-boton)",
        }}
      >
        <motion.span initial={false} animate={{ rotate: isOpen ? 90 : 0 }}>
          {isOpen ? <X /> : <WandSparkles />}
        </motion.span>
      </motion.button>
    </div>
  );
}
