"use client";

import { useTransition, useState } from "react";
import { useGetAll } from "@/hooks/queries/queries";
import { Search, SearchFilters } from "@/components/Search";
import { Pagination } from "@/components/Pagination";
import { PersonGrid } from "@/components/PersonGrid";

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(0);
  const [isPaging, startTransition] = useTransition();

  const { data, isLoading } = useGetAll({
    ...filters,
    page,
    perPage: 12,
  });

  const handleChangePage = (newPage: number) => {
    startTransition(() => setPage(newPage));
  };

  return (
    <div className="min-h-dvh text-slate-900 antialiased font-sans [font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,'Apple Color Emoji','Segoe UI Emoji'] bg-gradient-to-b from-slate-50 via-sky-50/40 to-white">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 pt-[env(safe-area-inset-top)]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 py-4 sm:py-5">
            <span className="text-xs sm:text-sm font-medium tracking-wide text-slate-500">
              Localiza MT
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-800 leading-snug">
              Pessoas desaparecidas
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-4 sm:py-6 md:py-8">
        <section className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-3 sm:p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <Search
                onSearch={(search: SearchFilters) => {
                  setFilters(search);
                  setPage(0);
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-xs sm:text-sm text-slate-700 shadow-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                {isLoading && page === 0
                  ? "Carregando…"
                  : `${data?.totalElements ?? 0} resultados`}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-4 sm:mt-6">
          <div className="border-t border-slate-200/70 pt-4 sm:pt-6">
            {!data || isLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-6"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[22px] border border-slate-200 bg-white p-3"
                  >
                    <div className="rounded-2xl overflow-hidden border border-slate-200">
                      <div className="h-40 sm:h-44 md:h-48 w-full bg-slate-200/60 animate-pulse" />
                    </div>
                    <div className="mx-auto -mt-3 mb-3 h-6 w-2/3 rounded-t-[18px] bg-slate-100 border-x border-t border-slate-200" />
                    <div className="h-5 w-24 mx-auto rounded-full bg-slate-100 border border-slate-200" />
                    <div className="mt-3 h-5 w-2/3 rounded bg-slate-100" />
                    <div className="mt-2 flex gap-2">
                      <div className="h-4 w-24 rounded bg-slate-100" />
                      <div className="h-4 w-32 rounded bg-slate-100" />
                    </div>
                    <div className="mt-3 h-14 w-full rounded-xl bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : (
              <PersonGrid people={data.content} loading={false} imageSkeleton />
            )}
          </div>
        </section>

        {data && (
          <section className="mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="rounded-full border border-white/80 bg-white/80 backdrop-blur-xl shadow-sm px-2.5 sm:px-3 py-1.5">
                <Pagination
                  currentPage={data.pageNumber}
                  totalPages={data.totalPages}
                  onChange={handleChangePage}
                />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
