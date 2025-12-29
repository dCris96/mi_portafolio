"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./WaterDragImages.module.css";

type Item = { src: string; alt: string; rotate: number; z: number };

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export default function WaterDragImages() {
  type Item = {
    src: string;
    alt: string;
    rotate: number;
    z: number;
    offsetY: number;
  };

  const items: Item[] = [
    { src: "/foto1.jpg", alt: "Imagen 1", rotate: 5, z: 1, offsetY: 8 },
    { src: "/foto2.jpg", alt: "Imagen 2", rotate: -4, z: 2, offsetY: -20 },
    { src: "/foto3.jpg", alt: "Imagen 3", rotate: 4, z: 3, offsetY: 3 },
    { src: "/foto4.png", alt: "Imagen 4", rotate: -2, z: 4, offsetY: -8 },
  ];

  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Motion values por tarjeta (offset “fluido”)
  const baseX = items.map(() => useMotionValue(0));
  const baseY = items.map(() => useMotionValue(0));

  // Rotaciones “agua” por tarjeta
  const baseRz = items.map(() => useMotionValue(0)); // izquierda/derecha (Z)
  const baseRx = items.map(() => useMotionValue(0)); // arriba/abajo (X)  (tilt)
  const baseRy = items.map(() => useMotionValue(0)); // izquierda/derecha (Y) (tilt)

  // Springs para rotación (suaves)
  const rzSprings = baseRz.map((mv) =>
    useSpring(mv, { stiffness: 240, damping: 22, mass: 0.7 })
  );
  const rxSprings = baseRx.map((mv) =>
    useSpring(mv, { stiffness: 240, damping: 22, mass: 0.7 })
  );
  const rySprings = baseRy.map((mv) =>
    useSpring(mv, { stiffness: 240, damping: 22, mass: 0.7 })
  );

  // Springs para suavizar
  const xSprings = baseX.map((mv) =>
    useSpring(mv, { stiffness: 260, damping: 22, mass: 0.7 })
  );
  const ySprings = baseY.map((mv) =>
    useSpring(mv, { stiffness: 260, damping: 22, mass: 0.7 })
  );

  const yWithOffset = ySprings.map((mv, i) =>
    useTransform(mv, (v) => v + items[i].offsetY)
  );

  // Parámetros del “agua”
  const SIGMA_X = 260; // alcance lateral
  const SIGMA_Y = 160; // alcance vertical (más pequeño = vertical más local y notorio)
  const STRENGTH_X = 1.2;
  const STRENGTH_Y = 2.2; // vertical más fuerte
  const MAX_OFFSET = 90;
  const DECAY = 0.88;
  const ACTIVE_BOOST = 1.9; // cuánto más se mueve la imagen “bajo el mouse”
  const OTHERS_SCALE = 0.35; // cuánto se reduce el movimiento de las otras
  const ROT_Z_STRENGTH = 0.22; // rotación plana (deg) por velocidad del mouse
  const ROT_XY_STRENGTH = 0.18; // tilt 3D (deg) por velocidad del mouse

  const MAX_ROT_Z = 8; // grados
  const MAX_ROT_X = 7; // grados
  const MAX_ROT_Y = 7; // grados

  const last = React.useRef<{ x: number; y: number; has: boolean }>({
    x: 0,
    y: 0,
    has: false,
  });
  const hovering = React.useRef(false);
  const rafId = React.useRef<number | null>(null);

  // Decay continuo (inercia/rezago tipo fluido)
  const startDecay = React.useCallback(() => {
    if (rafId.current != null) return;

    const tick = () => {
      // si no está hover, igual dejamos que termine de volver a 0
      let anyMoving = false;

      for (let i = 0; i < items.length; i++) {
        const nx = baseX[i].get() * DECAY;
        const ny = baseY[i].get() * DECAY;

        baseX[i].set(Math.abs(nx) < 0.05 ? 0 : nx);
        baseY[i].set(Math.abs(ny) < 0.05 ? 0 : ny);

        const nrz = baseRz[i].get() * DECAY;
        const nrx = baseRx[i].get() * DECAY;
        const nry = baseRy[i].get() * DECAY;

        baseRz[i].set(Math.abs(nrz) < 0.02 ? 0 : nrz);
        baseRx[i].set(Math.abs(nrx) < 0.02 ? 0 : nrx);
        baseRy[i].set(Math.abs(nry) < 0.02 ? 0 : nry);

        if (nx !== 0 || ny !== 0 || nrz !== 0 || nrx !== 0 || nry !== 0)
          anyMoving = true;
      }

      if (!hovering.current && !anyMoving) {
        rafId.current = null;
        return;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
  }, [DECAY, baseX, baseY, items.length]);

  React.useEffect(() => {
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const onPointerEnter = () => {
    hovering.current = true;
    startDecay();
  };

  const onPointerLeave = () => {
    hovering.current = false;
    last.current.has = false;
    startDecay(); // que termine de “asentarse”
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!wrapRef.current) return;

    // velocidad del mouse (dirección del movimiento)
    if (!last.current.has) {
      last.current = { x: e.clientX, y: e.clientY, has: true };
      return;
    }

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current.x = e.clientX;
    last.current.y = e.clientY;

    // si el mouse se mueve muy poquito, no metas ruido
    if (Math.abs(dx) + Math.abs(dy) < 0.5) return;

    // 1) primero: encontrar cuál card está más cerca (activa)
    let activeIndex = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < items.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (d < bestDist) {
        bestDist = d;
        activeIndex = i;
      }
    }

    // 2) ahora: aplicar movimiento, pero con prioridad al activeIndex
    for (let i = 0; i < items.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const dxp = e.clientX - cx;
      const dyp = e.clientY - cy;

      // influencia tipo agua (gaussiana 2D)
      const influence = Math.exp(
        -(
          (dxp * dxp) / (2 * SIGMA_X * SIGMA_X) +
          (dyp * dyp) / (2 * SIGMA_Y * SIGMA_Y)
        )
      );

      // prioridad: activa vs demás
      const priority = i === activeIndex ? ACTIVE_BOOST : OTHERS_SCALE;

      const pushX = dx * STRENGTH_X * influence * priority;
      const pushY = dy * STRENGTH_Y * influence * priority;

      const tx = clamp(baseX[i].get() + pushX, -MAX_OFFSET, MAX_OFFSET);
      const ty = clamp(baseY[i].get() + pushY, -MAX_OFFSET, MAX_OFFSET);

      baseX[i].set(tx);
      baseY[i].set(ty);

      // Rotación Z (izq/der) según dx, y vuelve con decay
      const rotZPush = dx * ROT_Z_STRENGTH * influence * priority;

      // Tilt: arriba/abajo (dy) -> rotateX, izq/der (dx) -> rotateY
      // Signos: ajustables según cómo se sienta en tu UI
      const rotXPush = -dy * ROT_XY_STRENGTH * influence * priority;
      const rotYPush = dx * ROT_XY_STRENGTH * influence * priority;

      const rz = clamp(baseRz[i].get() + rotZPush, -MAX_ROT_Z, MAX_ROT_Z);
      const rx = clamp(baseRx[i].get() + rotXPush, -MAX_ROT_X, MAX_ROT_X);
      const ry = clamp(baseRy[i].get() + rotYPush, -MAX_ROT_Y, MAX_ROT_Y);

      baseRz[i].set(rz);
      baseRx[i].set(rx);
      baseRy[i].set(ry);
    }

    startDecay();
  };

  return (
    <div className={styles.wrap}>
      <div
        ref={wrapRef}
        className={styles.box}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
      >
        <div className={styles.row}>
          {items.map((it, i) => (
            <motion.div
              key={it.src}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              className={`${styles.card} ${i !== 0 ? styles.overlap : ""}`}
              style={{
                x: xSprings[i],
                y: yWithOffset[i],
                rotate: it.rotate, // tu rotación base fija
                rotateZ: rzSprings[i], // extra por “agua” izq/der
                rotateX: rxSprings[i], // tilt por arriba/abajo
                rotateY: rySprings[i], // tilt por izq/der
                zIndex: it.z,
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
            >
              <Image
                src={it.src}
                alt={it.alt}
                fill
                sizes="190px"
                className={styles.image}
                draggable={false}
              />
              <div className={styles.glow} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
