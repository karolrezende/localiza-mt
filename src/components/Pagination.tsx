"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (newPage: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage <= 0}
          onClick={() => onChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-xs text-slate-500">
          Página {currentPage + 1} de {totalPages}
        </span>

        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage + 1 >= totalPages}
          onClick={() => onChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
