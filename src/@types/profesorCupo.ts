export type IProfesorCupoGeneral = {
    CantidadVotos: number,
    Comunas: string,
    CuposMostrar: [],
    CuposProfesor: ICuposProfesor[],
    DeshabilitarControlFecha: boolean,
    EstrellasProfesor: number,
    IdControl: string,
    PrimerCupo: Date,
    ProximosDias: string,
    Semanas: string,
    SemanasArr: [],
    Profesor: IProfesor,
}

export type IProfesorCupoGeneralState = {
    isLoading: boolean;
    error: Error | string | null;
    profesorCupos: IProfesorCupoGeneral[];
    count: number;
    profesorCupo: IProfesorCupoGeneral | null;
    sortBy: string | null;  
  }

  export type IProfesor = {
    Activo: number,
    Banco: string,
    Codigo: string,
    ComId: number,
    ComIdAsignada: string,
    Direccion: string,
    Eliminado: number,
    Email: string,
    FechaNacimiento: Date,
    Fotografia: string,
    Id: number,
    NodId: number,
    NombreUsuario: string,
    Nombres: string,
    NumeroCuenta: string,
    PaiId: number,
    PrimerApellido: string,
    RegId: string,
    RolId: number,
    Rut: string,
    SegundoApellido: string,
    Sexo: string,
    TelefonosContacto: string, 
    TipoCuenta: number, 
  }
  export type ICuposProfesor ={
    Activo: number,
    ClieId: number,
    Descripcion:string,
    Eliminado:number,
    EstadoCupo: number,
    FechaHoraInicio:Date,
    FechaHoraRegistro:Date,
    FechaHoraTermino:Date,
    Id:number,
    NodId: number,
    PcoId: number,
    ProfId:number,
    SghId: number,
    Disabled: boolean,
  }

