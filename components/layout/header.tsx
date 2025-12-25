"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/tools/logo-light.png"
              alt="ChartDB"
              width={120}
              height={21}
              className="dark:hidden"
              priority
            />
            <Image
              src="/tools/logo-dark.png"
              alt="ChartDB"
              width={120}
              height={21}
              className="hidden dark:block"
              priority
            />
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Free Tools
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <a
              href="https://chartdb.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Try ChartDB
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
