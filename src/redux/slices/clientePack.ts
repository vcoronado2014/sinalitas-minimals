import { Dispatch, createSlice } from '@reduxjs/toolkit';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterProdCod';
import { IClientePackGeneralState } from 'src/@types/clientePack';
import { getComparator } from 'src/components/table';
import axios from '../../utils/axios';
import { _userList } from '../../_mock/arrays';


const initialState: IClientePackGeneralState = {
    isLoading: false,
    error: null,
    clientePacks: [],
    count: 0,
    clientePack: null,
    sortBy: null,
};

const slice = createSlice({
    name: 'clientePacks',
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
      getClientePacksSuccess(state, action) {
        state.isLoading = false;
        state.clientePack = action.payload.data;
        state.count = action.payload.length;
      },
    
    },
  });

    // Reducer
export default slice.reducer;

// Actions
// export const = slice.actions;

export function getClientePack(
  PcoId?: string,
) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      const responsePost = await axios.post('/ClientePaackProducto', { PcoId });

      dispatch(slice.actions.getClientePacksSuccess(responsePost));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      Errors.handle(error);
    }
  };
}