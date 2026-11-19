import { Dispatch, createSlice } from '@reduxjs/toolkit';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterExample';
import { IUserAccountGeneral, IUserAccountGeneralState, Pagination, Filter } from 'src/@types/user';
import { getComparator } from 'src/components/table';
import axios from '../../utils/axios';
import { _userList } from '../../_mock/arrays';
import {
  comunas,
  country,
  regiones,
  role as roleUser
} from '../../_mock/assets';
import { HOST_PHOTO } from '../../config-global';


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

function setDataPost(data: IUserAccountGeneral, useAditional: boolean, isDeleted: boolean): any{
  let Activo;
  if (useAditional) {
    Activo = isDeleted ? 0 : 1;
  }
  else {
    Activo = data.status === 'inactivo' ? 0 : 1;
  }

  const newData ={
    IdProfesor: data.id,
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
    RolId: obtenerPosicionRol(data.role),
    ComIdAsignada: data.comunasAsociadas.length === 348 ? '*' : obtenerPosicionesComunas(data.comunasAsociadas),
    TipoCuenta: 0,
    Telefonos: data.phoneNumber,
  };

  return newData;
}

function setDataIUser(data: any): IUserAccountGeneral[]{
  const newUserList: IUserAccountGeneral[] = [];
  if (data){
    data.forEach((profesor: any) => {
      let rolee = 'Profesor';
      if (profesor.RolId === 1) {
        rolee = 'Super Administrador';
      } else if (profesor.RolId === 2) {
        rolee = 'Supervisor';
      } else {
        rolee = 'Profesor';
      }
      let eliminado = false;
      if (profesor.Eliminado === 1){
        eliminado = true;
      }
      const comunasProf: string[] = [];
      let comunasProfNo: string[] = [];
      if (profesor.ComIdAsignada === '*'){
        comunas.forEach(comuna => {
          if (comuna !== 'No Informado'){
            comunasProf.push(comuna);
          }
        });
      }
      else{
        // ejemplo viene 50,51 coquimbo y la serena
        const coms = profesor.ComIdAsignada.split(',');
        coms.forEach((idCom: string) => {
          
          const id = parseInt(idCom, 10) - 1;
          comunasProf.push(comunas[id]);
        });

        comunasProfNo = comunas.filter(comuna => !comunasProf.includes(comuna) && comuna !== 'No Informado');

      }
      // ******
      let photo = '';
      if (profesor.Fotografia !== ''){
        photo = `${HOST_PHOTO}${profesor.Fotografia}`;
      }
      else{
        // esto lo dejamos asi por mientras
        // photo = profesor.Sexo === 'Masculino' ? `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${2}.jpg` : `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${24}.jpg`;
        photo = `${HOST_PHOTO}no_foto.png`;
      }
      // ******
      const randomNumber = Math.floor(Math.random() * 24) + 1;
      const coverUrl = `https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_${randomNumber}.jpg`;
      const dataProf = {
        id: profesor.Id,
        // avatarUrl: profesor.Sexo === 'Masculino' ? `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${2}.jpg` : `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${24}.jpg`,
        avatarUrl: photo,
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
        role: rolee,
        firstName: profesor.PrimerApellido,
        lastName: profesor.SegundoApellido,
        isDeleted: eliminado,
        userName: profesor.NombreUsuario,
        names: profesor.Nombres,
        run: profesor.Rut,
        sexo: profesor.Sexo,
        comunasAsociadas: comunasProf,
        textoComunas: profesor.ComIdAsignada === '*' ? 'Todas' : `${comunasProf.length} Comunas`,
        comunasNoAsociadas: comunasProfNo,
        cover: coverUrl,
      }

      newUserList.push(dataProf);
    });
  }
  return newUserList;
}

const initialState: IUserAccountGeneralState = {
  isLoading: false,
  error: null,
  users: [],
  count: 0,
  user: null,
  sortBy: null,
  filters: {
    name: '',
    role: '',
    status: '',
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
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
      state.count = action.payload.length;
    },

    // GET User
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload.user;
    },

    postUserSuccess(state) {
      state.isLoading = false
    },

    putUserSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload.users;
    },

    updateUserSuccess(state) {
      state.isLoading = false
    },

    // DELETE User
    deleteUserSuccess(state) {
      state.isLoading = false;
    },

    //  SORT & FILTER Users

    filterUsers(state, action) {
      state.filters.name = action.payload.name;
      state.filters.role = action.payload.role;
      state.filters.status = action.payload.status;
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
  filterUsers,
} = slice.actions;

// ----------------------------------------------------------------------

