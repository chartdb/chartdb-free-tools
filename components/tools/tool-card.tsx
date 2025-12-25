import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools-config";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link href={`/${tool.slug}`} className="group block">
      <Card className="h-full transition-all duration-200 hover:border-teal-500/50 hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-teal-500/10 p-2.5 text-teal-600">
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Free
            </Badge>
          </div>
          <CardTitle className="mt-4 flex items-center gap-2 text-lg">
            {tool.name}
            <ArrowRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
          </CardTitle>
          <CardDescription className="text-sm">
            {tool.shortDescription}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
