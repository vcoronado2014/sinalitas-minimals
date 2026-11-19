import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useCallback, useEffect, useState } from 'react';
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
import AvatarTareas from 'src/sections/@dashboard/agenda/AvatarTareas';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { IAgendaProfesor } from 'src/@types/agendaProfesor';
import { ITareasProfesor } from 'src/@types/tareasProfesor';
import { getTareas } from '../../redux/slices/tareasProfesor';

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
import axios from '../../utils/axios';



export default function MisClasesListPage() {
    const { user } = useAuthContext();

    const { themeStretch } = useSettingsContext();

    const navigate = useNavigate();
  
    const dispatch = useDispatch();

    const {
        tareas,
        count,
        isLoading
    } = useSelector((state) => state.tareasProfesor);

    const [dataTareas, setDataTareas] = useState<ITareasProfesor[]>([]); 

    const isDesktop = useResponsive('up', 'md');

    const isNotFound = (!count);

    const [minDate, setMinDate] = useState<Date | null>(null);
    const [maxDate, setMaxDate] = useState<Date | null>(null);

    const [value, setValue] = useState<Date | null>(new Date());

    const [loading, setLoading] = useState(false); 


    const onBuscar = useCallback(async () => {
        const today = new Date();
        const todayInt = fDate(today, 'yyyyMMdd');
        const profId = user?.id.toString();

        setLoading(true);

        try {
            const responsePost = await axios.post('/TareasProfesor', { FechaEntera: todayInt, ProfId: profId });
            setDataTareas(responsePost.data === '' ? [] : responsePost.data);

            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }

    }, [user])


    useEffect(() => {
        onBuscar();
    }, [onBuscar])      

    const onGuardar =()=>{
        
        onBuscar();
    }

    return (
        <><Helmet>
            <title> Agenda</title>
        </Helmet>
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Mis clases"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'Profesor', href: PATH_DASHBOARD.agenda.misClases },
                    { name: 'Mis clases' },
                ]}
            />

            <AvatarTareas lista={dataTareas} onGuardar={onGuardar} />

        </Container></>
    )

}