"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
}

export function CountUp({ value, prefix = "", suffix = "", format = (n) => String(Math.round(n)) }: CountUpProps) {
  const current = useMotionValue(0);
  const text = useTransform(current, (v) => `${prefix}${format(v)}${suffix}`);

  useEffect(() => {
    const controls = animate(current, value, { duration: 1.4, ease: "easeOut" });
    return () => controls.stop();
  }, [current, value]);

  return <motion.span className="tabular-nums">{text}</motion.span>;
}