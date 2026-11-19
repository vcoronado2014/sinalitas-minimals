import { Dispatch, createSlice } from '@reduxjs/toolkit';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterClients';
import { IProducts, IProductsState } from 'src/@types/products';
import { getComparator } from 'src/components/table';
import axios from '../../utils/axios';

import {
  comunas,
  country,
  regiones,
  role as roleUser
} from '../../_mock/assets';


//

// ----------------------------------------------------------------------

const initialState: IProductsState = {
  isLoading: false,
  error: null,
  products: [],
  product: null,
  ultimoId: 0,
};

const slice = createSlice({
  name: 'products',
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
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload.Productos;
      state.ultimoId = action.payload.UltimoId;
    },

    // GET User
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload.product;
    },

    postProductsSuccess(state) {
      state.isLoading = false
    },

    putProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload.products;
    },

    updateProductsSuccess(state) {
      state.isLoading = false
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getProductsSuccess
} = slice.actions;

// ----------------------------------------------------------------------

export function getProducts() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const responsePost = await axios.post('/productos', {Usuario: 'nico'});

      const newProductsList: IProducts[] = responsePost.data;

      dispatch(slice.actions.getProductsSuccess(responsePost.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}

export function putProductoCodigo(data: IProducts) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      data.CantidadClases = data.TopeClases.toString();
      const responsePost = await axios.put('/productoCodigo', data);
      navigate.to(PATH_DASHBOARD.client.list)
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}
