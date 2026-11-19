import { Dispatch, createSlice } from '@reduxjs/toolkit';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterProdCod';
import { IProfesorCupoGeneralState } from 'src/@types/profesorCupo';
import { getComparator } from 'src/components/table';
import axios from '../../utils/axios';
import { _userList } from '../../_mock/arrays';


const initialState: IProfesorCupoGeneralState = {
    isLoading: false,
    error: null,
    profesorCupos: [],
    count: 0,
    profesorCupo: null,
    sortBy: null,
};

const slice = createSlice({
    name: 'profesorCupos',
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
        getProfesorCuposSuccess(state, action) {
            state.isLoading = false;
            state.profesorCupos = action.payload.data;
            state.count = action.payload.length;
        },

    },
});

// Reducer
export default slice.reducer;

export function getProfesorCuposPack(
  PcoId?: string,
  ComId?: string,
) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      const responsePost = await axios.post('/ProfesorCupo', { PcoId, ComId });

      dispatch(slice.actions.getProfesorCuposSuccess(responsePost));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}
