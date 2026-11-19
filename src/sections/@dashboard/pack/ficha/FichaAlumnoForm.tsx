import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip, Divider, ListItemButton, ListItemIcon, ButtonGroup, Popover, Badge, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';

import { role, sexo, comunas, regiones, country } from 'src/_mock/assets';
import { useDispatch, useSelector } from 'src/redux/store';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import { getClientePack } from 'src/redux/slices/clientePack';
import { IProductoCodigoGrilla } from 'src/@types/productoCodigoGrilla';
import { IClientAccountGeneral } from 'src/@types/client';
import { IProfesorCupoGeneral } from 'src/@types/profesorCupo';
import { IAlumnos, IClientePackGeneral } from 'src/@types/clientePack';
import { isSameDay, isSameMonth, getYear, isBefore, compareAsc } from 'date-fns';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import Iconify from '../../../../components/iconify';

// locales
import { useLocales } from '../../../../locales';
import { useSnackbar } from '../../../../components/snackbar';

import axios from '../../../../utils/axios';
import { fDate } from '../../../../utils/formatTime';
import { HOST_PHOTO } from '../../../../config-global';
import AppWelcomeNew from '../../general/app/AppWelcomeNew';
import PackTransferCuposClientes from '../transfer/PackTransferCuposClientes';
import FormProvider, {
    RHFSelect,
    RHFSwitch,
    RHFTextField,
    RHFUploadAvatar,
    RHFCuit,
    RHFRun,
    RHFAutocomplete,
  } from '../../../../components/hook-form';


  interface FormValuesProps extends IAlumnos {

  }

export interface AccordeonProps {
    pcoId: string;
    onGuardar: () => void;
    openInit?: boolean;
};

