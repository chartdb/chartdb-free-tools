"use client";

import Image from "next/image";
import { getDbLogos } from "@/lib/db-logos";

interface DbLogoProps {
  dialect: string;
  size?: number;
  className?: string;
}

export function DbLogo({ dialect, size = 18, className = "" }: DbLogoProps) {
  const logos = getDbLogos(dialect);

  return (
    <>
      {/* Light mode logo - hidden in dark mode */}
      <Image
        src={logos.light}
        alt={dialect}
        width={size}
        height={size}
        className={`flex-shrink-0 dark:hidden ${className}`}
      />
      {/* Dark mode logo - hidden in light mode */}
      <Image
        src={logos.dark}
        alt={dialect}
        width={size}
        height={size}
        className={`flex-shrink-0 hidden dark:block ${className}`}
      />
    </>
  );
}
