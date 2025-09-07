import { useMemo, useState } from "react";
import { Person } from "@/types/person.type";
import { cn } from "@/lib/utils";
import { UserIcon, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Props = { person: Person; imageSkeleton?: boolean };

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
function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function PersonCard({ person, imageSkeleton = false }: Props) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const hasImage = Boolean(person.photoUrl) && !imgError;

  const isFound = person.status === "LOCALIZADO";
  const ribbonText = isFound ? "Localizado" : "Desaparecido";
  const ribbonBg = isFound
    ? "from-emerald-400 to-emerald-600 text-white"
    : "from-yellow-300 to-amber-500 text-zinc-900";

  const fallbackClasses = useMemo(() => colorFromId(person.id), [person.id]);
  const initials = useMemo(() => getInitials(person.name), [person.name]);
  const subtitle =
    person.lastOccurrence?.locationDescription || "Local desconhecido";

  return (
    <article className="relative rounded-[22px] bg-white text-slate-900 border border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-visible">
      <Link
        href={`/details/${person.id}`}
        aria-label={`Ver detalhes de ${person.name}`}
        className="absolute inset-0 z-20 rounded-[22px] focus:outline-none focus:ring-2 focus:ring-sky-500"
      />

      <div className="pt-4" />

      <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-10">
        <div
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-full shadow-[inset_0_-1px_0_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm bg-gradient-to-b",
            ribbonBg
          )}
        >
          {ribbonText}
        </div>
      </div>

      <div className="px-3 pb-0">
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <div className="relative w-full aspect-[4/3]">
            {imageSkeleton && hasImage && !imgLoaded && (
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
            )}

            {hasImage ? (
              <img
                src={person.photoUrl!}
                alt={person.name}
                className={cn(
                  "w-full h-full object-cover transition-opacity",
                  imgLoaded ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center select-none",
                  fallbackClasses
                )}
              >
                {initials ? (
                  <span className="text-5xl font-semibold opacity-90">
                    {initials}
                  </span>
                ) : (
                  <UserIcon className="w-16 h-16 opacity-80" />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none mx-auto -mb-4 mt-2 h-7 w-[70%] rounded-t-[18px] bg-white border-x border-t border-slate-200" />
      </div>

      <div className="px-4 pb-4">
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-slate-100 border border-slate-200 text-slate-700">
            Idade: {person.age}
          </span>
        </div>

        <div className="mt-3">
          <h3 className="text-lg font-semibold leading-snug truncate">
            {person.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin className="w-4 h-4 opacity-80" />
            <span className="truncate">{subtitle}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Sexo</span>
            <span className="text-sm font-medium">{person.gender}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500">Situação</span>
            <span className="text-sm font-medium">{ribbonText}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
