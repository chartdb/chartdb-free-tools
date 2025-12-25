"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MINIFIER_DIALECTS, type MinifierDialect } from "@/lib/sql-minifier";

interface DialectSelectorProps {
  value: MinifierDialect;
  onChange: (value: MinifierDialect) => void;
}

export function DialectSelector({ value, onChange }: DialectSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select dialect" />
      </SelectTrigger>
      <SelectContent>
        {MINIFIER_DIALECTS.map((dialect) => (
          <SelectItem key={dialect.value} value={dialect.value}>
            {dialect.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
