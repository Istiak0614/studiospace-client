"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

export function CountUp({ value, format = (n) => String(Math.round(n)) }: { value: number; format?: (n: number) => string }) {
  const current = useMotionValue(0);
  const text = useTransform(current, (v) => format(v));

  useEffect(() => {
    const controls = animate(current, value, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [current, value]);

  return <motion.span className="tabular-nums">{text}</motion.span>;
}