import React from "react";
import { Avatar, Badge, Box, Button, ButtonGroup, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useSnackbar } from 'src/components/snackbar';
import useResponsive from "src/hooks/useResponsive";
import { IAgendaProfesor } from "src/@types/agendaProfesor";
import { isSameDay, isSameMonth, getYear, isBefore, compareAsc, format, parse } from 'date-fns';
import axios from '../../../utils/axios';
import DialogAgendar from "./dialog/DialogAgendar";


type Props = {
    lista: IAgendaProfesor[];
    onGuardar: () => void;
};


export default function AvatarAgenda({ lista, onGuardar }: Props){
    const isDesktop = useResponsive('up', 'md');
    const { enqueueSnackbar } = useSnackbar();

    const [openBorrar, setOpenBorrar] = React.useState(false);
    const [itemBorrar, setItemBorrar] = React.useState<IAgendaProfesor>();

    const [openDisponibilizar, setOpenDisponibilizar] = React.useState(false);
    const [itemDisponibilizar, setItemDisponibilizar] = React.useState<IAgendaProfesor>();

    const [openVer, setOpenVer] = React.useState(false);
    const [itemVer, setItemVer] = React.useState<IAgendaProfesor>();


    const handleClickOpenBorrar = (item:any) => {
        setItemBorrar(item);
        setOpenBorrar(true);
    };

    const handleCloseBorrar = () => {
        setOpenBorrar(false);
    };

    const handleBorrar = async () => {
        const fechaEntera = itemBorrar?.FechaEntera;
        const profId = itemBorrar?.ProfId;
        const arrGuardar = '';
        const arrGuardarNo = '1,2,3,4,5,6,7,8';

        const dataGet = {
            NodId: '1',
            FechaEntera: fechaEntera?.toString(),
            ProfId: profId?.toString(),
            Segmentos: arrGuardar,
            SegmentosNo: arrGuardarNo
        };
        try{
            const responsePost = await axios.put('/BuscarSegmentos',  dataGet );
            if (responsePost.data.length > 0){
                enqueueSnackbar('Guardado con éxito', { anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'default'})
            }
            onGuardar();
            setOpenBorrar(false);
        }
        catch (error) {
            enqueueSnackbar('Hubo un error al guardar', {anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'error', autoHideDuration: 7000 })

        }
    };

    const handleCloseVer = () => {
        setOpenVer(false);
    };


    // disponibilizar todos

    const handleClickOpenDisponibilizar = (item:any) => {
        setItemDisponibilizar(item);
        setOpenDisponibilizar(true);
    };

    const handleCloseDisponibilizar = () => {
        setOpenDisponibilizar(false);
    };

    const handleDisponibilizar = async () => {
        const fechaEntera = itemDisponibilizar?.FechaEntera;
        const profId = itemDisponibilizar?.ProfId;
        const arrGuardar = '1,2,3,4,5,6,7,8';
        const arrGuardarNo = '';

        const dataGet = {
            NodId: '1',
            FechaEntera: fechaEntera?.toString(),
            ProfId: profId?.toString(),
            Segmentos: arrGuardar,
            SegmentosNo: arrGuardarNo
        };
        try {
            const responsePost = await axios.put('/BuscarSegmentos', dataGet);
            if (responsePost.data.length > 0) {
                enqueueSnackbar('Guardado con éxito', { anchorOrigin: { vertical: 'top', horizontal: 'center' }, variant: 'default' })
            }
            onGuardar();
            setOpenDisponibilizar(false);
        }
        catch (error) {
            enqueueSnackbar('Hubo un error al guardar', { anchorOrigin: { vertical: 'top', horizontal: 'center' }, variant: 'error', autoHideDuration: 7000 })
        }
    };

    const onGuardarAgenda = () =>{
        setOpenVer(false);
        onGuardar();
    }

    const handleClickOpenVer = (item:any) => {
        setItemVer(item);
        setOpenVer(true);
    };

    return (
        <><List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {lista.map((dato: IAgendaProfesor, index) => {
                const fechaActual = format(new Date(), 'yyyy-MM-dd');
                const fechaDato = format(new Date(dato.Fecha), 'yyyy-MM-dd');

                const comparacion = (
                    new Date(fechaDato).setHours(0, 0, 0, 0) -
                    new Date(fechaActual).setHours(0, 0, 0, 0)
                );

                const esFinDeSemana = dato.DiaSemana === 'sábado' || dato.DiaSemana === 'domingo';

                let bgColor;
                if (comparacion < 0) {
                    bgColor = esFinDeSemana ? 'warning.main' : 'primary.success'; // Cuando dato.Fecha es menor que la fecha actual
                } else if (comparacion > 0) {
                    bgColor = esFinDeSemana ? 'error.main' : 'primary.light'; // Cuando dato.Fecha es mayor que la fecha actual
                } else {
                    bgColor = 'primary.main'; // Cuando dato.Fecha es igual a la fecha actual
                }

                const cuposAgendados = dato.CuposAgendados;
                const cuposConCliente = dato.CuposConCliente;
                const cuposNoAgendados = dato.CuposNoAgendados;


                return (
                    <><ListItem key={index} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar
                                sx={{ bgcolor: bgColor, color: 'white' }}
                                alt="Dia"
                            >
                                {dato.DiaSemanaInt}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                    {dato.DiaSemana}
                                    {comparacion === 0 && (
                                        <Chip label='Hoy' color='primary' size="small" variant="outlined" sx={{ ml: 1 }} />
                                    )}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                    {
                                        cuposNoAgendados > 0 && <Chip size="small" variant="soft" color="primary" avatar={<Avatar>{cuposNoAgendados}</Avatar>} label="No agendados" />
                                    }
                                    {
                                        cuposConCliente > 0 && <Chip size="small" variant="soft" color="secondary" avatar={<Avatar>{cuposConCliente}</Avatar>} label="Con cliente" />
                                    }
                                    {
                                        cuposAgendados > 0 && <Chip size="small" variant="soft" color="info" avatar={<Avatar>{cuposAgendados}</Avatar>} label="Agendados" />
                                    }
                                </Box>
                                
                                
                            </Box>}
                            secondary={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body1"
                                    color="text.primary"
                                >
                                    {dato.HoraInicio} - {dato.HoraTermino}
                                </Typography>
                                <ButtonGroup variant="outlined" aria-label="button group" size="small" sx={{ pt: 1.5 }}>
                                    <Button color="warning" disabled={dato.DeshabilitaBorrarTodo === 0 } onClick={()=>handleClickOpenBorrar(dato)}>{isDesktop ? 'Desmarcar todos' : 'Desmarcar'}</Button>
                                    <Button color="secondary" disabled={dato.DeshabilitaCrearTodo === 0 || dato.CuposDisponibles === 0} onClick={()=>handleClickOpenDisponibilizar(dato)}>{isDesktop ? 'Marcar todos' : 'Marcar'}</Button>
                                    <Button color="primary" onClick={()=>handleClickOpenVer(dato)}>Ver</Button>
                                </ButtonGroup>
                            </Box>} />
                    </ListItem>
                        <Divider variant="inset" component="li" />
                    </>
                );
            }


            )}
        </List>
        <Dialog
            open={openBorrar}
            onClose={handleCloseBorrar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Borrar todos los cupos
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    ¿Estas seguro de desactivar todos tus cupos disponibles.?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleCloseBorrar}>No, volver</Button>
                <Button color="primary" onClick={handleBorrar} autoFocus>
                    Si, borrar
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={openDisponibilizar}
            onClose={handleCloseDisponibilizar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Disponibilizar todos los cupos
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                ¿Estas seguro de dejar todos tus cupos disponibles.?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleCloseDisponibilizar}>No, volver</Button>
                <Button color="primary" onClick={handleDisponibilizar} autoFocus>
                    Si, seguro
                </Button>
            </DialogActions>
        </Dialog>

        <DialogAgendar
            onClose={handleCloseVer}
            open={openVer}
            onGuardar={onGuardarAgenda}
            item={itemVer}
        />
            
        </>

      );
}