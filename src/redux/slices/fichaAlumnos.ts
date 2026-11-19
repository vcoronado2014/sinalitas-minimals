import { Dispatch, createSlice } from '@reduxjs/toolkit';
import { IAlumnos, IAlumnosGeneralState } from 'src/@types/clientePack';
import Errors from 'src/utils/errors';
import axios from '../../utils/axios';

const initialState: IAlumnosGeneralState = {
    isLoading: false,
    error: null,
    alumnosFicha: [],
    count: 0,
  };

  const slice = createSlice({
    name: 'alumnos',
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
      getSuccess(state, action) {
        state.isLoading = false;
        state.alumnosFicha = action.payload === '' ? [] : action.payload;
        state.count = action.payload.length;
      },
  
    },
  });

  export default slice.reducer;

  export function getAlumnosCliente(
    ClieId?: string,
  ) {
    return async (dispatch: Dispatch) => {
      dispatch(slice.actions.startLoading());
  
      try {
        const responsePost = await axios.post('/FichaAlumnos', { ClieId });
  
        dispatch(slice.actions.getSuccess(responsePost.data));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        Errors.handle(error);
      }
    };
  }

