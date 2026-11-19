import { createContext, useEffect, useReducer, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { HOST_PHOTO } from 'src/config-global';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';

import {
  comunas,
  country,
  regiones
} from '../_mock/assets';



// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type JWTContextUpdateType = {
  updateUser: Dispatch<SetStateAction<AuthUserType | null>>;
};

export const AuthContext = createContext<JWTContextType & JWTContextUpdateType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const getRole = (rolId: number) =>{
    let rol = '';
    if (rolId === 1){
      rol= 'Super Administrador';
    }
    else if (rolId === 2){
      rol= 'Supervisor';
    }
    else if (rolId === 3){
      rol= 'Profesor';
    }
    return rol;

  }

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get('/api/account/my-account');
/*         //agregado
        //data
        let data = {
          "Usuario": 
        }
        const response = await axios.post('/api/Login'); */

        const { user } = response.data;
        

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (userName: string, password: string, token: string, recuerdame: boolean) => {

    const response = await axios.post('/login', {
      Usuario: userName,
      Clave: password,
      Token: token,
    });
    
    const accessToken = '';

    let photo = '';
    if (response.data.Fotografia !== ''){
      photo = `${HOST_PHOTO}${response.data.Fotografia}`;
    }
    else{
      // esto lo dejamos asi por mientras
      // photo = profesor.Sexo === 'Masculino' ? `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${2}.jpg` : `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${24}.jpg`;
      photo = `${HOST_PHOTO}no_foto.png`;
    }

    const user = {
      id: response.data.Id,
      email: response.data.Email,
      phoneNumber: response.data.TelefonosContacto,
      time: null,
      boolean: true,
      role: getRole(response.data.RolId),
      company: 'SinAlitas.cl',
      name: {
        firstName: response.data.PrimerApellido,
        lastName: response.data.SegundoApellido,
        fullName: `${response.data.Nombres} ${response.data.PrimerApellido}, ${response.data.SegundoApellido}`,
      },
      displayName: `${response.data.Nombres} ${response.data.PrimerApellido}`,
      address: response.data.Direccion,
      country: country[0],
      state: regiones[response.data.RegId -1],
      city: comunas[response.data.ComId - 1],
      photoURL: photo,
      text: {
        title: 'Apply These 7 Secret Techniques To Improve Event',
        sentence: 'Assumenda nam repudiandae rerum fugiat vel maxime',
        description: 'Occaecati est et illo quibusdam accusamus qui. Incidunt aut et molestiae ut facere aut. Est quidem iusto praesentium excepturi harum nihil tenetur facilis. Ut omnis voluptates nihil accusantium doloribus eaque debitis.',
      },
      number: {
        percent: '0',
        rating: '5.0',
        age: '0',
        price: '0',
      },
      image: {
        cover: `https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_${3}.jpg`,
        product: `https://api-dev-minimal-v4.vercel.app/assets/images/products/product_${8}.jpg`,
        avatar:  photo,
      },

      PaiId: response.data.Id,
      Rut: response.data.Rut,
      Fotografia: response.data.Fotografia,
      Nombres: response.data.Nombres,
      PrimerApellido: response.data.PrimerApellido,
      SegundoApellido: response.data.SegundoApellido,
      Codigo: response.data.Codigo,
      RegId: response.data.RegId,
      ComId: response.data.ComId,
      Direccion: response.data.Direccion,
      Sexo: response.data.Sexo,
      NombreUsuario: response.data.NombreUsuario,
      Activo: response.data.Activo,
      Eliminado: response.data.Eliminado,
      TelefonosContacto: response.data.TelefonosContacto,
      NodId: response.data.NodId,
      RolId: response.data.RolId,
      ComIdAsignada: response.data.ComIdAsignada,
      TipoCuenta: response.data.TipoCuenta,
    }


    sessionStorage.setItem('USER_NAME', user.Rut);
    sessionStorage.setItem('ID_USER', user.id.toString());
    sessionStorage.setItem('ROL_ID', user.RolId);
    if (recuerdame){
      localStorage.setItem('USER_NAME', user.Rut);
      localStorage.setItem('RECORDARME', recuerdame ? 'true' : 'false');
    }
    

    setSession(accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const response = await axios.post('/api/account/register', {
        email,
        password,
        firstName,
        lastName,
      });
      const { accessToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user,
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    sessionStorage.removeItem('USER_NAME');
    sessionStorage.removeItem('ID_USER');
    sessionStorage.removeItem('ROL_ID');
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // Método para actualizar el usuario en el estado
  const updateUser = useCallback((updatedUser: Partial<AuthUserType> | null) => {
    dispatch({
      type: Types.INITIAL,
      payload: {
        isAuthenticated: updatedUser !== null,
        user: updatedUser
          ? {
              ...state.user,
              ...updatedUser,
            }
          : null,
      },
    });
  }, [state.user]);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      loginWithGoogle: () => { },
      loginWithGithub: () => { },
      loginWithTwitter: () => { },
      register,
      logout,
      updateUser,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register, updateUser]
  );

  /* return <AuthContext.Provider value={{...memoizedValue, updateUser}}>{children}</AuthContext.Provider>; */
  /* return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>; */
  return useMemo(
    () => <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>,
    [memoizedValue, children]
  );
}
