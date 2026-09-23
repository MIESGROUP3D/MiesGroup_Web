"use client";

import { MotionConfig } from "motion/react";

/** reducedMotion="user": Motion respeta prefers-reduced-motion en todo el sitio */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
