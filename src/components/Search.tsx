"use client";

import { useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

export interface SearchFilters {
  name?: string;
  minAge?: number;
  maxAge?: number;
  gender?: "MASCULINO" | "FEMININO";
  status?: "DESAPARECIDO" | "LOCALIZADO";
}

export interface SearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

function parseIntSafe(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function Search({ onSearch, className }: SearchProps) {
  const [name, setName] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [gender, setGender] = useState<"" | "MASCULINO" | "FEMININO">("");
  const [status, setStatus] = useState<"" | "DESAPARECIDO" | "LOCALIZADO">("");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const filters = useMemo<SearchFilters>(() => {
    const _min = parseIntSafe(minAge);
    const _max = parseIntSafe(maxAge);
    const [minFixed, maxFixed] =
      _min !== undefined && _max !== undefined && _min > _max
        ? [_max, _min]
        : [_min, _max];

    return {
      name: name.trim() || undefined,
      minAge: minFixed,
      maxAge: maxFixed,
      gender: gender || undefined,
      status: status || undefined,
    };
  }, [name, minAge, maxAge, gender, status]);

  const activeCount = useMemo(
    () =>
      Object.values(filters).filter((v) => v !== undefined && v !== "").length,
    [filters]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      onSearch(filters);
    },
    [onSearch, filters]
  );

  const handleReset = useCallback(() => {
    setName("");
    setMinAge("");
    setMaxAge("");
    setGender("");
    setStatus("");
    onSearch({});
  }, [onSearch]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-sm p-3 sm:p-4 md:p-5",
        className
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-0">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            aria-label="Pesquisar por nome"
            placeholder="Pesquisar por nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="gap-2 w-full sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-900/10 px-1.5 text-xs">
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition",
                advancedOpen ? "rotate-180" : ""
              )}
            />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="gap-2 w-full sm:w-auto"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>

          <Button type="submit" className="gap-2 w-full sm:w-auto">
            <SearchIcon className="h-4 w-4" />
            Buscar
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3 sm:mt-4",
          advancedOpen ? "opacity-100 max-h-[400px]" : "opacity-0 max-h-0",
          "transition-all duration-300 overflow-hidden"
        )}
      >
        <Input
          aria-label="Idade mínima"
          placeholder="Idade mínima"
          inputMode="numeric"
          type="number"
          min={0}
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
        />

        <Input
          aria-label="Idade máxima"
          placeholder="Idade máxima"
          inputMode="numeric"
          type="number"
          min={0}
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
        />

        <Select
          value={gender}
          onValueChange={(v: "MASCULINO" | "FEMININO") => setGender(v)}
        >
          <SelectTrigger aria-label="Sexo" className="w-full">
            <SelectValue placeholder="Sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MASCULINO">Masculino</SelectItem>
            <SelectItem value="FEMININO">Feminino</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(v: "DESAPARECIDO" | "LOCALIZADO") => setStatus(v)}
        >
          <SelectTrigger aria-label="Status" className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESAPARECIDO">Desaparecido</SelectItem>
            <SelectItem value="LOCALIZADO">Localizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p
        className={cn(
          "text-xs text-slate-500 mt-2",
          !advancedOpen && activeCount === 0 ? "block" : "hidden"
        )}
      >
        Dica: abra “Filtros” para refinar por idade, sexo e status.
      </p>
    </form>
  );
}
