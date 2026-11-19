import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useRef, useEffect, useCallback } from 'react';
import { debounce, forEach } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle
} from '@mui/material';
import {
    DatePicker,
    StaticDatePicker,
    MobileDatePicker,
    DesktopDatePicker,
  } from '@mui/x-date-pickers';
// import ClientCard from 'src/sections/@dashboard/client/cards/ClientCard';
import AvatarTareas from 'src/sections/@dashboard/agenda/AvatarTareas';
import { setHours, setMinutes } from 'date-fns';
// redux
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../redux/slices/calendar';

// routes
import { fDate, fTimestamp } from '../../utils/formatTime';
import { ICalendarEvent, ICalendarViewValue } from '../../@types/calendar';
import { useAuthContext } from '../../auth/useAuthContext';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useDateRangePicker } from '../../components/date-range-picker';
// sections
import {
  CalendarForm,
  StyledCalendar,
  CalendarToolbar,
  CalendarFilterDrawer,
} from '../../sections/@dashboard/calendar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  Sort,
} from '../../components/table';
// sections
// import { ClientTableToolbar, ClientTableRow } from '../../sections/@dashboard/client/list';
import LoadingTable from '../../components/loading-table/LoadingTable';
import useResponsive from '../../hooks/useResponsive';
import axios from '../../utils/axios';

const COLOR_OPTIONS = [
    '#00AB55', // theme.palette.primary.main,
    '#1890FF', // theme.palette.info.main,
    '#54D62C', // theme.palette.success.main,
    '#FFC107', // theme.palette.warning.main,
    '#FF4842', // theme.palette.error.main
    '#04297A', // theme.palette.info.darker
    '#7A0C2E', // theme.palette.error.darker
  ];




