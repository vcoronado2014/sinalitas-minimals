import { Dispatch, createSlice } from '@reduxjs/toolkit';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterProdCod';
import { IIndicadoresGeneralState } from 'src/@types/indicadores';
import { getComparator } from 'src/components/table';
import axios from '../../utils/axios';
import { _userList } from '../../_mock/arrays';


const initialState: IIndicadoresGeneralState = {
    isLoading: false,
    error: null,
    ContadorClientes: null,
    ContadorProfesores: null,
    ContadorAgendados: null,
    GraficoPack: null,
};

const slice = createSlice({
    name: 'indicadores',
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
        getIndicadoresSuccess(state, action) {
            state.isLoading = false;
            state.ContadorProfesores = action.payload.data.ContadorProfesores;
            state.ContadorClientes = action.payload.data.ContadorClientes;
            state.GraficoPack = action.payload.data.GraficoPack;
            state.ContadorAgendados = action.payload.data.ContadorAgendados;
        },

    },
});

// Reducer
export default slice.reducer;

export function getProfesorCuposPack(
    ProfId?: string,
    RolId?: string,
  ) {
    return async (dispatch: Dispatch) => {
      dispatch(slice.actions.startLoading());
  
      try {
        const responsePost = await axios.post('/indicadores', { ProfId, RolId });
  
        dispatch(slice.actions.getIndicadoresSuccess(responsePost));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        Errors.handle(error);
      }
    };
  }