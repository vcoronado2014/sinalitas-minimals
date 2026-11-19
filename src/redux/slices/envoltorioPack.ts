import { Dispatch, createSlice } from '@reduxjs/toolkit';
// utils
import navigate from 'src/utils/Navigate';
import Snackbar from 'src/utils/Snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Errors from 'src/utils/errors';
import { applyFilter } from 'src/utils/applyFilterProdCod';
import { IEnvoltorioPackGeneralState, IEnvoltorioPackGeneral } from 'src/@types/envoltorioPack';
import { getComparator } from 'src/components/table';
import axios from '../../utils/axios';


const initialState: IEnvoltorioPackGeneralState = {
    isLoading: false,
    error: null,
    pack: null,
    count: 0,
    sortBy: null,
};

const slice = createSlice({
    name: 'envoltorioPack',
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
        getEnvoltorioPacksSuccess(state, action) {
            state.isLoading = false;
            state.pack = action.payload.data;
            state.count = action.payload.length;
        },

    },
});

// Reducer
export default slice.reducer;

export function getEnvoltorioPack(
    Nombre?: string,
) {
    return async (dispatch: Dispatch) => {
        dispatch(slice.actions.startLoading());

        try {
            const responsePost = await axios.post('/Envoltorio', { Nombre });

            dispatch(slice.actions.getEnvoltorioPacksSuccess(responsePost));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            Errors.handle(error);
        }
    };
}