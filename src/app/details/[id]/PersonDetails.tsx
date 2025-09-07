"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGetById } from "@/hooks/queries/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User as UserIcon,
  MapPin,
  Calendar,
  ChevronLeft,
  Download,
  PlusCircle,
} from "lucide-react";
import { AddInfoModal } from "./AddInfoModal";

type Props = { id: number };

function colorFromId(id: number) {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-emerald-100 text-emerald-800",
    "bg-rose-100 text-rose-800",
    "bg-violet-100 text-violet-800",
    "bg-amber-100 text-amber-800",
    "bg-indigo-100 text-indigo-800",
  ];
  return colors[Math.abs(id) % colors.length];
}

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function PersonDetails({ id }: Props) {
  const { data: person, isLoading, notFound } = useGetById(id);

  const [current, setCurrent] = useState(0);
  const [errorMap, setErrorMap] = useState<Record<number, boolean>>({});
  const [addOpen, setAddOpen] = useState(false); // modal aberto

  const safeId = person?.id ?? 0;
  const safeName = person?.name ?? "";

  const fallbackClasses = useMemo(() => colorFromId(safeId), [safeId]);
  const initials = useMemo(() => initialsOf(safeName), [safeName]);

  const posters =
    (person?.lastOccurrence?.posters ?? []).map((p) => p.url).filter(Boolean) ||
    [];
  const gallery =
    ([person?.photoUrl, ...posters].filter(Boolean) as string[]) || [];

  const hasAnyImage = gallery.length > 0;
  const showMainImg = current >= 0 && hasAnyImage && !errorMap[current];
  const mainSrc = showMainImg ? gallery[current] : undefined;

  const isFound = person?.status === "LOCALIZADO";
  const statusText = isFound ? "Localizado" : "Desaparecido";

  const onImgError = (idx: number) => {
    setErrorMap((prev) => {
      const next = { ...prev, [idx]: true };
      if (idx === current) {
        const nextIdx = gallery.findIndex((_, i) => !next[i]);
        setCurrent(nextIdx >= 0 ? nextIdx : -1);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white">
        <div className="max-w-screen-2xl mx-auto w-full px-4 lg:px-8 py-6">
          <div className="mb-4">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !person) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sky-600 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">Pessoa não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="max-w-screen-2xl mx-auto w-full px-4 lg:px-8 py-6">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>

          <Button
            type="button"
            variant="secondary"
            className="inline-flex items-center gap-2 rounded-xl h-10 px-4"
            onClick={() => setAddOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Adicionar informações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="flex flex-col gap-4">
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 aspect-[4/3]">
              {mainSrc ? (
                <img
                  src={mainSrc}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => onImgError(current)}
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center select-none",
                    fallbackClasses
                  )}
                >
                  {initials ? (
                    <span className="text-6xl font-semibold opacity-90">
                      {initials}
                    </span>
                  ) : (
                    <UserIcon className="w-20 h-20 opacity-80" />
                  )}
                </div>
              )}

              <Badge
                className={cn(
                  "absolute top-3 left-3",
                  isFound
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                )}
              >
                {statusText}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              {person.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">Sexo:</span>
              <span className="text-sm font-medium">{person.gender}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-sm text-slate-500">Idade:</span>
              <span className="text-sm font-medium">{person.age}</span>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-700">
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>
                  {person.lastOccurrence?.locationDescription ??
                    "Local desconhecido"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>
                  {person.lastOccurrence?.disappearanceDate
                    ? new Date(
                        person.lastOccurrence.disappearanceDate
                      ).toLocaleString("pt-BR")
                    : "Data de desaparecimento não informada"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {person.lastOccurrence?.posters?.length ? (
                <a
                  href={
                    person.lastOccurrence.posters.find(
                      (p) => p.type === "PDF_DESAPARECIDO"
                    )?.url || person.lastOccurrence.posters[0].url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 h-10 bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Download className="h-4 w-4" />
                  Baixar cartaz
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 h-10 bg-slate-200 text-slate-500 cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  Cartaz indisponível
                </button>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-base font-semibold mb-3">Informações</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-slate-500">Situação</dt>
                  <dd className="font-medium">{statusText}</dd>
                </div>

                <div>
                  <dt className="text-slate-500">Vivo</dt>
                  <dd className="font-medium">
                    {person.isAlive ? "Sim" : "Não informado"}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Vestimentas</dt>
                  <dd className="font-medium">
                    {person.lastOccurrence?.interview?.clothesDescription ||
                      "—"}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Informações adicionais</dt>
                  <dd className="font-medium">
                    {person.lastOccurrence?.interview?.info ?? "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <AddInfoModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
