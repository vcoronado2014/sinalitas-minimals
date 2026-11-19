import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip, Divider, ListItemButton, ListItemIcon, ButtonGroup, Popover, Badge, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import { role, sexo, comunas, regiones, country } from 'src/_mock/assets';
import { useDispatch, useSelector } from 'src/redux/store';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import { getClientePack } from 'src/redux/slices/clientePack';
import { IProductoCodigoGrilla } from 'src/@types/productoCodigoGrilla';
import { IClientAccountGeneral } from 'src/@types/client';
import { IProfesorCupoGeneral } from 'src/@types/profesorCupo';
import { IClientePackGeneral } from 'src/@types/clientePack';
import { isSameDay, isSameMonth, getYear, isBefore, compareAsc } from 'date-fns';
import Iconify from '../../../../components/iconify';

// locales
import { useLocales } from '../../../../locales';

import axios from '../../../../utils/axios';
import { fDate } from '../../../../utils/formatTime';
import { HOST_PHOTO } from '../../../../config-global';
import AppWelcomeNew from '../../general/app/AppWelcomeNew';
import PackTransferCuposClientes from '../transfer/PackTransferCuposClientes';

// ******* dialog ********
export interface DialogProps {
    /* productoGrillaDialog?: IProductoCodigoGrilla; */
    clientePackDialog?: IClientePackGeneral;
    open: boolean;
    onClose: () => void;
    selectedCupo?: any;
    onGuardar: () => void;
};

function DialogAgenda (props: DialogProps) {
    const { translate } = useLocales();
    const { onClose, open, clientePackDialog, selectedCupo, onGuardar } = props;
    const handleClose = () => {
        onClose();
    };



    return (
        <Dialog onClose={handleClose} open={open} disableEscapeKeyDown fullScreen>
          <DialogTitle sx={{pt: 2, mr: 3}}>Agendando clases a {selectedCupo?.Profesor?.Nombres} {selectedCupo?.Profesor?.PrimerApellido}</DialogTitle>
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
              <CloseIcon />
            </IconButton>
          <DialogContent dividers>
            <DialogContentText>
              <AppWelcomeNew
                    title={translate('pack_information')}
                    description='Estos son los datos del pack, busca profesor con disponibilidad para agendar las clases de este pack.'
                    clientePack={clientePackDialog}
                    estaCompletado
                    isShort
              />
              <PackTransferCuposClientes 
                onClose={handleClose}
                onGuardar={onGuardar}
                clientePackDialog={clientePackDialog}
                selectedCupo={selectedCupo?.CuposProfesor}
                profId={selectedCupo?.Profesor?.Id.toString()}
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      );    
}

// ***********************

export interface AccordeonProps {
    pcoId: string;
    onGuardar: () => void;
    openInit: boolean;
/*     onClose: () => void; */
};

