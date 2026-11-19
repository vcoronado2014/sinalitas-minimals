export type IProductoCodigoGrilla = {
    Alerta: string;
    EstaPagado: boolean;
    Id: number;
    MostrarAbrir: boolean;
    Texto: string;
    TieneAgenda: boolean;
    Codigo: string;
    FechaPack: Date;
  };

  export type IProductoCodigoGrillaState = {
    isLoading: boolean;
    error: Error | string | null;
    productoCodigos: IProductoCodigoGrilla[];
    count: number;
    productoCodigo: IProductoCodigoGrilla | null;
    sortBy: string | null;
    filters: Filter;
    pagination: Pagination;
  
  }

  export type Filter = {
    Texto: string;
  }

  export type Pagination = {
    page: number;
    size: number;
    direction: "asc" | "desc";
    orderBy: string;
  }