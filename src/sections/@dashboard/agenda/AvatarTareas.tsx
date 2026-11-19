import React, { useEffect, useState } from "react";
import { Avatar, Badge, Box, Button, ButtonGroup, Card, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material";
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import { useSnackbar } from 'src/components/snackbar';
import { ITareasMostrar, ITareasProfesor } from "src/@types/tareasProfesor";
import { isSameDay, isSameMonth, getYear, isBefore, compareAsc, format, parse } from 'date-fns';
import Iconify from "src/components/iconify";
import useResponsive from "src/hooks/useResponsive";
import EmptyContent from "src/components/empty-content";
import SkeletonProductDetails from "src/components/skeleton/SkeletonProductDetails";
import axios from '../../../utils/axios';
import DialogAgendar from "./dialog/DialogAgendar";
import InfoClase from "./info/InfoClase";

type Props = {
    lista: ITareasProfesor[];
    onGuardar: () => void;
    esCerrada?: boolean;
};


export default function AvatarTareas({ lista, onGuardar, esCerrada = false }: Props){
    const isDesktop = useResponsive('up', 'md');
    const { enqueueSnackbar } = useSnackbar();

    const [fichaAlummno, setFichaAlumno] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openVer, setOpenVer] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState<any>();

    const [openCerrar, setOpenCerrar] = React.useState(false);
    const [observacionCierre, setObservacionCierre] = React.useState('');
    const [errorForm, setErrorForm] = React.useState('');

    const [openCancelar, setOpenCancelar] = React.useState(false);
    const [observacionCancelar, setObservacionCancelar] = React.useState('');

    const [noData, setNoData] = useState(false);


    const handleClickOpenCerrar = (item:any) => {
        setObservacionCierre('');
        setErrorForm('');
        setSelectedItem(item);
        setOpenCerrar(true);
    };

    const handleCloseCerrar = () => {
        setOpenCerrar(false);
    }

    const handleCerrar = async () => {
        if (observacionCierre === ''){
            setErrorForm('La observación es requerida');
        }

        const dataGet = { 
            Id: selectedItem?.Id.toString(),
            Motivo: observacionCierre
          };
        try{
            const responsePost = await axios.put('/CerrarClase',  dataGet );
            if (responsePost.data.length > 0){
                enqueueSnackbar('Guardado con éxito', { anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'default'})
            }
            onGuardar();
            setOpenCerrar(false);
        }
        catch (error) {
            enqueueSnackbar('Hubo un error al guardar', {anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'error', autoHideDuration: 7000 })
        }
    };

    const handleClickOpenCancelar = (item:any) => {
        setObservacionCancelar('');
        setErrorForm('');
        setSelectedItem(item);
        setOpenCancelar(true);
    };

    const handleCloseCancelar = () => {
        setOpenCancelar(false);
    }

    const handleCancelar = async () => {
        if (observacionCancelar === ''){
            setErrorForm('La observación es requerida');
        }

        const dataGet = { 
            Id: selectedItem?.Id.toString(),
            Motivo: observacionCancelar
          };
        try{
            const responsePost = await axios.put('/Cupo',  dataGet );
            if (responsePost.data.length > 0){
                enqueueSnackbar('Guardado con éxito', { anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'default'})
            }
            onGuardar();
            setOpenCancelar(false);
        }
        catch (error) {
            enqueueSnackbar('Hubo un error al guardar', {anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'error', autoHideDuration: 7000 })
            console.error(error);
        }
    };

    const handleClickOpenVer = (item:any) => {
        setObservacionCierre('');
        setSelectedItem(item);
        setOpenVer(true);
        buscarFicha(item.PcoId.toString());
    };

    const handleCloseVer = () => {
        setOpenVer(false);
    };

    const buscarFicha = async (PcoId: string) => {
        setLoading(true);
        try {
            const responsePost = await axios.post('/FichaAlumno', { Id: PcoId });
            if (responsePost.data.length > 0) {
                setFichaAlumno(responsePost.data);
            }
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            enqueueSnackbar('Hubo un error al obtener los datos', { anchorOrigin: { vertical: 'top', horizontal: 'center' }, variant: 'error', autoHideDuration: 7000 })
            console.error(error);
        }

    }

    useEffect(() => {
        setNoData(lista.length === 0);
    }, [lista])  

    return (
        <>
        {
            loading  && <SkeletonProductDetails />
            
        }
        <Divider variant="fullWidth" style={{borderStyle:'dashed'}} />
        {

            noData && !loading ? (
                    <EmptyContent
                        title='No hay'
                        sx={{
                            '& span.MuiBox-root': { height: 160 },
                        }}
                    />
            ):
            (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {lista?.map((dato: ITareasProfesor) => {
                        const fechaActual = format(new Date(), 'yyyy-MM-dd');
                        const fechaDato = format(new Date(dato.Fecha), 'yyyy-MM-dd');

                        const comparacion = (
                            new Date(fechaDato).setHours(0, 0, 0, 0) -
                            new Date(fechaActual).setHours(0, 0, 0, 0)
                        );
        

                        return (
                            <>
                            <Box sx={{display:'inline-flex'}}>
                                <Iconify
                                    icon="solar:calendar-bold"
                                    width={25}
                                    sx={{
                                        mt: 1,
                                    }}
                                />&nbsp;
                                <Typography variant="subtitle1"
                                    sx={{
                                        pt: 1.3,
                                    }}
                                >

                                    {dato.FechaTexto}
                                </Typography>
                                { comparacion === 0 && <Chip label='HOY' color='info' size="small" variant="filled" sx={{ ml:1, mt: 1.3, pt: 0.3}} /> } 
                            </Box>

                                    
                            {
                                dato.TareasMostrar.map((tarea: ITareasMostrar, index) => (
                                <>
                                    <ListItem key={index} alignItems="flex-start">
                                        <ListItemText
                                            primary={<Box>

                                                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', }}>
                                                    {
                                                        esCerrada ? tarea.NombreCliente : tarea.Descripcion
                                                    }
                                                </Typography>
                                                {
                                                    esCerrada && <Typography variant="subtitle1">{tarea.Descripcion}</Typography>
                                                }


                                                <Box sx={{ display: 'inline-flex' }}>
                                                    <Iconify
                                                        icon="grommet-icons:map"
                                                        width={20}
                                                        sx={{
                                                            mt: 1,
                                                        }}
                                                    />&nbsp;
                                                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', pt: 1 }}>
                                                        {
                                                            tarea.OtraDireccion !== '' ? `${tarea.DireccionCliente}, obs: ${tarea.OtraDireccion}`:
                                                            tarea.DireccionCliente
                                                        }
                                                    </Typography>
                                                </Box>

                                                </Box>}
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <Chip label={`Código ${tarea.CodigoCliente}`} color='primary' size="small" variant="filled" />&nbsp;
                                                        <Chip label={`${tarea.FechaHoraInicioTexto} - ${tarea.FechaHoraTerminoTexto}`} color='primary' size="small" variant="soft" />
                                                    </div>
                                                    {
                                                        !esCerrada && <ButtonGroup variant="outlined" aria-label="button group" size="small" sx={{ pt: 1.5 }}>
                                                        {
                                                            tarea.PuedeCerrar && <Button color="secondary" onClick={()=>handleClickOpenCerrar(tarea)}>{isDesktop ? 'Cerrar clase' : 'Cerrar'}</Button>
                                                        }
                                                        {
                                                            tarea.PuedeCancelar &&  <Button color="warning" onClick={()=>handleClickOpenCancelar(tarea)}>{isDesktop ? 'Cancelar clase' : 'Cancelar'}</Button>
                                                        }
                                                        <Button color="primary" onClick={()=>handleClickOpenVer(tarea)}>{isDesktop ? 'Ver ficha' : 'Ficha'}</Button>
                                                    </ButtonGroup>
                                                    }
  
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="fullWidth" component="li" /> 
                                </>

                                ))
                            }
                            </>
                        );
                    }


                    )}
                </List>
            )
        }



        
        
        <Dialog
            open={openVer}
            onClose={handleCloseVer}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
        >
            <DialogTitle id="alert-dialog-title">
                Alumnos del pack {selectedItem?.CodigoCliente} ({selectedItem?.NombreCliente})
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleCloseVer}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon  />
            </IconButton>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                <Grid container spacing={1} sx={{ mb: 1, pr: 5, pl: 0 }}>
                    {
                        
                        fichaAlummno?.map((alumno:any)=>(
                            <Grid item xs={12} md={6}>
                                <Card sx={{ minHeight: 70 }}>
                                    <List sx={{ bgcolor: 'background.default', width: '100%', }}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.light' }}>{alumno.NombreCompleto.charAt(0).toUpperCase()}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <Typography variant='subtitle2' sx={{ textTransform: 'capitalize' }}>
                                                            {alumno.NombreCompleto}
                                                        </Typography>
                                                        <Typography variant='body2'>
                                                            {alumno.Edad} años, acude a {alumno.DondeAcudir}, {alumno.NumeroEmergencia}, {alumno.Sexo}
                                                        </Typography>
                                                        {
                                                            alumno.CualesProblemasCardiacos !== '' && (<Typography variant="body2">Problemas cardiacos: {alumno.CualesProblemasCardiacos}</Typography>)
                                                        }
                                                        {
                                                            alumno.CualesProblemasMotores !== '' && (<Typography variant="body2">Problemas motores: {alumno.CualesProblemasMotores}</Typography>)
                                                        }
                                                        {
                                                            alumno.Observacion !== '' && (<Typography variant="body2">Observaciones: {alumno.Observacion}</Typography>)
                                                        }
                                                    </>
                                                }
                                                secondary={
                                                    <>
                                                        <Chip color={alumno.TieneAsma === 1 ? 'error' : 'default'} icon={<Iconify icon="healthicons:asthma-outline" />} label={alumno.TieneAsma === 0 ? 'Asma: No' : 'Asma: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                        <Chip color={alumno.TieneProblemasCardiacos === 1 ? 'error' : 'default'} icon={<Iconify icon="icon-park-twotone:electrocardiogram" />} label={alumno.TieneProblemasCardiacos === 0 ? 'Cardiacos: No' : 'Cardiacos: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                        <Chip color={alumno.TieneProblemasMotores === 1 ? 'error' : 'default'} icon={<Iconify icon="emojione-monotone:wheelchair-symbol" />} label={alumno.TieneProblemasMotores === 0 ? 'Probl. Motores: No' : 'Probl. Motores: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                    </>
                                                }

                                            />
                                        </ListItem>
                                    </List>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleCloseVer}>Cerrar</Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={openCerrar}
            onClose={handleCloseCerrar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
        >
            <DialogTitle id="alert-dialog-title">
                Cerrar la clase
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleCloseCerrar}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon  />
            </IconButton>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Grid container spacing={1} sx={{ mb: 1, pr: 0, pl: 0 }}>
                        <Grid item xs={12} md={6}>
                            <InfoClase
                                title="Datos de la clase"
                                cliente={selectedItem?.NombreCliente}
                                fechaTexto={selectedItem?.FechaTexto}
                                fechaInicioFin={`${selectedItem?.FechaHoraInicioTexto} - ${selectedItem?.FechaHoraTerminoTexto}`}
                            />
                            
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                sx={{mt: 0.8}}
                                id="outlined-basic"
                                label="Comentarios"
                                variant="outlined"
                                multiline rows={4}
                                required
                                fullWidth
                                helperText="Ingrese el comentario de la clase"
                                value={observacionCierre}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setObservacionCierre(event.target.value);
                                }}
                                error={observacionCierre === ''}
                            />
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" variant="contained" onClick={handleCloseCerrar}>No, volver</Button>
                <Button color="primary" variant="contained" onClick={handleCerrar} autoFocus>
                    Si, cerrar
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={openCancelar}
            onClose={handleCloseCancelar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
        >
            <DialogTitle id="alert-dialog-title">
                Cancelar la clase
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleCloseCancelar}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon  />
            </IconButton>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Grid container spacing={1} sx={{ mb: 1, pr: 0, pl: 0 }}>
                        <Grid item xs={12} md={6}>
                            <InfoClase
                                title="Datos de la clase"
                                cliente={selectedItem?.NombreCliente}
                                fechaTexto={selectedItem?.FechaTexto}
                                fechaInicioFin={`${selectedItem?.FechaHoraInicioTexto} - ${selectedItem?.FechaHoraTerminoTexto}`}
                            />
                            
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                sx={{mt: 0.8}}
                                id="outlined-basic"
                                label="Motivo"
                                variant="outlined"
                                multiline rows={4}
                                required
                                fullWidth
                                helperText="Ingrese el motivo del cierre de la clase"
                                value={observacionCancelar}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setObservacionCancelar(event.target.value);
                                }}
                                error={observacionCancelar === ''}
                            />
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" variant="contained" onClick={handleCloseCancelar}>No, volver</Button>
                <Button color="primary" variant="contained" onClick={handleCancelar} autoFocus>
                    Si, cancelar
                </Button>
            </DialogActions>
        </Dialog>
            
        </>

      );
}