export function getUsers(
  filter: Filter = initialState.filters,
  pagination: Pagination = initialState.pagination
) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.paginationUsers(pagination));
    dispatch(slice.actions.filterUsers(filter))
    try {
      // const response: {
      //   data: {
      //     rows: IUserAccountGeneral[],
      //     count: number
      //   }
      // } = await axios.get('/users/', {
      //   params: {
      //     filter,
      //     page: pagination.page,
      //     size: pagination.size,
      //     sort: `${pagination.orderBy},${pagination.direction}`,
      //   }
      // });
      const responsePost = await axios.post('/profesores', {Usuario: 'nico'});

      

      /*
        id: _mock.id(index),
        avatarUrl: _mock.image.avatar(index),
        name: _mock.name.fullName(index),
        email: _mock.email(index),
        phoneNumber: _mock.phoneNumber(index),
        address: '908 Jack Locks',
        country: _mock.address.country(index),
        state: 'Virginia',
        city: 'Rancho Cordova',
        zipCode: '85807',
        company: _mock.company(index),
        isVerified: _mock.boolean(index),
        status: randomInArray(['active', 'banned']),
        role: _mock.role(index),
      
      
      */

      const newUserList: IUserAccountGeneral[] = setDataIUser(responsePost.data);

      const { name, role, status } = filter
      const response = applyFilter({
        /* inputData: _userList, */
        inputData: newUserList,
        comparator: getComparator(pagination.direction, pagination.orderBy),
        filterName: name,
        filterRole: role,
        filterStatus: status
      });

      dispatch(slice.actions.getUsersSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}

export function getUser(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/users/${id}`);

      dispatch(slice.actions.getUserSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}

// // ----------------------------------------------------------------------


export function postUser(data: IUserAccountGeneral) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/users/`, data);

      dispatch(slice.actions.postUserSuccess());
      Snackbar.success(response.data.message)
      navigate.to(PATH_DASHBOARD.user.list)
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}

export function putUser(data: IUserAccountGeneral, useAditional:boolean, isDeleted:boolean, isProfile?: boolean) {

  const newData = setDataPost(data, useAditional, isDeleted);

  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const responsePost = await axios.put('/profesores', newData);
      const newUserList = setDataIUser(responsePost.data);

      // dispatch(slice.actions.putUserSuccess(response.data));
      dispatch(slice.actions.postUserSuccess());

      // dispatch(slice.actions.getUsersSuccess());

      const response = applyFilter({
        /* inputData: _userList, */
        inputData: newUserList,
        comparator: getComparator('asc', 'name'),
        filterName: '',
        filterRole: 'all',
        filterStatus: 'all'
      });

      dispatch(slice.actions.getUsersSuccess(response));

      if (isProfile){
        navigate.to(PATH_DASHBOARD.user.account);
      }
      else{
        navigate.to(PATH_DASHBOARD.user.list)
      }
      

/*       if (useAditional === false){
        navigate.to(PATH_DASHBOARD.user.list)
      } */

    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}

export function putComunasProfesor(id?:string, comunasGuardar?: string[]) {

  const nuevasComunas = comunasGuardar?.length === 348 ? ",*" : `,${obtenerPosicionesComunas(comunasGuardar || [])}`;

  const newData = {
    IdProfesor: id,
    Comunas: nuevasComunas,
  }

  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const responsePost = await axios.put('/comunas', newData);

      // dispatch(slice.actions.putUserSuccess(response.data));
      dispatch(slice.actions.postUserSuccess());

      const responseUs = await axios.post('/profesores', {Usuario: 'nico'});
      const newUserList: IUserAccountGeneral[] = setDataIUser(responseUs.data);

      const response = applyFilter({
        inputData: newUserList,
        comparator: getComparator('asc', 'name'),
        filterName: '',
        filterRole: 'all',
        filterStatus: 'all'
      });

      dispatch(slice.actions.getUsersSuccess(response));

      navigate.to(PATH_DASHBOARD.user.list)

    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}


export function updateUser(data: IUserAccountGeneral) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/users/`, data);

      dispatch(slice.actions.updateUserSuccess());
      Snackbar.success(response.data.message)
      navigate.to(PATH_DASHBOARD.user.list)
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}


export function deleteUser(userDelete: any) {
  const newData ={
    IdProfesor: userDelete.id,
    Id: userDelete.id,
    PaiId: 1,
    Rut: userDelete.run,
    Fotografia: '',
    Nombres: userDelete.names,
    PrimerApellido: userDelete.firstName,
    SegundoApellido: userDelete.lastName,
    Codigo: '',
    RegId: obtenerPosicionRegion(userDelete.state),
    ComId: obtenerPosicionComuna(userDelete.city),
    Direccion: userDelete.address,
    Sexo: userDelete.sexo,
    NombreUsuario: userDelete.run,
    Activo: 0,
    Eliminado: 0,
    TelefonosContacto: userDelete.phoneNumber,
    Correo: userDelete.email,
    RolId: obtenerPosicionRol(userDelete.role),
    ComIdAsignada: userDelete.comunasAsociadas.length === 348 ? '*' : obtenerPosicionesComunas(userDelete.comunasAsociadas),
    TipoCuenta: 0,
    Telefonos: userDelete.phoneNumber,
  };

  return async (dispatch: Dispatch, getState: any) => {
    const {
      user: {
        filters,
        pagination
      }
    } = getState();
    dispatch(slice.actions.startLoading());
    try {

      const response = await axios.put('/profesores', newData);

      setTimeout(() => {
        dispatch(slice.actions.deleteUserSuccess());
        getUsers(filters, pagination);
        // Snackbar.success(response.data.message)
        Snackbar.success('Eliminado correctamente');
      }, 300);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}
