import { Dispatch, createSlice } from '@reduxjs/toolkit';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterProdCod';
import { ITareasProfesor, ITareasProfesorState } from 'src/@types/tareasProfesor';
import { getComparator } from 'src/components/table';
import { paramCase } from 'change-case';
import axios from '../../utils/axios';

const initialState: ITareasProfesorState = {
    isLoading: false,
    error: null,
    tareas: [],
    count: 0,
  };

  const slice = createSlice({
    name: 'tareasProfesor',
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
      getAgendaSuccess(state, action) {
        state.isLoading = false;
        state.tareas = action.payload === '' ? [] : action.payload;
        state.count = action.payload.length;
      },
  
    },
  });

    // Reducer
export default slice.reducer;

export function getTareas(
    FechaEntera?: string,
    ProfId?: string,
  
  ) {
    return async (dispatch: Dispatch) => {
      dispatch(slice.actions.startLoading());
  
      try {
        const responsePost = await axios.post('/TareasProfesor', { FechaEntera, ProfId });
  
        dispatch(slice.actions.getAgendaSuccess(responsePost.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        Errors.handle(error);
      }
    };
  }
  export function getTareasCerradas(
    FechaEntera?: string,
    ProfId?: string,
  
  ) {
    return async (dispatch: Dispatch) => {
      dispatch(slice.actions.startLoading());
  
      try {
        const responsePost = await axios.post('/TareasProfesorRealizadas', { FechaEntera, ProfId });
  
        dispatch(slice.actions.getAgendaSuccess(responsePost.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        Errors.handle(error);
      }
    };
  }