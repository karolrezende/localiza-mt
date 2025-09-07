// import { useQuery } from "@tanstack/react-query";
// import { api } from "@/services/api";
// import { GetAllPeopleResponse } from "@/types/person.type";

// export interface GetAllPeopleParams {
//   name?: string;
//   minAge?: number;
//   maxAge?: number;
//   gender?: "MASCULINO" | "FEMININO";
//   status?: "DESAPARECIDO" | "LOCALIZADO";
//   page?: number;
//   perPage?: number;
// }

// export const useGetAll = (params: GetAllPeopleParams = {}) => {
//   return useQuery<GetAllPeopleResponse>({
//     queryKey: ["people", params],
//     queryFn: async () => {
//       const { data } = await api.get("/v1/pessoas/aberto/filtro", {
//         params: {
//           nome: params.name,
//           faixaIdadeInicial: params.minAge,
//           faixaIdadeFinal: params.maxAge,
//           sexo: params.gender,
//           status: params.status,
//         },
//       });

//       if (data.error) console.error(data.error);
//       return data;
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// };

"use client";

import {
  GetAllPeopleParams,
  GetAllPeopleResponse,
  Person,
  RawApiPerson,
  RawJson,
  RawOccurrence,
} from "@/types/person.type";
import { useEffect, useMemo, useState } from "react";

function deriveStatus(
  occ?: RawOccurrence | null
): "DESAPARECIDO" | "LOCALIZADO" {
  if (!occ) return "DESAPARECIDO";
  return occ.dataLocalizacao || occ.encontradoVivo
    ? "LOCALIZADO"
    : "DESAPARECIDO";
}

const DEFAULT_PAGE_SIZE = 10;

function mapApiToDomain(p: RawApiPerson): Person {
  const occ = p.ultimaOcorrencia;
  return {
    id: p.id,
    name: p.nome,
    age: p.idade ?? 0,
    isAlive: p.vivo,
    photoUrl: p.urlFoto ?? null,
    status: deriveStatus(occ),
    gender: p.sexo,
    lastOccurrence: occ
      ? {
          disappearanceDate: occ.dtDesaparecimento,
          foundDate: occ.dataLocalizacao,
          foundAlive: occ.encontradoVivo,
          locationDescription: occ.localDesaparecimentoConcat ?? null,
          occurrenceId: occ.ocoId,
          posters: (occ.listaCartaz ?? []).map((c) => ({
            url: c.url,
            type: c.type,
          })),
          interview: {
            info: occ.ocorrenciaEntrevDesapDTO?.informacao ?? null,
            clothesDescription:
              occ.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido ?? null,
          },
        }
      : null,
  };
}

function normalize(raw: RawJson): Person[] {
  const apiList = raw?.data?.content ?? [];
  return apiList.map(mapApiToDomain);
}

function applyFilters(list: Person[], params?: GetAllPeopleParams): Person[] {
  if (!params) return list;

  const name = (params.name ?? "").trim().toLowerCase();
  const gender = params.gender?.toUpperCase();
  const status = params.status?.toUpperCase() as
    | "DESAPARECIDO"
    | "LOCALIZADO"
    | undefined;
  const minAge = typeof params.minAge === "number" ? params.minAge : undefined;
  const maxAge = typeof params.maxAge === "number" ? params.maxAge : undefined;

  return list.filter((p) => {
    if (name && !p.name?.toLowerCase().includes(name)) return false;
    if (gender && String(p.gender).toUpperCase() !== gender) return false;
    if (status && p.status !== status) return false; // <- aqui
    if (minAge !== undefined && (p.age ?? 0) < minAge) return false;
    if (maxAge !== undefined && (p.age ?? 0) > maxAge) return false;
    return true;
  });
}

function paginate(
  list: Person[],
  page = 0,
  perPage = DEFAULT_PAGE_SIZE
): GetAllPeopleResponse {
  const start = page * perPage;
  const end = start + perPage;
  const content = list.slice(start, end);

  const totalElements = list.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / perPage));
  const numberOfElements = content.length;

  return {
    content,
    totalElements,
    totalPages,
    pageNumber: page,
    pageSize: perPage,
    numberOfElements,
    first: page === 0,
    last: page >= totalPages - 1,
    empty: numberOfElements === 0,
  };
}

export function useGetAll(params: GetAllPeopleParams = {}) {
  const [raw, setRaw] = useState<RawJson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const perPage = params.perPage ?? DEFAULT_PAGE_SIZE;
  const page = params.page ?? 0;

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetch("/abitus.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: RawJson) => {
        if (mounted) setRaw(json);
      })
      .catch(() => {
        if (mounted) setRaw({ data: { content: [] } });
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const data = useMemo<GetAllPeopleResponse | undefined>(() => {
    if (!raw) return undefined;
    const normalized = normalize(raw);
    const filtered = applyFilters(normalized, params);
    return paginate(filtered, page, perPage);
  }, [
    raw,
    params.name,
    params.gender,
    params.status,
    params.minAge,
    params.maxAge,
    page,
    perPage,
  ]);

  return { data, isLoading };
}

export async function getById(id: number): Promise<Person | null> {
  try {
    const res = await fetch("/abitus.json", { cache: "no-store" });
    const json: RawJson = await res.json();
    const list = normalize(json);
    return list.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}
export function useGetById(id?: number) {
  const [person, setPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);

  useEffect(() => {
    let mounted = true;

    if (id === undefined || id === null) {
      setPerson(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch("/abitus.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: RawJson) => {
        if (!mounted) return;
        const list = normalize(json);
        const found = list.find((p) => p.id === id) ?? null;
        setPerson(found);
      })
      .catch(() => {
        if (mounted) setPerson(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return {
    data: person,
    isLoading,
    notFound: !isLoading && id != null && person === null,
  };
}
