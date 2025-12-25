"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPARE_DIALECTS, type CompareDialect } from "@/lib/sql-compare";

interface DialectSelectorProps {
  value: CompareDialect;
  onChange: (value: CompareDialect) => void;
}

export function DialectSelector({ value, onChange }: DialectSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select dialect" />
      </SelectTrigger>
      <SelectContent>
        {COMPARE_DIALECTS.map((dialect) => (
          <SelectItem key={dialect.value} value={dialect.value}>
            {dialect.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
