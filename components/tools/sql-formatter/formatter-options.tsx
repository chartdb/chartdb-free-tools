"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  KEYWORD_CASE_OPTIONS,
  INDENT_STYLE_OPTIONS,
  type KeywordCase,
  type IndentStyle,
} from "@/lib/sql-formatter";
import { Settings2 } from "lucide-react";

interface FormatterOptionsProps {
  keywordCase: KeywordCase;
  indentStyle: IndentStyle;
  tabWidth: number;
  onKeywordCaseChange: (value: KeywordCase) => void;
  onIndentStyleChange: (value: IndentStyle) => void;
  onTabWidthChange: (value: number) => void;
}

export function FormatterOptions({
  keywordCase,
  indentStyle,
  tabWidth,
  onKeywordCaseChange,
  onIndentStyleChange,
  onTabWidthChange,
}: FormatterOptionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border border-border bg-muted/20">
      <div className="flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Options:</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Keywords:</label>
        <Select value={keywordCase} onValueChange={onKeywordCaseChange}>
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KEYWORD_CASE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Indent:</label>
        <Select value={indentStyle} onValueChange={onIndentStyleChange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INDENT_STYLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Tab Width:</label>
        <Select value={tabWidth.toString()} onValueChange={(v) => onTabWidthChange(parseInt(v))}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
