export type IProducts = {
    Id: string;
    Nombre: string;
    Descripcion: string;
    Precio: number;
    CantidadAlumnos: number;
    Eliminado: number;
    Activo: number;
    TopeClases: number;
    ValorClase: number;
    Descuento: string;
    TotalPack: string;
    CodigoCliente: string;
    IdCliente: string;
    ProId: string;
    CantidadClases: string;
    ClieId: string;
    PorcentajeDescuento: string;
  };

  export type IProductsFilter = {
    Nombre: string;
    sortBy: string;
  };

  export type IProductsState = {
    isLoading: boolean;
    error: Error | string | null;
    products: IProducts[];
    product: IProducts | null;
    ultimoId: number;
  };

  export type IFormPack = {
    CantidadAlumnos: number,
    Pack: string,
    Segmento: string,
  }