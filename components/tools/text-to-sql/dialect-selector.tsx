"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DbLogo } from "@/components/ui/db-logo";
import { TEXT_TO_SQL_DIALECTS, type TextToSQLDialect } from "@/lib/text-to-sql";
import { Database } from "lucide-react";

interface DialectSelectorProps {
  value: TextToSQLDialect;
  onChange: (value: TextToSQLDialect) => void;
}

export function DialectSelector({ value, onChange }: DialectSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Database className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select dialect" />
        </SelectTrigger>
        <SelectContent>
          {TEXT_TO_SQL_DIALECTS.map((dialect) => (
            <SelectItem key={dialect.value} value={dialect.value}>
              <div className="flex items-center gap-2">
                <span>{dialect.label}</span>
                <DbLogo dialect={dialect.value} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
