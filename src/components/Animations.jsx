import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ===== REVEAL HOOK =====
export function useReveal(t = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          o.disconnect();
        }
      },
      { threshold: t },
    );
    o.observe(el);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

// ===== REVEAL COMPONENT - wraps individual child elements =====
export function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, v] = useReveal();
  const t = {
    up: "translateY(50px)",
    down: "translateY(-40px)",
    left: "translateX(-50px)",
    right: "translateX(50px)",
    scale: "scale(0.92)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "none" : t[direction],
        filter: v ? "blur(0)" : "blur(4px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, filter 0.8s ease ${delay}s`,
        willChange: "opacity,transform,filter",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ===== STAGGER CONTAINER - wraps groups of children =====
export function StaggerContainer({
  children,
  delayChildren = 0.08,
  staggerDirection = 1,
  className = "",
  style = {},
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delayChildren,
        staggerDirection: staggerDirection,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={containerVariants}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
