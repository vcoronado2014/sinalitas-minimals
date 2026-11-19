export type ITareasProfesor = {
    IdPopup: number;
    Fecha: string;
    FechaTexto: string;
    TareasMostrar: ITareasMostrar[];
  }
  
  export type ITareasMostrar = {
    FechaHoraInicioTexto: string;
    FechaHoraTerminoTexto: string;
    NombreCliente: string;
    DireccionCliente: string;
    OtraDireccion: string;
    FotoCliente: string;
    FechaTexto: string;
    IdPopup: number;
    ClaseVisible: string;
    ClaseVisibleCancelar: string;
    ClaseVisibleReagendar: string;
    CodigoCliente: string;
    TelefonoCliente: string;
    PuedeCancelar: boolean;
    PuedeCerrar: boolean;
    Id: number;
    SghId: number;
    FechaHoraInicio: string;
    FechaHoraTermino: string;
    EstadoCupo: number;
    Descripcion: string;
    Eliminado: number;
    Activo: number;
    NodId: number;
    ProfId: number;
    ClieId: number;
    FechaHoraRegistro: string;
    PcoId: number;
    };
  
    export type ITareasProfesorState = {
      isLoading: boolean;
      error: Error | string | null;
      tareas: ITareasProfesor[];
      count: number;
    }