export default function FichaAlumnoForm (props: AccordeonProps){
    
    const { translate } = useLocales();
    const { enqueueSnackbar } = useSnackbar();

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
        observaciones: '',
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
    const [cantidadAlumnos, setCantidadAlumnos] = useState(0);

    const [title, setTitle] = useState('Crea la ficha del o los alumnos');

    const [valueTab, setValueTab] = useState('1');

    // alumnos
    const [alumnos, setAlumnos] = useState<IAlumnos[]>([]);
    const sexs = ['No informado', ...sexo ];


    const { pcoId, onGuardar, openInit } = props;

    // ************ table ************
    const TABLE_HEAD = [
        { id: 'Nombre', label: 'Nombre completo' },
        { id: 'NumeroEmergencia', label: 'Teléfono' },
        { id: 'Edad', label: 'Edad', align: 'center' },
        { id: 'Sexo', label: 'Sexo', align: 'left' },
    ];

    function getTable(){
        if (alumnos.length > 0){
            return (
                <>
                <TableContainer sx={{ mt: 3, overflow: 'unset' }}>
                    <Scrollbar>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHeadCustom headLabel={TABLE_HEAD} />
    
                            <TableBody>
                                {alumnos.map((row) => (
                                    <TableRow key={row.NombreCompleto}>
                                        <TableCell>{row.NombreCompleto}</TableCell>
                                        <TableCell>{row.NumeroEmergencia}</TableCell>
                                        <TableCell align="center">{row.Edad}</TableCell>
                                        <TableCell align="left">{row.Sexo}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer> 

                <Divider sx={{mb:1}} />  

                {/* <Stack alignItems="flex-end" sx={{ mt: 1 }}> */}
                    <Button type='button' variant='outlined' color='warning' onClick={clearTable} sx={{ mr: 1 }}>
                        Borrar
                    </Button>
                    <LoadingButton type="button" variant="outlined" color='primary' loading={isSubmitting} onClick={handleGuardar}>
                        Guardar
                    </LoadingButton>
                {/* </Stack> */}



                </>
            )
        }
        return (<></>)

    }

    const clearTable = () => {
        setAlumnos([]);
        reset();
    }

    // *******************************

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleGuardar = async () => {
        try {
            if (alumnos.length < cantidadAlumnos) {
                enqueueSnackbar(`Falta agregar ${cantidadAlumnos - alumnos.length} alumnos al pack`,
                    { anchorOrigin: { vertical: 'top', horizontal: 'center' }, variant: 'error' });
                return;
            }

            if (alumnos.length > 0) {
                setLoading(true);

                // Utilizar Promise.all para realizar llamadas a la API de forma simultánea
                await Promise.all(alumnos.map(async alumno => {
                    try {
                        const responsePost = await axios.put('/FichaAlumno', alumno);
                    } catch (error) {
                        console.error('Error al guardar alumno:', error);
                        // Manejar el error según sea necesario
                    }
                }));

                setLoading(false);

                // Luego de que todas las llamadas hayan terminado, ejecutar onGuardar() y setAlumnos([])
                onGuardar();
                setAlumnos([]);
            }
        } catch (error) {
            console.error('Error en handleGuardar:', error);
            // Manejar el error según sea necesario
        }

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

    const addAlumnos = async (data: FormValuesProps) => {

        const alumno = {
            CualesProblemasCardiacos: data.CualesProblemasCardiacos || '',
            CualesProblemasMotores: data.CualesProblemasMotores || '',
            DetalleAsma: '',
            DetalleProblemasCardiacos: data.CualesProblemasCardiacos || '',
            DetalleProblemasMotores: data.CualesProblemasMotores || '',
            DondeAcudir: data.DondeAcudir || '',
            Edad: data.Edad || 0,
            Id: 0,
            NombreCompleto: data.NombreCompleto,
            NumeroEmergencia: data.NumeroEmergencia || '',
            Observacion: data.Observacion || '',
            OtraEnfermedad: data.OtraEnfermedad || '',
            Sexo: data.Sexo || '',
            TieneAsma: data.TieneAsmaBool ? 1 : 0,
            TieneProblemasCardiacos: data.TieneProblemasCardiacosBool ? 1 : 0,
            TieneProblemasMotores: data.TieneProblemasMotoresBool ? 1 : 0,
            TieneAsmaBool: data.TieneAsmaBool,
            TieneProblemasCardiacosBool: data.TieneProblemasCardiacosBool,
            TieneProblemasMotoresBool: data.TieneProblemasMotoresBool,
            IdPack: pcoId.toString(),
        }

        setAlumnos([...alumnos, alumno]);

        // volvemos al tab 1

        setValueTab("1");
    }

    const getClientPack = useCallback(async () => {
        try {

            setAlumnos([]);

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

            // data.CuposMostrar = data.CuposMostrar.filter((item:any) => item.Cupos.some((cupo:any) => cupo.Cupo.EstadoCupo === 2));


            setClientePack(data);

            // seteamos la data de alumnos
            if (data.Alumnos){
                data.Alumnos.forEach((alumno: IAlumnos) => {
                    alumno.TieneAsmaBool = alumno.TieneAsma === 1;
                    alumno.TieneProblemasCardiacosBool = alumno.TieneProblemasCardiacos === 1;
                    alumno.TieneProblemasMotoresBool = alumno.TieneProblemasMotores === 1;
                });
            }

            setAlumnos(data.Alumnos);

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
            setCantidadAlumnos(data.ProductoCodigo.CantidadAlumnos ? data.ProductoCodigo.CantidadAlumnos : 0);
            

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
            setExpanded(false);
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

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValueTab(newValue);
    };

    const handleChangeCardiacos = (event: any) => {
        if (!event.target?.checked){
            setValue('CualesProblemasCardiacos', '');
        }
    };

    const handleChangeMotores = (event: any) => {
        if (!event.target?.checked){
            setValue('CualesProblemasMotores', '');
        }
    };


    // forms

    const NewUserSchema = Yup.object().shape({
        NombreCompleto: Yup.string().required('Nombre requerido'),
        // Edad: Yup.number().min(0).required('Mínimo 0'),
        Sexo: Yup.string().required('Sexo requerido'),
        DondeAcudir: Yup.string().required('Debes indicar donde acudir'),
        NumeroEmergencia: Yup.string().required('Debes indicar número urgencia'),

        // Precio: Yup.string().required('Precio is required'),
        // CantidadAlumnos: Yup.string().required('CantidadAlumnos is required'),
        // TopeClases: Yup.string().required('TopeClases is required'),
        // ValorClase: Yup.string().required('ValorClase is required'),
      });
    
      const defaultValues = useMemo(
        () => ({
            CualesProblemasCardiacos: '',
            CualesProblemasMotores: '',
            DetalleAsma: '',
            DetalleProblemasCardiacos: '',
            DetalleProblemasMotores: '',
            DondeAcudir: '',
            Edad: 0,
            Id: 0,
            NombreCompleto: '',
            NumeroEmergencia: '',
            Observacion: '',
            OtraEnfermedad: '',
            Sexo: '',
            TieneAsma: 0,
            TieneProblemasCardiacos: 0,
            TieneProblemasMotores: 0,
            TieneAsmaBool: false,
            TieneProblemasCardiacosBool: false,
            TieneProblemasMotoresBool: false,
        }),
        []
      );
    
      const methods = useForm<FormValuesProps>({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
      });
    
      const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
      } = methods;

      const values = watch();

      const onSubmit = async (data: FormValuesProps) => {
        try {
          addAlumnos(data);
          reset();  
        } catch (error) {
          console.error(error);
        }
      };

    return (


        <FormProvider methods={methods}  >
        <Accordion expanded={expanded} onChange={handleAccordionChange} sx={{mb: 1, pb: 2}}>
        
            <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{pb: 0, mb: 0}}
            >
                <Alert icon={false} sx={{width: '100%', pb: 0}} severity={openInit ? 'success' : 'error'}>
                    {
                        cantidadAlumnos === alumnos.length ? (
                            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>{title} (completada)</Typography>
                        ):
                        (
                            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase' }}>{title} ({cantidadAlumnos - alumnos.length})</Typography>
                        )
                    }
                    
                </Alert>
                    
            </AccordionSummary>
            
            <AccordionDetails>
                { clientePack?.ProductoCodigo.CantidadAlumnos !== alumnos.length && (
                    
                        <Box
                        sx={{
                            width: '100%',
                            typography: 'body1',
                            pl: 1,
                        }}>
                        
                            <TabContext value={valueTab}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="Alumno" value="1" />
                                        <Tab label="Médicos" value="2" />
                                    </TabList>

                                </Box>
                                <TabPanel value="1" sx={{ pl: 0 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={8}> 
                                            <RHFTextField name="NombreCompleto" label="Nombre completo" />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <RHFTextField name="Edad" label="Edad" type='number' />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <RHFSelect native name="Sexo" label="Sexo" placeholder="Sexo">
                                                <option value="" />
                                                {sexo.map((sex) => (
                                                    <option key={sex} value={sex}>
                                                        {sex}
                                                    </option>
                                                ))}
                                            </RHFSelect>
                                        </Grid>
                                        <Grid item xs={12} md={4}> 
                                            <RHFTextField name="DondeAcudir" label="Acudir a" />
                                        </Grid>
                                        <Grid item xs={12} md={3}> 
                                            <RHFTextField name="NumeroEmergencia" label="Teléfono urgencia" />
                                        </Grid>
                                        <Grid item xs={12} md={5}> 
                                            <RHFTextField name="Observacion" label="Observaciones" />
                                        </Grid>

                                    </Grid>
                                </TabPanel>
                                <TabPanel value="2" sx={{ pl: 0 }}>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={4}>
                                            <RHFSwitch
                                                name="TieneProblemasCardiacosBool"
                                                label="¿Tiene problemas cardiacos?"
                                                labelPlacement="start"
                                                onClick={handleChangeCardiacos}
                                                sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={8}>
                                            <RHFTextField name="CualesProblemasCardiacos" label="¿Cuales problemas caridacos?"
                                             disabled={!values.TieneProblemasCardiacosBool}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={4}>
                                            <RHFSwitch
                                                name="TieneProblemasMotoresBool"
                                                label="¿Tiene problemas motores?"
                                                labelPlacement="start"
                                                onClick={handleChangeMotores}
                                                sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={8}>
                                            <RHFTextField name="CualesProblemasMotores" label="¿Cuales problemas motores?"
                                             disabled={!values.TieneProblemasMotoresBool}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={4}>
                                            <RHFSwitch
                                                name="TieneAsmaBool"
                                                label="¿Tiene asma?"
                                                labelPlacement="start"
                                                sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={8}>
                                            <RHFTextField name="OtraEnfermedad" label="¿Otra enfermedad?"
                                             
                                            />
                                        </Grid>
                                    </Grid>

                                </TabPanel>
                                <Stack alignItems="flex-end" sx={{ mt: 1 }}>
                                    <LoadingButton type="button" variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
                                        Agregar
                                    </LoadingButton>
                                </Stack>
                            </TabContext>
                        
                        </Box>
                    
                )}
                {
                    getTable()
                }

            </AccordionDetails>

        </Accordion>
        </FormProvider>
      ); 

}

