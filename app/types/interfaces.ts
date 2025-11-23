/* app/types/interfaces.ts */
export interface MetricsCardResponse {
  titulo_metrica: string;
  valor_metrica: string;
  top_limit: number | string;
  bottom_limit: number | string;
  relation: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number[];
  abscissa: string[];
}

export interface TicketsByCategory {
  itens: Category[];
}

export interface CriticalProjectRow {
  product_id: number;
  product_name: string;
  open_tickets: number;
}

export interface CriticalProjectsResponse {
  id: string;
  generated_at: string;
  limit: number;
  open_status_ids: number[];
  rows: CriticalProjectRow[]; // Onde a lista de projetos reside
}

export interface GaugeResponse {
  datasets: {
    data: number[];
    label: string;
  }[];
}

export enum TermsType {
  REQUIRED = "required",
  OPTIONAL = "optional",
}
export interface TermsResponse {
  id: number;
  version: string;
  content: string;
  type: TermsType;
  created_at: Date;
}
