import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { setHours, setMinutes } from 'date-fns';
// utils
import axios from '../../utils/axios';
// @types
import { ICalendarState, ICalendarEvent } from '../../@types/calendar';


// ----------------------------------------------------------------------

const initialState: ICalendarState = {
  isLoading: false,
  error: null,
  events: [],
};

const slice = createSlice({
  name: 'calendar',
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

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      state.isLoading = false;
      state.events = state.events.map((event) => {
        if (event.id === action.payload.id) {
          return action.payload;
        }
        return event;
      });
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const eventId = action.payload;
      state.events = state.events.filter((event) => event.id !== eventId);
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

/* export function getEvents() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/calendar/events');
      dispatch(slice.actions.getEventsSuccess(response.data.events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
} */

const entregaTime = (fecha:any, hora:number, minute: number)=>{
  const detalleFechaStart = new Date(fecha);
  const nuevaFechaStart = setMinutes(setHours(detalleFechaStart, hora), minute);
  return nuevaFechaStart.getTime();
}

export function getEvents(fechaEntera:string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.get('/api/calendar/events');
      const response = await axios.post('/PlanillaProfesorNew', { FechaEntera: fechaEntera });

      const newEvents: { id: string; allDay: boolean; color: string; description: string; start: number; end: number; title: string; }[] = [];
      let indice = 1;
      response.data.forEach((element: any) => {
        const nombreProfesor = element.NombreProfesor;
        
        element.Detalle.forEach((detalle: any) => {
  
          if (detalle.SegmentoUno !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 9, 0);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 9, 45);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoUno === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoUno,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: detalle.SegmentoUno === 'Disponible' ?  `${nombreProfesor}` : `${detalle.SegmentoUno}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoDos !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 10, 15);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 11, 0);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoDos === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoDos,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: detalle.SegmentoDos === 'Disponible' ?  `${nombreProfesor}` : `${detalle.SegmentoDos}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          
          if (detalle.SegmentoTres !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 11, 30);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 12, 15);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoTres === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoTres,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: detalle.SegmentoTres === 'Disponible' ?  `${nombreProfesor}` : `${detalle.SegmentoTres}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoCuatro !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 13, 0);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 13, 45);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoCuatro === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoCuatro,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: detalle.SegmentoCuatro === 'Disponible' ?  `${nombreProfesor}` : `${detalle.SegmentoCuatro}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoCinco !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 14, 15);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 15, 0);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoCinco === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoCinco,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: detalle.SegmentoCinco === 'Disponible' ?  `${nombreProfesor}` : `${detalle.SegmentoCinco}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoSeis !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 15, 30);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 16, 15);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoSeis === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoSeis,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: detalle.SegmentoSeis === 'Disponible' ?  `${nombreProfesor}` : `${detalle.SegmentoSeis}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoSiete !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 16, 45);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 17, 30);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoSiete === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoSiete,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: detalle.SegmentoSiete === 'Disponible' ?  `${nombreProfesor}` : `${detalle.SegmentoSiete}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoOcho !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 18, 0);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 18, 45);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoOcho === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoOcho,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: detalle.SegmentoOcho === 'Disponible' ?  `${nombreProfesor}` : `${detalle.SegmentoOcho}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }
  
        });
      });

      dispatch(slice.actions.getEventsSuccess(newEvents));
    
    
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getEventsProfesor(fechaEntera:string, profId:string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/MiAgenda', { FechaEntera: fechaEntera, ProfId: profId });

      const newEvents: { id: string; allDay: boolean; color: string; description: string; start: number; end: number; title: string; }[] = [];
      let indice = 1;
      response.data.forEach((element: any) => {
        const nombreProfesor = element.NombreProfesor;
        
        element.Detalle.forEach((detalle: any) => {
  
          if (detalle.SegmentoUno !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 9, 0);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 9, 45);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoUno === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoUno,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: `${detalle.SegmentoUno}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoDos !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 10, 15);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 11, 0);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoDos === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoDos,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: `${detalle.SegmentoDos}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          
          if (detalle.SegmentoTres !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 11, 30);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 12, 15);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoTres === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoTres,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: `${detalle.SegmentoTres}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoCuatro !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 13, 0);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 13, 45);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoCuatro === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoCuatro,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: `${detalle.SegmentoCuatro}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoCinco !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 14, 15);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 15, 0);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoCinco === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoCinco,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: `${detalle.SegmentoCinco}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoSeis !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 15, 30);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 16, 15);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoSeis === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoSeis,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title: `${detalle.SegmentoSeis}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoSiete !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 16, 45);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 17, 30);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoSiete === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoSiete,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title:`${detalle.SegmentoSiete}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }

          if (detalle.SegmentoOcho !== "") {
            const primerSegmentoInicio = entregaTime(detalle.Fecha, 18, 0);
            const primerSegmentoFin = entregaTime(detalle.Fecha, 18, 45);
            const evento = {
              id: indice.toString(),
              allDay: false,
              color: detalle.SegmentoOcho === 'Disponible' ?  "#54D62C" :  "#186dff",
              description: detalle.SegmentoOcho,
              start: primerSegmentoInicio,
              end: primerSegmentoFin,
              title:`${detalle.SegmentoOcho}`,
            }
  
            newEvents.push(evento);
  
            indice += 1;
          }
  
        });
      });

      dispatch(slice.actions.getEventsSuccess(newEvents));
    
    
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}



// ----------------------------------------------------------------------

export function createEvent(newEvent: ICalendarEvent) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/new', newEvent);
      dispatch(slice.actions.createEventSuccess(response.data.event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(
  eventId: string,
  event: Partial<{
    allDay: boolean;
    start: Date | string | number | null;
    end: Date | string | number | null;
  }>
) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/update', {
        eventId,
        event,
      });
      dispatch(slice.actions.updateEventSuccess(response.data.event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(slice.actions.deleteEventSuccess(eventId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