export default function DialogTransfer (props: AccordeonProps){
    const { translate } = useLocales();

    const [loading, setLoading] = useState(false);
    const [comId, setComId] = useState('');
    const initialClientAccount: IClientAccountGeneral = {
        id :  '',
        address:  '',
        avatarUrl: '',
        name:  '',
        city:  '',
        company: 'SinAlitas.cl',
        country:  'Chile',
        cover:  '',
        email:  '',
        firstName: '',
        lastName:  '',
        isDeleted:  false,
        names: '',
        phoneNumber: '',
        run:  '',
        sexo:  'Masculino',
        status: 'Inactivo',
        state:  '',
        observaciones: ''
      };
    const [profileClient, setProfileClient] = useState<IClientAccountGeneral>(initialClientAccount);
    const [clientePack, setClientePack] = useState<IClientePackGeneral>();
    
    const [estaAsignado, setEstaAsignado] = useState(false);
    const [estaCompleto, setEstaCompleto] = useState(false);
    const [profesorCupo, setProfesorCupo] = useState<IProfesorCupoGeneral[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedSemanas, setSelectedSemanas] = useState([]);
    const [selectedCuposMostrar, setSelectedCuposMostrar] = useState([]);
    const [selectedCupo, setSelectedCupo] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const [title, setTitle] = useState('Seleccione profesor');


    const { pcoId, onGuardar, openInit } = props;
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleGuardar = () =>{
        onGuardar();
    }

    const handleEmailClick = (mail: string) => {
        window.location.href = `mailto:${mail}`;
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, semanas:any) => {
        setAnchorEl(event.currentTarget);
        setSelectedSemanas(semanas);
    }; 

    const handleClickCpo = (event: React.MouseEvent<HTMLButtonElement>, cuposMostrar:any) => {
        setAnchorEl(event.currentTarget);
        setSelectedCuposMostrar(cuposMostrar);
    }; 
    
    const handleClickOpen = (profesor:any) => {
        setSelectedCupo(profesor);
        setOpenDialog(true);
    };

    const getClientPack = useCallback(async () => {
        try {
            setLoading(true);
            const responsePost = await axios.post('/ClientePaackProducto', { PcoId: pcoId });
            const data = responsePost.data;
            setComId(data.Cliente.ComId.toString());
            setProfileClient({
                id: data?.Cliente.Id.toString() || '',
                address: data?.Cliente.Direccion || '',
                avatarUrl: data?.Cliente.Sexo === 'Masculino' ? `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${2}.jpg` : `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${24}.jpg`,
                name: `${data?.Cliente.Nombres} ${data?.Cliente.PrimerApellido} ${data?.Cliente.SegundoApellido}` || '',
                city: data!.Cliente.ComId !== null ? comunas[data!.Cliente.ComId - 1] : '',
                company: 'SinAlitas.cl',
                country: data!.Cliente.PaiId !== null ? country[data!.Cliente.PaiId - 1] : 'Chile',
                cover: `https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_${(Math.floor(Math.random() * 24) + 1)}.jpg` || '',
                email: data?.Cliente.Email || '',
                firstName: data?.Cliente.PrimerApellido || '',
                lastName: data?.Cliente.SegundoApellido || '',
                isDeleted: data?.Cliente.Activo === 1 ? false : true || false,
                names: data?.Cliente.Nombres || '',
                phoneNumber: data?.Cliente.TelefonosContacto || '',
                run: data?.Cliente.Rut || '',
                sexo: data?.Cliente.Sexo || 'Masculino',
                status: data?.Cliente.Activo === 1 ? 'Activo' : 'Inactivo',
                state: data!.Cliente.RegId !== null ? regiones[Number(data!.Cliente.RegId) - 1] || '' : '',
                observaciones: data?.Cliente.Observaciones || '',
            })


            setClientePack(data);

            // si esta asignado
            setEstaAsignado(data.CuposTomados.length > 0);
            // si esta completo
            setEstaCompleto(data.CuposTomados.length === data.ProductoCodigo.CantidadClases);

            const response = await axios.post('/ProfesorCupo', { PcoId: pcoId, ComId: data.Cliente.ComId.toString() });
            if (response.data){
                response.data.forEach((cpo: any) => {
                    if (cpo.Profesor) {
                        let photo = '';
                        if (cpo.Profesor.Fotografia !== '') {
                            photo = `${HOST_PHOTO}${cpo.Profesor.Fotografia}`;
                        }
                        else {
                            // esto lo dejamos asi por mientras
                            // photo = profesor.Sexo === 'Masculino' ? `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${2}.jpg` : `https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_${24}.jpg`;
                            photo = `${HOST_PHOTO}no_foto.png`;
                        }
                        cpo.Profesor.Fotografia = photo;
                    }
                });
            }

            // ordenamos
            response.data.sort((a:any, b:any) => {
                const aLength = a.SemanasArr ? a.SemanasArr.length : 0;
                const bLength = b.SemanasArr ? b.SemanasArr.length : 0;
              
                return bLength - aLength;
              });

            response.data[0].CuposMostrar = response.data[0].CuposMostrar
            .filter((item:any) => item.Cupos.some((cupo:any) => cupo.Cupo.EstadoCupo === 2))
            .map((item:any) => ({
                ...item,
                Cupos: item.Cupos.filter((cupo:any) => cupo.Cupo.EstadoCupo === 2)
            }));

            setProfesorCupo(response.data);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }, [pcoId]);

    useEffect(() => {
        getClientPack();
    }, [getClientPack]);

    const handleAccordionChange = () => {
        if (!openInit){
            setTitle('Primero crea la ficha de alumnos');
            return;
        }
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const handleCloseDialog = () => {
        setSelectedCupo(undefined);
        setOpenDialog(false);
        getClientPack();
    };

    const open = Boolean(anchorEl);

    return (

        <>
        <Accordion expanded={openInit || expanded} onChange={handleAccordionChange} sx={{mb: 1}}>
        
                <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Alert icon={false} sx={{ width: '100%' }} severity={openInit ? 'success' : 'error'}>
                        <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>{title}</Typography>
                    </Alert>

                </AccordionSummary>
            
            <AccordionDetails>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {profesorCupo.map((cupo) => (
                        cupo.ProximosDias !== '' &&
                        <Grid item xs={12} md={estaAsignado ? 12 : 6} lg={estaAsignado ? 12 : 4}>
                            <Card sx={{ minHeight: estaAsignado ? 0 : 271 }}>
                                <List sx={{ bgcolor: 'background.default', width: '100%', }}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar alt="img" src={cupo.Profesor.Fotografia} />
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={<>
                                                <Typography variant='h6' sx={{ textTransform: 'capitalize' }}>{cupo.Profesor.Nombres} {cupo.Profesor.PrimerApellido} {cupo.Profesor.SegundoApellido}</Typography>
                                                <Chip icon={<Iconify icon="mdi:cellphone-settings" />} label={cupo.Profesor.TelefonosContacto} sx={{ mb: 1, pl: 1, mr: 1 }} />
                                                <Chip onClick={() => handleEmailClick(cupo.Profesor.Email)} clickable icon={<Iconify icon="mdi:email-edit" />} label={cupo.Profesor.Email} sx={{ mb: 1, pl: 1, }} />
                                            </>}
                                            secondary={!estaAsignado ? (
                                                <Alert severity={cupo.ProximosDias === '' ? 'error' : 'success'}>
                                                    {cupo.ProximosDias === '' ? cupo.Semanas : `${cupo.SemanasArr.filter((semana: any) => semana.DiasDisponibles > 0).length} semanas disponibles`}
                                                </Alert>)
                                                : (
                                                    <Alert severity={!estaCompleto ? 'error' : 'success'}>
                                                        {
                                                            // cupo.CuposMostrar.length > 0 === '' ? cupo.Semanas : `${cupo.SemanasArr.filter((semana: any) => semana.DiasDisponibles > 0).length} semanas disponibles`
                                                            estaCompleto ? `${clientePack?.CuposTomados.length} clases asignadas` : `Falta ${(clientePack?.ProductoCodigo.CantidadClases || 13 - cupo.CuposMostrar.length)} por asignar`}
                                                    </Alert>
                                                )} />
                                    </ListItem>

                                    <Divider />

                                    <ListItem sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <ButtonGroup variant="contained" aria-label="outlined primary button group" disabled={cupo.ProximosDias === ''}>
                                            {!estaCompleto ? (
                                                <>
                                                    <Button aria-describedby={cupo.IdControl} startIcon={<Iconify icon="carbon:view" />}
                                                        onClick={(event) => {
                                                            if (event) {
                                                                handleClick(event, cupo.SemanasArr);
                                                            }
                                                        } }
                                                    >Ver info</Button>
                                                    <Popover
                                                        id={cupo.IdControl}
                                                        open={open}
                                                        anchorEl={anchorEl}
                                                        onClose={handleClose}
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'center',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'center',
                                                        }}
                                                    >
                                                        <Alert severity='success' icon={false} onClose={handleClose}>
                                                            <List sx={{ width: '100%', }}>
                                                                {selectedSemanas?.map((cp: any, index) => (
                                                                    cp.DiasDisponibles > 0 && (
                                                                        <>
                                                                            <ListItem>
                                                                                <ListItemAvatar>
                                                                                    <Avatar sx={{ bgcolor: 'primary.light' }}>{index + 1}</Avatar>
                                                                                </ListItemAvatar>
                                                                                <ListItemText
                                                                                    primary={<Typography variant='h6'>{cp.SemanaString}</Typography>}
                                                                                    secondary={<>
                                                                                        <Chip icon={<Iconify icon="solar:calendar-bold" />} label={`${cp.DiasDisponibles} cupos disponibles`} sx={{ mb: 1, pl: 1, mr: 1 }} />
                                                                                        {cp.DiasAgendados > 0 && (
                                                                                            <Chip icon={<Iconify icon="solar:calendar-bold-duotone" />} label={`${cp.DiasAgendados} cupos utilizados`} sx={{ mb: 1, pl: 1, mr: 1 }} />
                                                                                        )}
                                                                                    </>} />

                                                                            </ListItem>
                                                                            <Divider />
                                                                        </>
                                                                    )
                                                                ))}
                                                            </List>
                                                        </Alert>


                                                    </Popover>
                                                </>
                                            ) :
                                                (
                                                    <>
                                                        <Button aria-describedby={cupo.IdControl} startIcon={<Iconify icon="carbon:view" />}
                                                            onClick={(event) => {
                                                                if (event) {
                                                                    handleClickCpo(event, cupo.CuposMostrar);
                                                                }
                                                            } }
                                                        >Proximas clases</Button>
                                                        <Popover
                                                            id={cupo.IdControl}
                                                            open={open}
                                                            anchorEl={anchorEl}
                                                            onClose={handleClose}
                                                            anchorOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                        >
                                                            <Alert severity='success' icon={false} onClose={handleClose}>
                                                                <List sx={{ width: '100%', }}>
                                                                    {clientePack?.CuposTomados.map((cp: any, index) => (<>
                                                                        <ListItem>
                                                                            <ListItemAvatar>
                                                                                <Avatar sx={{ bgcolor: compareAsc(new Date(cp.FechaHoraTermino), new Date()) === -1 ? 'primary.success' : 'primary.light' }}>{index + 1}</Avatar>
                                                                            </ListItemAvatar>
                                                                            <ListItemText
                                                                                primary={<Typography variant='h6'>{fDate(cp.FechaHoraInicio, 'dd \'de\' MMMM \'del\' yyyy')}</Typography>}
                                                                                secondary={<>
                                                                                    <Chip
                                                                                        icon={<Iconify icon="solar:calendar-bold" />}
                                                                                        label={`${fDate(cp.FechaHoraInicio, '\'De\' HH:mm')} a ${fDate(cp.FechaHoraTermino, 'HH:mm')}`} sx={{ mb: 1, pl: 1, mr: 1 }} />
                                                                                </>} />

                                                                        </ListItem>
                                                                        <Divider />
                                                                    </>
                                                                    ))}

                                                                </List>
                                                            </Alert>


                                                        </Popover>
                                                    </>
                                                )}
                                            {!estaCompleto && (
                                                <Button startIcon={<Iconify icon="solar:calendar-bold-duotone" />} onClick={() => handleClickOpen(cupo)}>Agendar</Button>
                                            )}


                                        </ButtonGroup>
                                    </ListItem>

                                </List>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </AccordionDetails>

        </Accordion>
        <DialogAgenda
                open={openDialog}
                onClose={handleCloseDialog}
                clientePackDialog={clientePack}
                onGuardar={onGuardar}
                /* productoGrillaDialog={productoGrilla} */
                selectedCupo={selectedCupo} />
        </>
      ); 

}

