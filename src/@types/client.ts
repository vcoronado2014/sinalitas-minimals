  
  export type IClientAccountGeneral = {
    id: string;
    avatarUrl: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    country: string;
    state: string;
    city: string;
    company: string;
    status: string;
    firstName: string;
    lastName: string;
    isDeleted: boolean;
    names: string;
    run: string;
    sexo: string;
    cover: string;
    observaciones: string;
  };
  
  export type IClientAccountGeneralState = {
    isLoading: boolean;
    error: Error | string | null;
    clients: IClientAccountGeneral[];
    count: number;
    client: IClientAccountGeneral | null;
    sortBy: string | null;
    filters: Filter;
    pagination: Pagination;
  
  }
  
  export type Filter = {
    name: string;
    status: string;
    city: string;
  }
  
  export type Pagination = {
    page: number;
    size: number;
    direction: "asc" | "desc";
    orderBy: string;
  }

  