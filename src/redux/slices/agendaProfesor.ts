import { Dispatch, createSlice } from '@reduxjs/toolkit';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterProdCod';
import { IAgendaProfesor, IAgendaProfesorState } from 'src/@types/agendaProfesor';
import { getComparator } from 'src/components/table';
import { paramCase } from 'change-case';
import axios from '../../utils/axios';

const initialState: IAgendaProfesorState = {
    isLoading: false,
    error: null,
    agendas: [],
    count: 0,
  };

  const slice = createSlice({
    name: 'agendaProfesor',
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
        state.agendas = action.payload;
        state.count = action.payload.length;
      },
  
    },
  });

    // Reducer
export default slice.reducer;

export function getAgenda(
    Anno?: string,
    MesInicio?: string,
    NodId?: string,
    ProfId?: string,
  
  ) {
    return async (dispatch: Dispatch) => {
      dispatch(slice.actions.startLoading());
  
      try {
        const responsePost = await axios.post('/ActualizarAgenda', { NodId, MesInicio, Anno, ProfId }); 
        dispatch(slice.actions.getAgendaSuccess(responsePost.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        Errors.handle(error);
      }
    };
  }