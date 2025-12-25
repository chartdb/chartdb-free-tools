"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DBML_DIALECTS, type DBMLDialect } from "@/lib/dbml-to-sql";

interface DialectSelectorProps {
  value: DBMLDialect;
  onChange: (value: DBMLDialect) => void;
}

export function DialectSelector({ value, onChange }: DialectSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DBMLDialect)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select output format" />
      </SelectTrigger>
      <SelectContent>
        {DBML_DIALECTS.map((dialect) => (
          <SelectItem key={dialect.value} value={dialect.value}>
            {dialect.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
