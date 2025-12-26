"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DbLogo } from "@/components/ui/db-logo";
import { DIALECTS, type ConverterDialect } from "@/lib/sql-dialect-converter";

interface DialectSelectorProps {
  value: ConverterDialect;
  onChange: (value: ConverterDialect) => void;
  label: string;
  excludeDialect?: ConverterDialect;
}

export function DialectSelector({
  value,
  onChange,
  label,
  excludeDialect,
}: DialectSelectorProps) {
  const availableDialects = excludeDialect
    ? DIALECTS.filter((d) => d.id !== excludeDialect)
    : DIALECTS;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select dialect" />
        </SelectTrigger>
        <SelectContent>
          {availableDialects.map((dialect) => (
            <SelectItem key={dialect.id} value={dialect.id}>
              <div className="flex items-center gap-2">
                <span>{dialect.name}</span>
                <DbLogo dialect={dialect.id} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
