export type IClientePackGeneral = {
    Cliente: IClienteGeneral,
    Comuna: IComunaGeneral,
    Condiciones: ICondicionesGeneral,
    FichaPack: IFichaPackGeneral[],
    ProductoCodigo: IProductoCodigoGeneral,
    CuposTomados: [],
    Alumnos:IAlumnos[],
}

export type IClientePackGeneralState = {
    isLoading: boolean;
    error: Error | string | null;
    clientePacks: IClientePackGeneral[];
    count: number;
    clientePack: IClientePackGeneral | null;
    sortBy: string | null;  
  }

export type IClienteGeneral = {
    Activo: number,
    Codigo: string,
    ComId: number,
    Direccion: string,
    Eliminado: number,
    Email: string,
    Fotografia: string,
    Id: number,
    NodId: number,
    NombreUsuario: string,
    Nombres: string,
    PaiId: number,
    PrimerApellido: string,
    RegId: string,
    Rut: string,
    SegundoApellido: string,
    Sexo: string,
    TelefonosContacto: string,
}
export type IComunaGeneral = {
    Id: number,
    RegId: string,
    Nombre: string,
}

export type ICondicionesGeneral = {
    Id: number,
    PcoId: number,
    Activo: number,
    EsAceptado: number,
    EsCompletado: number,
    FechaAcepta: Date,
}

export type IFichaPackGeneral = {
    Id: number,
    IdPack: number,
    Activo: number,
    Eliminado: number,
    IdAlumno: number,
    FechaCreacion: Date,
}

export type IProductoCodigoGeneral = {
    Activo: number;
    CantidadAlumnos: number;
    CantidadClases: number;
    ClieId: number,
    CodigoCliente: string;
    Eliminado: number;
    EstaPagado: number,
    Estado: number,
    FechaCreacion: Date,
    Id: number;
    PorcentajeDescuento: number,
    ProId: number;
    TotalPack: number;
}

export type IAlumnos = {
    CualesProblemasCardiacos: string,
    CualesProblemasMotores: string,
    DetalleAsma: string,
    DetalleProblemasCardiacos: string,
    DetalleProblemasMotores: string,
    DondeAcudir: string,
    Edad: number,
    Id: number,
    NombreCompleto: string,
    NumeroEmergencia: string,
    Observacion: string,
    OtraEnfermedad: string,
    Sexo: string,
    TieneAsma: number,
    TieneProblemasCardiacos: number,
    TieneProblemasMotores: number,
    TieneAsmaBool: boolean,
    TieneProblemasCardiacosBool: boolean,
    TieneProblemasMotoresBool: boolean,
}

export type IAlumnosGeneralState = {
    isLoading: boolean;
    error: Error | string | null;
    alumnosFicha: IAlumnos[];
    count: number;  
  }
