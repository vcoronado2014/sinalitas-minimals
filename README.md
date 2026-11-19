# Plantilla Minimal

[Minimal] es una plantilla basada en React con Typescript que está compuesta por gran cantidad de componentes (en su mayoría desarrollados con MaterialUI), haciendo posible la reutilización del código y brindando una fácil adaptación a los distintos proyectos que se presenten.

## Instalación

Clonamos el [repositorio] que se encuentra en GitLab.
```sh
git clone https://gitlab.com/jedify/web/base-minimal-ts.git
```
Accedemos a la carpeta e instalamos las librerías.
```sh
cd base-minimal-ts
yarn install
```
Levantamos la app.
```sh
yarn start
```

## Librerías

Las principales librerías que la componen son:

- [Axios] - llamadas al servidor
- [Date FNS] - manejo de fechas
- [MaterialUI] - componentes de UI
- [React] - construcción de interfaces
- [React Hook Form] - construcción de formularios
- [React Redux] - manejo y centralización de estados de la app
- [Redux Toolkit] - simplificación de React Redux
- [Typescript] - tipados estáticos y objetos basados en clases
- [Yup] - validaciones de formularios

## Estructura

El código se encuentra dividido en dos carpetas principales: **public** y **src**. La carpeta **public** contiene todo lo relacionado con logos, iconos, fuentes e ilustraciones, además de los archivos comunes de React. Por otro lado, la carpeta **src** contiene toda la estructura de la app, y está conformada por las siguientes subcarpetas:

| Subcarpeta | Descripción |
| ------ | ------ |
| _mock | Mocks de información creada por Minimal |
| **@types** | Definición de tipos |
| assets | Ilustraciones e iconos |
| components | Componentes prearmados |
| **contexts** | Autenticación |
| guards | Funciones de roles y autenticación |
| hooks | Funciones reutilizables |
| layouts | Menú, header |
| locales | Traducciones del contenido |
| **pages** | Componentes padre |
| **redux** | Store, Reducer y llamadas a APIs |
| **routes** | Rutas de la app |
| **sections** | Componentes hijo |
| theme | Estilos utilizados en componentes |
| utils | Otras funciones (ej.: formateo de nros.) |

## Conceptos básicos

### Definición de tipos
Al utilizar **Typescript**, necesitamos definir los objetos con los que vamos a estar trabajando para así poder acceder a las propiedades de cada uno dentro de los componentes. Esta definición se realiza en **src > @types > ejemplo.ts**, y va a tener la siguiente estructura:
```typescript
export type Empresa = {
    id: number;
    name: string;
    cuit: string;
    description: string;
    accountCode: string;
    detail: string;
    status: string;
};
```

### Conexión con APIs
Para poder conectarnos con una API y recibir la información que nos devuelva, vamos a tener que seguir los siguientes pasos.
En **src > redux > slices > ejemplo.ts**:

Construimos el state.
```typescript
const initialState: EmpresaState = {
    isLoading: false,
    error: null,
    empresa: null,
};
```

Creamos el slice.
```typescript
const slice = createSlice({
    name: 'empresa',
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
        // GET EMPRESA
        getEmpresaSuccess(state, action) {
            state.isLoading = false;
            state.empresa = action.payload;
        },
    },
});
```

Armamos la petición.
```typescript
export function getEmpresa(id: string) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response: { data: Empresa } = await axios.get(`/companies/${id}`);
            dispatch(slice.actions.getEmpresaSuccess(response.data));
        } catch (error) {
            console.error(error);
            dispatch(slice.actions.hasError(error));
            Errors.handle(error);
        }
    };
}
```

En **src > sections > section.tsx** o **src > pages > page.tsx**:

Llamada desde el componente.
```typescript
useEffect(() => {
    if (isEdit) {
        dispatch(getEmpresa(id))
    }
}, [dispatch])
```

Extraemos la información del state.
```typescript
const { empresa } = useSelector((state) => state.empresa)
```
De esta forma, ya puede ser utilizada llamando a **empresa** y sus propiedades definidas anteriormente.

*Última modificación: 24/02/2023.*

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Minimal]: <https://minimals.cc/>
   [repositorio]: <https://gitlab.com/jedify/web/base-minimal-ts>
   [React]: <https://reactjs.org/>
   [React Hook Form]: <https://react-hook-form.com/>
   [Yup]: <https://www.npmjs.com/package/yup>
   [MaterialUI]: <https://mui.com/>
   [Date FNS]: <https://date-fns.org/>
   [Axios]: <https://axios-http.com/docs/intro>
   [Redux Toolkit]: <https://redux-toolkit.js.org/>
   [React Redux]: <https://react-redux.js.org/>
   [Typescript]: <https://www.typescriptlang.org/>

   node v18.10.0
   
   npm start
   #build de la app
   npm run build
   #deploy
   firebase login --reauth
   firebase deploy --only hosting
   

