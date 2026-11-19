export type IAceptaCondiciones = {
    Id: number;
    PcoId: number;
    FechaAcepta: Date;
    EsAceptado: number;
    EsCompletado: number;
    Activo: number;
  };

  export type IAceptaCondicionesState = {
    isLoading: boolean;
    error: Error | string | null;
    aceptaCondiciones: IAceptaCondiciones | null;
  }