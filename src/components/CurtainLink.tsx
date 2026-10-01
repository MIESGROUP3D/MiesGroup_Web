"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { navigateWithCurtain } from "@/lib/curtain";

/** Enlace interno que navega con la cortina negra (para usar desde vistas de servidor). */
export function CurtainLink({ href, onClick, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) navigateWithCurtain(e, href, e.currentTarget);
      }}
    />
  );
}
