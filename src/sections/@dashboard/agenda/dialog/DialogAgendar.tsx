import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip, Divider, ListItemButton, ListItemIcon, ButtonGroup, Popover, Badge, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';
import { useDispatch, useSelector } from 'src/redux/store';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import { getClientePack } from 'src/redux/slices/clientePack';
import { IProductoCodigoGrilla } from 'src/@types/productoCodigoGrilla';
import { IClientAccountGeneral } from 'src/@types/client';
import { IProfesorCupoGeneral } from 'src/@types/profesorCupo';
import { IClientePackGeneral } from 'src/@types/clientePack';
import { isSameDay, isSameMonth, getYear, isBefore, compareAsc, format } from 'date-fns';
import { IAgendaProfesor } from 'src/@types/agendaProfesor';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from '../../../../components/iconify';

// locales
import { useLocales } from '../../../../locales';


import axios from '../../../../utils/axios';
import { fDate } from '../../../../utils/formatTime';
import { HOST_PHOTO } from '../../../../config-global';


export interface DialogAgendarProps {
    open: boolean;
    item?: IAgendaProfesor;
    onClose: () => void;
    onGuardar: () => void;
};

export default function DialogAgendar (props:DialogAgendarProps){
    const isDesktop = useResponsive('up', 'md');

    const { onGuardar, open, onClose, item } = props;

    const { enqueueSnackbar } = useSnackbar();

    const [agendaProfesor, setAgendaProfesor] = useState<IAgendaProfesor[]>([]);
    const [lista1, setLista1] = useState<IAgendaProfesor[]>([]);
    const [lista2, setLista2] = useState<IAgendaProfesor[]>([]);

    const [loading, setLoading] = useState(false);

    const [seleccionados, setSeleccionados] = useState(0);

    const handleClose = () =>{
        setSeleccionados(0);
        onClose()
    }
    const handleGuardar=async ()=>{
        setLoading(true);

        const seleccionadosG = agendaProfesor.filter(itemm => itemm.EsSeleccionado === true);
        const noSeleccionados = agendaProfesor.filter(itemm => itemm.EsSeleccionado === false);
        
        // Obtener los SghId como arreglo de números
        const seleccionadosIds = seleccionadosG.map(itemm => itemm.SghId);
        const noSeleccionadosIds = noSeleccionados.map(itemm => itemm.SghId);
        
        // Convertir los arreglos de números a strings y unirlos
        const seleccionadosString = seleccionadosIds.join(', ');
        const noSeleccionadosString = noSeleccionadosIds.join(', ');


        const dataGet = {
            NodId: item?.NodId.toString(),
            FechaEntera: item?.FechaEntera.toString(),
            ProfId: item?.ProfId.toString(),
            Segmentos: seleccionadosString,
            SegmentosNo: noSeleccionadosString
        };

        try{
            const responsePost = await axios.put('/BuscarSegmentos',  dataGet );
            if (responsePost.data.length > 0){
                enqueueSnackbar('Guardado con éxito', { anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'default'})
            }
            setSeleccionados(0);
            setLoading(false);
            onGuardar();
            onClose();
        }
        catch (error) {
            setLoading(false);
            enqueueSnackbar('Hubo un error al guardar', {anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'error', autoHideDuration: 7000 })
        }
        
    }

    const onBuscar=useCallback(async ()=>{
        if (item) {
            const data = {
                EsBloqueado: '0',
                FechaEntera: item?.FechaEntera?.toString(),
                ProfId: item?.ProfId?.toString(),
                NodId: item?.NodId?.toString()
            };

            try {
                const responsePost = await axios.post('/BuscarSegmentos', data);
                if (responsePost.data.length > 0) {
                    const mitad = Math.ceil(responsePost.data.length / 2);
                    const primeraMitad = responsePost.data.slice(0, mitad);
                    const segundaMitad = responsePost.data.slice(mitad);

                    // Guardar las listas en el estado
                    setLista1(primeraMitad);
                    setLista2(segundaMitad);
                    setAgendaProfesor(responsePost.data);
                    enqueueSnackbar('Obtenido con éxito', { anchorOrigin: { vertical: 'top', horizontal: 'center' }, variant: 'default' })
                }

            }
            catch (error) {
                enqueueSnackbar('Hubo un error al obtener los datos', { anchorOrigin: { vertical: 'top', horizontal: 'center' }, variant: 'error', autoHideDuration: 7000 })
            }
        }

    },[item, enqueueSnackbar])

    useEffect(() => {
        onBuscar();
      }, [onBuscar])

    const handleSwitch = (event:any, dato: IAgendaProfesor) =>{
        dato.EsSeleccionado = event?.target?.checked;
        if (event?.target?.checked){
            // sumar seleccionados
            const contador = seleccionados + 1;
            setSeleccionados(contador);
        }
        else{
            // restar seleccionados
            const contador = seleccionados > 0 ? seleccionados - 1 : 0;
            setSeleccionados(contador);

        }
    }

/*     function contarSeleccionados(){

    } */
    
    return(
        <Dialog onClose={handleClose} open={open} disableEscapeKeyDown fullScreen>
            <DialogTitle sx={{pt: 2.5, mr: 3}}>
                {item?.Fecha ? fDate(item.Fecha, 'dd \'de\' MMMM \'del\' yyyy') : 'Fecha no disponible'} &nbsp; 
                <Badge badgeContent={seleccionados} color="secondary">
                    <Iconify icon="solar:calendar-bold" />
                </Badge>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon  />
            </IconButton>
            <DialogContent dividers>
                <DialogContentText>
                
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Grid container spacing={2}>
                            {agendaProfesor.map((dato: IAgendaProfesor, index) => {

                                const fechaActual = format(new Date(), 'yyyy-MM-dd');
                                const fechaDato = format(new Date(dato.Fecha), 'yyyy-MM-dd');

                                return (

                                    
                                        <Grid item md={6} xs={12} key={`${dato.FechaEntera}_${dato.HoraInicio}_${dato.HoraTermino}`}>
                                            <ListItem key={dato.FechaEntera} alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{ bgcolor: dato.EsDisponible ? 'primary.main' : 'warning.main', color: 'white' }}
                                                        alt="Dia"
                                                    >
                                                        {index + 1}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={<><Typography
                                                    variant='h6'
                                                    color={dato.EsDisponible ? 'primary' : 'warning'}
                                                >
                                                    {dato.Comentario}
                                                </Typography>
                                                {
                                                    dato.NombreClienteVisible &&
                                                    <Typography
                                                        variant='body1'
                                                        color={dato.EsDisponible ? 'primary' : 'warning'}
                                                    >
                                                        {`${dato.NombreCliente}, fono: ${dato.TelefonosCliente}`}
                                                    </Typography>
                                                }
                                                </>
                                                
                                                    }
                                                    secondary={<>
                                                        <Chip
                                                            icon={<Iconify icon="solar:calendar-bold" />}
                                                            label={`${dato.HoraInicio} a ${dato.HoraTermino}`} sx={{ mb: 1, pl: 1, mr: 1 }} />
                                                    </>} />
                                                <ListItemAvatar>
                                                    <Switch size='medium' disabled={!dato.EsDisponible} color='primary'
                                                        checked={dato.EsSeleccionado}
                                                        onChange={(event) => handleSwitch(event, dato)} />
                                                </ListItemAvatar>
                                            </ListItem><Divider />
                                        </Grid>
                                    


                                )
                            })}
                        </Grid>
                        </List>
                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                        <LoadingButton type="button" variant="contained" loading={loading} onClick={handleGuardar}>
                            Guardar
                        </LoadingButton>
                    </Stack>
                
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )

}