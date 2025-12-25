import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/tools/logo-light.png"
              alt="ChartDB"
              width={80}
              height={14}
              className="dark:hidden"
            />
            <Image
              src="/tools/logo-dark.png"
              alt="ChartDB"
              width={80}
              height={14}
              className="hidden dark:block"
            />
            <span className="text-sm text-muted-foreground">
              Free Tools
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="https://chartdb.io"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ChartDB
            </a>
            <a
              href="https://github.com/chartdb/chartdb"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              All Tools
            </Link>
          </nav>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          All tools run entirely in your browser. Your data never leaves your device.
        </div>
      </div>
    </footer>
  );
}
