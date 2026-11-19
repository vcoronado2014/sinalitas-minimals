export type IAgendaProfesor = {
    Fecha: string;
    FechaEntera: number;
    DiaSemana: string;
    CuposDisponibles: number;
    ClaseBorde: string;
    DiaSemanaInt: number;
    HoraInicio: string;
    HoraTermino: string;
    Estado: number;
    Comentario?: any;
    NodId: number;
    ProfId: number;
    ClieId: number;
    CpoId: number;
    ClaseBotonCrearTodos?: any;
    ClaseBotonCrearUno?: any;
    ClaseBotonEliminarTodos?: any;
    ClaseBotonEliminarUno?: any;
    DeshabilitaCrearTodo: number;
    DeshabilitaCrearUno: number;
    DeshabilitaBorrarTodo: number;
    DeshabilitaBorrarUno: number;
    ClaseDia: string;
    EsDisponible: boolean;
    EsSeleccionado: boolean;
    SghId: number;
    NombreCliente?: any;
    DireccionCliente?: any;
    TelefonosCliente?: any;
    CorreoCliente?: any;
    NombreClienteVisible: boolean;
    TelefonoClienteVisible: boolean;
    EmailClienteVisible: boolean;
    CuposAgendados: number;
    CuposConCliente: number;
    CuposNoAgendados: number;
  };

  export type IAgendaProfesorState = {
    isLoading: boolean;
    error: Error | string | null;
    agendas: IAgendaProfesor[];
    count: number;
  }