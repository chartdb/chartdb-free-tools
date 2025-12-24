import { tools } from "@/lib/tools-config";
import { ToolCard } from "@/components/tools/tool-card";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Free Database Tools
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of free, privacy-focused database tools by{" "}
          <a
            href="https://chartdb.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            ChartDB
          </a>
          . All tools run entirely in your browser.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {tools.length === 1 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            More tools coming soon!
          </p>
        </div>
      )}
    </div>
  );
}
