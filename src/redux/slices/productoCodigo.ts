import { Dispatch, createSlice } from '@reduxjs/toolkit';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterProdCod';
import { IProductoCodigoGrilla, IProductoCodigoGrillaState, Pagination, Filter } from 'src/@types/productoCodigoGrilla';
import { getComparator } from 'src/components/table';
import { paramCase } from 'change-case';
import axios from '../../utils/axios';
import { _userList } from '../../_mock/arrays';



const initialState: IProductoCodigoGrillaState = {
    isLoading: false,
    error: null,
    productoCodigos: [],
    count: 0,
    productoCodigo: null,
    sortBy: null,
    filters: {
      Texto: '',
    },
    pagination: {
      size: 1000,
      page: 0,
      orderBy: 'id',
      direction: 'asc'
    },
  };

  const slice = createSlice({
    name: 'productoCodigos',
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
      getProductoCodigosSuccess(state, action) {
        state.isLoading = false;
        state.productoCodigos = action.payload;
        state.count = action.payload.length;
      },
  
      //  SORT & FILTER Users

      filterGrila(state, action) {
        state.filters.Texto = action.payload.Texto;
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
  filterGrila,
} = slice.actions;

// export const {} = slice.actions;

// const navigateNew = useNavigate();

export function getProductoCodigos(
  filter: Filter = initialState.filters,
  pagination: Pagination = initialState.pagination,
  Codigo?: string,
  Estado: string = "0",
  ProfId?: string,

) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.paginationUsers(pagination));
    dispatch(slice.actions.filterGrila(filter))

    try {
      const responsePost = await axios.post('/ObtenerProductoCodigoGrilla', { Estado, Codigo, ProfId });

      const { Texto } = filter

      const response = applyFilter({
        inputData: responsePost.data,
        comparator: getComparator(pagination.direction, pagination.orderBy),
        filterTexto: Texto,
      });

      dispatch(slice.actions.getProductoCodigosSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}

export function putPack(data: any, row: any) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const responsePost = await axios.put('/GuardarCupos', data);

    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}