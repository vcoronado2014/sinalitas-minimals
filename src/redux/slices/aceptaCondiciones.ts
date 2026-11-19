import { Dispatch, createSlice } from '@reduxjs/toolkit';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterProdCod';
import { IAceptaCondiciones, IAceptaCondicionesState } from 'src/@types/aceptaCondiciones';
import { getComparator } from 'src/components/table';
import { paramCase } from 'change-case';
import axios from '../../utils/axios';
import { _userList } from '../../_mock/arrays';



const initialState: IAceptaCondicionesState = {
    isLoading: false,
    error: null,
    aceptaCondiciones: null,
  };

  const slice = createSlice({
    name: 'aceptaCondiciones',
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
  
      // post
      postAceptaSuccess(state, action) {
        state.isLoading = false;
        state.aceptaCondiciones = action.payload;
      }, 
    },
  });

  // Reducer
export default slice.reducer;

export function postAceptaCondiciones(PcoId: string = "0",) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { IdPack: PcoId }

      const responsePost = await axios.put('/AceptaCondiciones', data);

      dispatch(slice.actions.postAceptaSuccess(responsePost));

    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}