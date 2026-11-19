import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
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
  TextField
} from '@mui/material';
import {
    DatePicker,
    StaticDatePicker,
    MobileDatePicker,
    DesktopDatePicker,
  } from '@mui/x-date-pickers';
// import ClientCard from 'src/sections/@dashboard/client/cards/ClientCard';
import AvatarAgenda from 'src/sections/@dashboard/agenda/AvatarAgenda';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { IAgendaProfesor } from 'src/@types/agendaProfesor';
import { getAgenda } from '../../redux/slices/agendaProfesor';

// import { getClients, putClient } from '../../redux/slices/client';
// routes
import { fDate } from '../../utils/formatTime';
import { useAuthContext } from '../../auth/useAuthContext';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
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


export default function AgendaProfesorListPage() {
    const { user } = useAuthContext();

    const { themeStretch } = useSettingsContext();

    const navigate = useNavigate();
  
    const dispatch = useDispatch();

    const {
        agendas,
        count,
        isLoading
    } = useSelector((state) => state.agendaProfesor);

    const [dataAgenda, setDataAgenda] = useState(agendas); 

    const isDesktop = useResponsive('up', 'md');

    const isNotFound = (!count);

    const [minDate, setMinDate] = useState<Date | null>(null);
    const [maxDate, setMaxDate] = useState<Date | null>(null);

    const [value, setValue] = useState<Date | null>(new Date());

    const onBuscar=()=>{
        const today = new Date();
        const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
        const min = new Date(firstDayOfCurrentMonth);
        min.setMonth(min.getMonth() - 1);
    
        const max = new Date(lastDayOfCurrentMonth);
        max.setMonth(max.getMonth() + 3);
    
        setMinDate(min);
        setMaxDate(max);

        const annio =  (fDate(value, "yyyy")).toString();
        const mes = (fDate(value, "MM")).toString();
        const profId = user?.id.toString();
        const nodId = user?.NodId.toString();

        dispatch(getAgenda(annio,mes,nodId,profId));
    }

    useEffect(() => {
        onBuscar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch])

    const onGuardar =()=>{
        
        onBuscar();
    }

    return (
        <><Helmet>
            <title> Agenda</title>
        </Helmet>
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Agenda"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'Profesor', href: PATH_DASHBOARD.agenda.list },
                    { name: 'Agenda' },
                ]}
            />

            <DatePicker
                views={['year', 'month']}
                label="Seleccione mes y año"
                minDate={minDate}
                maxDate={maxDate}
                value={value}
                onChange={(newValue) => {
                    const annio =  (fDate(newValue, "yyyy")).toString();
                    const mes = (fDate(newValue, "MM")).toString();
                    const profId = user?.id.toString();
                    const nodId = user?.NodId.toString();
                    setValue(newValue);
                    dispatch(getAgenda(annio,mes,nodId,profId));
                }}
                renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" helperText={null} />
                )}
            />

            {/* <Typography>Contenido de la agenda del profesor</Typography> */}

            <AvatarAgenda lista={agendas} onGuardar={onGuardar} />



        </Container></>
    )

}