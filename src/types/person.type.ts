export type Gender = "MASCULINO" | "FEMININO";
export type PersonStatus = "DESAPARECIDO" | "LOCALIZADO";
export type PosterType = "PDF_DESAPARECIDO" | string;

export interface Poster {
  url: string;
  type: PosterType;
}

export interface InterviewInfo {
  info: string | null;
  clothesDescription: string | null;
}

export interface LastOccurrence {
  disappearanceDate: string;
  foundDate: string | null;
  foundAlive: boolean;
  locationDescription: string | null;
  occurrenceId: number;
  posters: Poster[];
  interview: InterviewInfo;
}
export interface Person {
  id: number;
  name: string;
  age: number;
  gender: Gender | string;
  isAlive: boolean;
  photoUrl: string | null;
  status: PersonStatus;
  lastOccurrence: LastOccurrence | null;
}

export type GetAllPeopleParams = {
  name?: string;
  gender?: Gender;
  status?: "DESAPARECIDO" | "LOCALIZADO";
  minAge?: number;
  maxAge?: number;
  page?: number;
  perPage?: number;
};

export interface GetAllPeopleResponse {
  content: Person[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
}

export type RawInterview = {
  informacao: string | null;
  vestimentasDesaparecido: string | null;
};

export type RawOccurrence = {
  dtDesaparecimento: string;
  dataLocalizacao: string | null;
  encontradoVivo: boolean;
  localDesaparecimentoConcat: string | null;
  ocoId: number;
  listaCartaz: { url: string; type: PosterType }[] | null;
  ocorrenciaEntrevDesapDTO: RawInterview | null;
};

export type RawApiPerson = {
  id: number;
  nome: string;
  idade: number;
  sexo: Gender | string;
  vivo: boolean;
  urlFoto: string | null;
  ultimaOcorrencia: RawOccurrence | null;
};

export type RawJson = {
  data?: {
    totalPages?: number;
    totalElements?: number;
    content?: RawApiPerson[];
  };
};
