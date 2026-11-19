import * as Yup from 'yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, Alert, SelectChangeEvent, TableContainer, Table, TableBody, TableRow, TableCell, Divider, ListItem, ListItemAvatar, ListItemText, Chip, Avatar, List, Tab } from '@mui/material';
import { sexo } from 'src/_mock/assets';
import { useDispatch, useSelector } from 'src/redux/store';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import { getProducts, putProductoCodigo } from 'src/redux/slices/products';
import { getAlumnosCliente } from 'src/redux/slices/fichaAlumnos';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
// utils
import { fData } from 'src/utils/formatNumber';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// @types
import { IProducts } from 'src/@types/products';
import { IAlumnos } from 'src/@types/clientePack';

import Iconify from 'src/components/iconify';
// components
import Label from 'src/components/label';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFCuit,
  RHFRun,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axios from 'src/utils/axios';


interface FormValuesProps extends IAlumnos {

}

type Props = {
    cantAlumnosAgregar: string;
    alumnosFicha: IAlumnos[];
    limpiarAlumnos: React.Dispatch<React.SetStateAction<IAlumnos[]>>;
    /* dataForm: FormValuesProps; */
    dataForm: IProducts | null;
    esPack?: boolean;
};

export default function FichaAlumnoCliente({
    cantAlumnosAgregar, alumnosFicha, limpiarAlumnos, dataForm, esPack = true
    }: Props) {

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    // ***** alumnos agregados ********
    const [alumnosAgregados, setAlumnosAgregados] = useState<IAlumnos[]>([]);
    // ********************************

    // ***** alumnos agregados ********
    const [isEditForm, setIsEditForm] = useState(false);
    const [isNewForm, setIsNewForm] = useState(false);
    const [alumnoEditando, setAlumnoEditando] = useState<IAlumnos | undefined>();
    // ********************************        

    // ****  form ****
    const [valueTab, setValueTab] = useState('1');

    const NewUserSchema = Yup.object().shape({
        NombreCompleto: Yup.string().required('Nombre requerido'),
        Sexo: Yup.string().required('Sexo requerido'),
        DondeAcudir: Yup.string().required('Debes indicar donde acudir'),
        NumeroEmergencia: Yup.string().required('Debes indicar número urgencia'),
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
              if (parseInt(cantAlumnosAgregar, 10) === alumnosAgregados.length && isNewForm) {
                  enqueueSnackbar('No puede agregar más, llegó al limite del pack, elimina de la lista para continuar', { variant: 'error' });
                  return;
              }
              addAlumnos(data);
              reset();
          } catch (error) {
              console.error(error);
          }
      };

      const addAlumnos = async (data: FormValuesProps) => {

        const alumnoExistente = alumnosAgregados.find((alumno) => alumno.Id === alumnoEditando?.Id);

        const alumnoNuevo = {
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
            IdPack: dataForm?.Id,
        };
    
        if (isEditForm && alumnoExistente) {
            const updatedAlumnos = alumnosAgregados.map((alumno) =>
                alumno.Id === alumnoEditando?.Id ? { ...alumno, ...alumnoNuevo } : alumno
            );
            setAlumnosAgregados(updatedAlumnos);
        } else {
            setAlumnosAgregados([...alumnosAgregados, alumnoNuevo]);
        }

        // setAlumnosAgregados([...alumnosAgregados, alumno]);


        setValueTab("1");
        setIsEditForm(false);
    }

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

    const handleClickGuardar = async () => {

        if (esPack) {
            // guardar los cambios
            const responsePost = await axios.post('/Pack', {
                productoCodigo: dataForm,
                alumnos: alumnosAgregados
            });

            try {
                if (responsePost.statusText === 'OK') {
                    enqueueSnackbar('Pack guardado correctamente', { variant: 'success' });
                    navigate(PATH_DASHBOARD.pack.list);
                    // navigate(PATH_DASHBOARD.pack.edit)
                }
                else {
                    enqueueSnackbar(responsePost.data, { variant: 'error' });
                }
            }
            catch (error) {
                console.log(error);
                enqueueSnackbar('Hubo un error al guardar el pack, contacta al administrador', { variant: 'error' });
            }
        }
        else{
            console.log('estamos guardando una propuesta')
        }



    };
    // ***************


    const onGuardar = () => {
        console.log('guardar ficha ', alumnoEditando);
    }

    // ********* tabla de alumnos existentes *********

    const handleQuitarAlumno = (al:IAlumnos) =>{
        const nuevosAlumnos = alumnosAgregados.filter((alumno) => alumno !== al);
        setAlumnosAgregados(nuevosAlumnos);
    }
    const handleEditarAlumno = (al:IAlumnos) =>{
        setIsEditForm(true);
        setIsNewForm(false);
        setAlumnoEditando(al);
        // seteamos los valores del formulario con los datos de al
        setValue('NombreCompleto', al.NombreCompleto);
        setValue('Edad', al.Edad);
        setValue('Sexo', al.Sexo);
        setValue('DondeAcudir', al.DondeAcudir);
        setValue('NumeroEmergencia', al.NumeroEmergencia);
        setValue('Observacion', al.Observacion);
        setValue('TieneProblemasCardiacos', al.TieneProblemasCardiacos);
        setValue('TieneProblemasCardiacosBool', al.TieneProblemasCardiacosBool);
        setValue('TieneProblemasMotores', al.TieneProblemasMotores);
        setValue('TieneProblemasMotoresBool', al.TieneProblemasMotoresBool);
        setValue('TieneAsma', al.TieneAsma);
        setValue('TieneAsmaBool', al.TieneAsmaBool);
        setValue('OtraEnfermedad', al.OtraEnfermedad);
    }
    const handleNuevoAlumno = () =>{
        reset();
        setIsEditForm(true);
        setIsNewForm(true);
        setAlumnoEditando(undefined);

    }

    const handleUsarAlumno = (al:IAlumnos) =>{
        const alumnoExistente = alumnosAgregados.find((alumno) => alumno.NombreCompleto === al.NombreCompleto);

        if (!alumnoExistente && alumnosAgregados.length < parseInt(cantAlumnosAgregar, 10)) {
          // Agrega el alumno solo si no está presente y la cantidad actual es menor que cantAlumnosAgregar
          setAlumnosAgregados([...alumnosAgregados, al]);
          enqueueSnackbar(`Se agregó a ${al.NombreCompleto}`, { variant: 'success' });
        } else if (alumnosAgregados.length >= parseInt(cantAlumnosAgregar, 10)) {
          enqueueSnackbar('No se pueden agregar más alumnos.', { variant: 'error' });
        } else {
          enqueueSnackbar('El alumno ya está en la lista.', { variant: 'warning' });
        }
    }

    useEffect(() => {
        // Lógica para limpiar la lista de alumnos cuando se monte el componente o cuando cambien ciertas propiedades
        // limpiarAlumnos([]);
        setAlumnosAgregados([])
      }, [cantAlumnosAgregar]);

    // ****** guardado form editar familia ****
    const handleCancelarEditar = () =>{
        setIsEditForm(false);
        setAlumnoEditando(undefined);
        reset();
    }

    // **************************************** 
    function getTable(){
        if (alumnosFicha.length > 0) {
            return (
                <Card sx={{ p: 3}}>
                    <Typography variant='subtitle1'>Alumnos</Typography>
                    <List sx={{ width: '100%', }}>
                        {alumnosFicha?.map((alumno: any, index) => (

                            <>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.light' }}>{alumno.NombreCompleto.charAt(0).toUpperCase()}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant='body1'>{`${alumno.NombreCompleto}, Edad: ${alumno.Edad}, Número emergencia: ${alumno.NumeroEmergencia}, Acude a: ${alumno.DondeAcudir}`}</Typography>
                                                </Grid>
                                            </Grid>

                                        }
                                        secondary={

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <Chip size='small' color={alumno.TieneAsma === 1 ? 'error' : 'default'} icon={<Iconify icon="healthicons:asthma-outline" />} label={alumno.TieneAsma === 0 ? 'Asma: No' : 'Asma: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                    <Chip size='small' color={alumno.TieneProblemasCardiacos === 1 ? 'error' : 'default'} icon={<Iconify icon="icon-park-twotone:electrocardiogram" />} label={alumno.TieneProblemasCardiacos === 0 ? 'Cardiacos: No' : 'Cardiacos: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                    <Chip size='small' color={alumno.TieneProblemasMotores === 1 ? 'error' : 'default'} icon={<Iconify icon="emojione-monotone:wheelchair-symbol" />} label={alumno.TieneProblemasMotores === 0 ? 'Probl. Motores: No' : 'Probl. Motores: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                </Grid>
                                                <Grid item xs={12} md={6} container justifyContent="flex-end">
                                                    <Button size="small" variant="outlined" color='primary'
                                                        onClick={() => handleUsarAlumno(alumno)}
                                                    >
                                                        Usar
                                                    </Button>
                                                </Grid>

                                            </Grid>

                                        } />

                                </ListItem>
                                <Divider />
                            </>

                        ))}
                    </List> 
                </Card>

            )
        }
            return (<></>)

    }    
    
    function getTableAgregados(){
        if (alumnosAgregados.length > 0) {
            return (
                <Card sx={{ p: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
                        <Typography variant='subtitle1'>Alumnos agregados</Typography>
                        <Button variant="contained" color="info" size='small' 
                        disabled={alumnosAgregados.length === parseInt(cantAlumnosAgregar, 10)}
                        onClick={handleNuevoAlumno}
                        /* onClick={handlePopup} */
                        >
                            + Nuevo
                        </Button>
                    </Grid>
                    <List sx={{ width: '100%', }}>
                        {alumnosAgregados?.map((alumno: any, index) => (
                            
                                <>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'secondary.light' }}>{alumno.NombreCompleto.charAt(0).toUpperCase()}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant='body1'>{`${alumno.NombreCompleto}, Edad: ${alumno.Edad}, Número emergencia: ${alumno.NumeroEmergencia}, Acude a: ${alumno.DondeAcudir}`}</Typography>
                                                    </Grid>
                                                </Grid>
                                                
                                            }
                                            secondary={
                                                
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <Chip size='small' color={alumno.TieneAsma === 1 ? 'error' : 'default'} icon={<Iconify icon="healthicons:asthma-outline" />} label={alumno.TieneAsma === 0 ? 'Asma: No' : 'Asma: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                        <Chip size='small' color={alumno.TieneProblemasCardiacos === 1 ? 'error' : 'default'} icon={<Iconify icon="icon-park-twotone:electrocardiogram" />} label={alumno.TieneProblemasCardiacos === 0 ? 'Cardiacos: No' : 'Cardiacos: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                        <Chip size='small' color={alumno.TieneProblemasMotores === 1 ? 'error' : 'default'} icon={<Iconify icon="emojione-monotone:wheelchair-symbol" />} label={alumno.TieneProblemasMotores === 0 ? 'Probl. Motores: No' : 'Probl. Motores: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                                                    </Grid>
                                                    <Grid item xs={12} md={6} container justifyContent="flex-end">
                                                        <Button size="small" variant="outlined" color='error'
                                                            onClick={() => handleQuitarAlumno(alumno)}
                                                        >
                                                            Quitar
                                                        </Button>
                                                        <Button size="small" variant="outlined" color='secondary' sx={{ml: 1}}
                                                            onClick={() => handleEditarAlumno(alumno)}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </Grid>

                                                </Grid>
                                                
                                            } />

                                    </ListItem>
                                    <Divider />
                                </>
                            
                        ))}
                    </List>
                </Card>

            )
        }
            return (
                <Card sx={{ p: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
                        <Typography variant='subtitle1'>Alumnos agregados</Typography>
                        <Button variant="contained" color="info" size='small' 
                        /* disabled={alumnosAgregados.length === cantAlumnosAgregar} */
                        onClick={handleNuevoAlumno}
                        /* onClick={handlePopup} */
                        >
                            + Nuevo
                        </Button>
                    </Grid>
                </Card>
            )

    }        

        return (
            <>
                <Grid item xs={12}>
                    {
                        alumnosFicha.length > 0 &&
                        <>
                            <Grid item xs={12}>
                                <Alert severity="info">
                                    {`Existen ${alumnosFicha.length} alumno(s) ya registrados con anterioridad, puedes usar esos datos.`}
                                </Alert>
                            </Grid>
                            <Grid item xs={12}>
                                {getTable()}
                            </Grid>
                        </>
                    }
                </Grid>

                <Grid item xs={12}>
                    {
                        parseInt(cantAlumnosAgregar, 10) === 0 ?
                            <Alert severity="error">
                                Debes agregar alumno(s) al pack.
                            </Alert>
                            :
                            <Alert severity="info">
                                {`Debes agregar ${cantAlumnosAgregar} alumno(s) al pack.`}
                            </Alert>
                    }
                </Grid>
                {
                    isEditForm && 
                    <>
                        <Grid item xs={12} container>
                            <Typography> Editar</Typography>
                        </Grid>
                        <Grid item xs={12} container>
                            <FormProvider methods={methods}>
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
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 0.5, marginBottom: 1, marginRight: 3 }}>
                                            <Stack direction="row" spacing={1}>
                                                <Button size="small" variant="outlined" color='warning'
                                                    onClick={handleCancelarEditar}
                                                >
                                                    Cancelar
                                                </Button>
                                                <LoadingButton size="small" type="button" variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
                                                    Agregar
                                                </LoadingButton>
                                            </Stack> 
                                        </Box>

                                    </TabContext>

                                </Box>
                            </FormProvider>
                        </Grid>
                    </>
                }

            <Grid item xs={12}>
                {getTableAgregados()}
            </Grid>

            <Grid item xs={12}>
                      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                          <LoadingButton type="button" variant="contained" 
                          onClick={handleClickGuardar}
                          disabled={alumnosAgregados.length !== parseInt(cantAlumnosAgregar, 10)}
                          >
                              Enviar formulario
                          </LoadingButton>
                      </Stack>
                </Grid>  

            </>
        )

}