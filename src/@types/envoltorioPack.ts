export type IEnvoltorioPackGeneral = {
    AceptaCondiciones: any,
    Cliente: any,
    ComunaCliente: any,
    Cupos: any[],
    FichaAlumnos: any[],
    Producto: any,
    ProductoCodigo:any,
    Profesor: any,
    RegionCliente: any,
    TieneAceptaCondiciones: boolean,
}

export type IEnvoltorioPackGeneralState = {
    isLoading: boolean;
    error: Error | string | null;
    pack: IEnvoltorioPackGeneral | null;
    count: number;
    sortBy: string | null;
}