export interface Entradas {
  nivel: number; // 1 a 20, escolhido na montagem, conforme o mestre
  raca: string;
  classe: string;
  atributos: Record<string, number>;
}

export interface Ficha {
  schemaVersion: number;
  contentVersion: string;
  rulesVersion: string;
  id: string;
  meta: { nome: string; criadoEm: string; atualizadoEm: string };
  entradas: Entradas;
  overrides: Record<string, unknown>;
}