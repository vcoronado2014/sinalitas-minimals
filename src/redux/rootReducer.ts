import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import userReducer from './slices/user';
import clientReducer from './slices/client';
import productsReducer from './slices/products';
import productoCodigoReducer from './slices/productoCodigo';
import clientePackReducer  from './slices/clientePack';
import profesorCupoReducer  from './slices/profesorCupo';
import envoltorioPackReducer  from './slices/envoltorioPack';
import agendaProfesorReducer  from './slices/agendaProfesor';
import tareasProfesorReducer  from './slices/tareasProfesor';
import fichaAlumnosReducer  from './slices/fichaAlumnos';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  user: userReducer,
  client: clientReducer,
  product: persistReducer(productPersistConfig, productReducer),
  products: productsReducer, 
  productoCodigos: productoCodigoReducer,
  clientePack: clientePackReducer,
  envoltorioPack: envoltorioPackReducer,
  agendaProfesor: agendaProfesorReducer,
  tareasProfesor: tareasProfesorReducer,
  alumnosFicha: fichaAlumnosReducer,
  /* profesorCupos: profesorCupoReducer, */
});

export default rootReducer;
