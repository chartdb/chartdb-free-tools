"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SQL_DIALECTS, type SQLDialect } from "@/lib/sql-validator";
import { Database } from "lucide-react";

interface DialectSelectorProps {
  value: SQLDialect;
  onChange: (value: SQLDialect) => void;
}

export function DialectSelector({ value, onChange }: DialectSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Database className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select dialect" />
        </SelectTrigger>
        <SelectContent>
          {SQL_DIALECTS.map((dialect) => (
            <SelectItem key={dialect.value} value={dialect.value}>
              {dialect.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