export default function ReporteListPage() {
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useAuthContext();

    const { themeStretch } = useSettingsContext();

    const navigate = useNavigate();
  
    const dispatch = useDispatch();

    const {
        tareas,
        count,
        isLoading
    } = useSelector((state) => state.tareasProfesor);

    const [dataTareas, setDataTareas] = useState([]); 

    const isDesktop = useResponsive('up', 'md');

  const calendarRef = useRef<FullCalendar>(null);

  const events = useGetEvents();

  const [openForm, setOpenForm] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const selectedEvent = useSelector(() => {
    if (selectedEventId) {
      return events.find((event) => event.id === selectedEventId);
    }

    return null;
  });

  const picker = useDateRangePicker(null, null);

  const [date, setDate] = useState(new Date());

  const [openFilter, setOpenFilter] = useState(false);

  const [filterEventColor, setFilterEventColor] = useState<string[]>([]);

  const [view, setView] = useState<ICalendarViewValue>(isDesktop ? 'dayGridMonth' : 'listWeek');

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleOpenModal = () => {
    setOpenForm(true);
  };

  const handleCloseModal = () => {
    setOpenForm(false);
    setSelectedRange(null);
    setSelectedEventId(null);
  };

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView: ICalendarViewValue) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {

    console.log('no disponible');

  };

  const handleSelectEvent = (arg: EventClickArg) => {
    handleOpenModal();
    setSelectedEventId(arg.event.id);
  };

  const handleResizeEvent = ({ event }: EventResizeDoneArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = ({ event }: EventDropArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUpdateEvent = (newEvent: ICalendarEvent) => {
    if (selectedEventId) {
      dispatch(updateEvent(selectedEventId, newEvent));
      enqueueSnackbar('Update success!');
    } else {
      dispatch(createEvent(newEvent));
      enqueueSnackbar('Create success!');
    }
  };

  const handleDeleteEvent = () => {
    try {
      if (selectedEventId) {
        handleCloseModal();
        dispatch(deleteEvent(selectedEventId));
        enqueueSnackbar('Delete success!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterEventColor = (eventColor: string) => {
    const checked = filterEventColor.includes(eventColor)
      ? filterEventColor.filter((value) => value !== eventColor)
      : [...filterEventColor, eventColor];

    setFilterEventColor(checked);
  };

  const handleResetFilter = () => {
    const { setStartDate, setEndDate } = picker;

    if (setStartDate && setEndDate) {
      setStartDate(null);
      setEndDate(null);
    }

    setFilterEventColor([]);
  };

  const dataFiltered = applyFilter({
    inputData: events,
    filterEventColor,
    filterStartDate: picker.startDate,
    filterEndDate: picker.endDate,
    isError: !!picker.isError,
  });

  const businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // Monday - Friday
    startTime: '09:00', // 9 AM
    endTime: '19:00'    // 5 PM
  };
   
    return (
        <><Helmet>
            <title> Reporte</title>
        </Helmet>
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Reporte"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'Reporte', href: PATH_DASHBOARD.reporte.list },
                    { name: 'Clases' },
                ]}
            />

            <Card>
                <StyledCalendar>
                    <CalendarToolbar
                        date={date}
                        view={view}
                        onNextDate={handleClickDateNext}
                        onPrevDate={handleClickDatePrev}
                        onToday={handleClickToday}
                        onChangeView={handleChangeView}
                        onOpenFilter={() => setOpenFilter(true)}
                    />
                  <div style={{ overflowY: 'auto', maxHeight: '1000px' }}>   
                    <FullCalendar
                        weekends
                        editable
                        droppable
                        selectable
                        rerenderDelay={10}
                        allDayMaintainDuration
                        eventResizableFromStart
                        ref={calendarRef}
                        initialDate={date}
                        initialView={view}
                        dayMaxEventRows={3}
                        eventDisplay="block"
                        events={dataFiltered}
                        headerToolbar={false}
                        initialEvents={events}
                        select={handleSelectRange}
                        eventDrop={handleDropEvent}
                        eventClick={handleSelectEvent}
                        eventResize={handleResizeEvent}
                        height={isDesktop ? 820 : 'auto'}
                        plugins={[
                            listPlugin,
                            dayGridPlugin,
                            timelinePlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}
                        locale='es-CL'
                        moreLinkText=" cupos"
                        allDayText='todos'
                        noEventsText='No hay'
                        businessHours={businessHours}
                        firstDay={1}
                        slotDuration='00:15:00'
                        slotMinTime='09:00:00'
                        slotMaxTime='19:00:00'
                        slotLabelInterval="00:45"
                    />
                    </div>
                </StyledCalendar>
            </Card>

        </Container>
        <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleCloseModal}>
        <DialogTitle>{selectedEvent ? 'Ver evento' : 'Agregar evento'}</DialogTitle>

        <CalendarForm
          event={selectedEvent}
          range={selectedRange}
          onCancel={handleCloseModal}
          onCreateUpdateEvent={handleCreateUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          colorOptions={COLOR_OPTIONS}
        />
      </Dialog>

      <CalendarFilterDrawer
        events={events}
        picker={picker}
        openFilter={openFilter}
        colorOptions={COLOR_OPTIONS}
        onResetFilter={handleResetFilter}
        filterEventColor={filterEventColor}
        onCloseFilter={() => setOpenFilter(false)}
        onFilterEventColor={handleFilterEventColor}
        onSelectEvent={(eventId) => {
          if (eventId) {
            handleOpenModal();
            setSelectedEventId(eventId);
          }
        }}
      />
        </>
    )

}

// ----------------------------------------------------------------------

const useGetEvents = () => {
    const dispatch = useDispatch();
  
    const { events: data } = useSelector((state) => state.calendar);
  
    const getAllEvents = useCallback(async () => {
      const today = new Date();
      const todayInt = fDate(today, 'yyyyMMdd');
      dispatch(getEvents(todayInt));
  
  
    }, [dispatch]);
  
    useEffect(() => {
      getAllEvents();
    }, [getAllEvents]);
  
    const events = data.map((event) => ({
      ...event,
      textColor: event.color,
    }));
  
    return events;
  };
  
  // ----------------------------------------------------------------------
  
  function applyFilter({
    inputData,
    filterEventColor,
    filterStartDate,
    filterEndDate,
    isError,
  }: {
    inputData: EventInput[];
    filterEventColor: string[];
    filterStartDate: Date | null;
    filterEndDate: Date | null;
    isError: boolean;
  }) {
    const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  
    inputData = stabilizedThis.map((el) => el[0]);
  
    if (filterEventColor.length) {
      inputData = inputData.filter((event: EventInput) =>
        filterEventColor.includes(event.color as string)
      );
    }
  
    if (filterStartDate && filterEndDate && !isError) {
      inputData = inputData.filter(
        (event: EventInput) =>
          fTimestamp(event.start as Date) >= fTimestamp(filterStartDate) &&
          fTimestamp(event.end as Date) <= fTimestamp(filterEndDate)
      );
    }
  
    return inputData;
  }