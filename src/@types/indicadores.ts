export type IIndicadoresGeneralState = {
    isLoading: boolean;
    error: Error | string | null;
    ContadorProfesores: IContador | null;
    ContadorClientes: IContador | null;
    ContadorAgendados: IContador | null;
    GraficoPack: IGraficoPack | null;
  }

  export type IContador = {
    Id: number;
    Title: string;
    SubTitle: string;
    ContadorSeries: number;
    Series: ISeries[];
    RolId: number;
    Total: number;
  }

  export type ISeries = {
    Label: string;
    Value: number;
  }

  export type IGraficoPack = {
    Id: number;
    Title: string;
    SubTitle: string;
    ContadorSeries: number;
    Categorias: ICategorias[];
    Series: ISeriesPack[];
    RolId: number;
  }
  export type ICategorias ={
    Nombre: string;
    NombreCorto: string;
    NumeroMes: number;
  }

  export type ISeriesPack ={
    Nombre: string;
    Datos: number[];
  }


