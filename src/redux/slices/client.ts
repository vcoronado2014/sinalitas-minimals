import { Dispatch, createSlice } from '@reduxjs/toolkit';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterClients';
import { IClientAccountGeneral, IClientAccountGeneralState, Pagination, Filter } from 'src/@types/client';
import { getComparator } from 'src/components/table';
import axios from '../../utils/axios';
import { _userList } from '../../_mock/arrays';
import {
  comunas,
  country,
  regiones,
  role as roleUser
} from '../../_mock/assets';


//

// ----------------------------------------------------------------------

function obtenerPosicionComuna(comuna: string): number {
  const posicion = comunas.indexOf(comuna);
  // Si la comuna no se encuentra en el arreglo, indexOf devuelve -1, por lo que sumamos 1 para obtener 0.
  // Si se encuentra, sumamos 1 para obtener la posición real más 1.
  return posicion !== -1 ? posicion + 1 : 0;
}

function obtenerPosicionesComunas(comunasSeleccionadas: string[]): string {
  const posiciones = comunasSeleccionadas
    .map((comunaSeleccionada) => {
      const posicion = comunas.indexOf(comunaSeleccionada);
      return posicion !== -1 ? posicion + 1 : 0;
    })
    .filter((posicion) => posicion > 0);

  if (posiciones.length === 1) {
    return posiciones[0].toString();
  } 
  return posiciones.join(', ');
}


function obtenerPosicionRegion(region: string): number {
  const posicion = regiones.indexOf(region);
  // Si la comuna no se encuentra en el arreglo, indexOf devuelve -1, por lo que sumamos 1 para obtener 0.
  // Si se encuentra, sumamos 1 para obtener la posición real más 1.
  return posicion !== -1 ? posicion + 1 : 0;
}

function obtenerPosicionRol(rol: string): number {
  const posicion = roleUser.indexOf(rol);
  // Si la comuna no se encuentra en el arreglo, indexOf devuelve -1, por lo que sumamos 1 para obtener 0.
  // Si se encuentra, sumamos 1 para obtener la posición real más 1.
  return posicion !== -1 ? posicion + 1 : 0;
}

function setDataPost(data: IClientAccountGeneral, useAditional: boolean, isDeleted: boolean): any{
  let Activo;
  if (useAditional) {
    Activo = isDeleted ? 0 : 1;
  }
  else {
    Activo = data.status === 'inactivo' ? 0 : 1;
  }

  const newData ={
    IdCliente: data.id,
    Id: data.id,
    PaiId: 1,
    Rut: data.run,
    Fotografia: '',
    Nombres: data.names,
    PrimerApellido: data.firstName,
    SegundoApellido: data.lastName,
    Codigo: '',
    RegId: obtenerPosicionRegion(data.state),
    ComId: obtenerPosicionComuna(data.city),
    Direccion: data.address,
    Sexo: data.sexo,
    NombreUsuario: data.run,
    Activo,
    Eliminado: 0,
    TelefonosContacto: data.phoneNumber,
    Correo: data.email,
    Telefonos: data.phoneNumber,
    Observaciones: data.observaciones,
  };

  return newData;
}

function setDataIUser(data: any): IClientAccountGeneral[]{
  const newUserList: IClientAccountGeneral[] = [];
  if (data){
    data.forEach((profesor: any) => {
      let eliminado = false;
      if (profesor.Eliminado === 1){
        eliminado = true;
      }
      const randomNumber = Math.floor(Math.random() * 24) + 1;
      const coverUrl = `https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_${randomNumber}.jpg`;
      const dataProf = {
        id: profesor.Id,
        avatarUrl: profesor.Sexo === 'Masculino' ? `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${2}.jpg` : `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${24}.jpg`,
        name: `${profesor.Nombres} ${profesor.PrimerApellido} ${profesor.SegundoApellido}`,
        email: profesor.Email,
        phoneNumber: profesor.TelefonosContacto,
        address: profesor.Direccion,
        country: country[0],
        state: regiones[profesor.RegId -1],
        city: comunas[profesor.ComId - 1],
        zipCode: '',
        company: 'SinAlitas.cl',
        isVerified: true,
        status: profesor.Activo === 1 ? 'activo' : 'inactivo',
        firstName: profesor.PrimerApellido,
        lastName: profesor.SegundoApellido,
        isDeleted: eliminado,
        userName: profesor.NombreUsuario,
        names: profesor.Nombres,
        run: profesor.Rut,
        sexo: profesor.Sexo,
        cover: coverUrl,
        observaciones: profesor.Observaciones,
      }

      newUserList.push(dataProf);
    });
  }
  return newUserList;
}

const initialState: IClientAccountGeneralState = {
  isLoading: false,
  error: null,
  clients: [],
  count: 0,
  client: null,
  sortBy: null,
  filters: {
    name: '',
    status: '',
    city: '',
  },
  pagination: {
    size: 1000,
    page: 0,
    orderBy: 'id',
    direction: 'desc'
  },
  
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET Users
    getClientsSuccess(state, action) {
      state.isLoading = false;
      state.clients = action.payload;
      state.count = action.payload.length;
    },

    // GET User
    getClientSuccess(state, action) {
      state.isLoading = false;
      state.client = action.payload.client;
    },

    postClientSuccess(state) {
      state.isLoading = false
    },

    putClientSuccess(state, action) {
      state.isLoading = false;
      state.clients = action.payload.clients;
    },

    updateClientSuccess(state) {
      state.isLoading = false
    },

    // DELETE User
    deleteClientSuccess(state) {
      state.isLoading = false;
    },

    //  SORT & FILTER Users

    filterClients(state, action) {
      state.filters.name = action.payload.name;
      state.filters.status = action.payload.status;
      state.filters.city = action.payload.city;
    },

    paginationUsers(state, action) {
      state.pagination.size = action.payload.size;
      state.pagination.page = action.payload.page;
      state.pagination.orderBy = action.payload.orderBy;
      state.pagination.direction = action.payload.direction;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  filterClients,
} = slice.actions;

// ----------------------------------------------------------------------

export function getClients(
  filter: Filter = initialState.filters,
  pagination: Pagination = initialState.pagination
) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.paginationUsers(pagination));
    dispatch(slice.actions.filterClients(filter))
    try {
      const responsePost = await axios.post('/clientes', {Usuario: 'nico'});

      const newUserList: IClientAccountGeneral[] = setDataIUser(responsePost.data);

      const { name, status, city } = filter
      const response = applyFilter({
        /* inputData: _userList, */
        inputData: newUserList,
        comparator: getComparator(pagination.direction, pagination.orderBy),
        filterName: name,
        filterCity: city,
        filterStatus: status
      });

      dispatch(slice.actions.getClientsSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}

export function getClient(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/users/${id}`);

      dispatch(slice.actions.getClientSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}



export function putClient(data: IClientAccountGeneral, useAditional:boolean, isDeleted:boolean) {

  const newData = setDataPost(data, useAditional, isDeleted);

  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const responsePost = await axios.put('/cliente', newData);
      const newUserList = setDataIUser(responsePost.data);

      // dispatch(slice.actions.putUserSuccess(response.data));
      dispatch(slice.actions.postClientSuccess());

      // dispatch(slice.actions.getUsersSuccess());

      const response = applyFilter({
        /* inputData: _userList, */
        inputData: newUserList,
        comparator: getComparator('asc', 'name'),
        filterName: '',
        filterStatus: 'all',
        filterCity: 'all',
      });

      dispatch(slice.actions.getClientsSuccess(response));

      navigate.to(PATH_DASHBOARD.client.list)


    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}

