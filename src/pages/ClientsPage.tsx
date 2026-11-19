import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Accordion, AccordionDetails, AccordionSummary, Alert, Badge, Box, Button, Card, Container, Grid, Paper, Stack, Typography } from '@mui/material';
// import from '@mui/icons-material/'

// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { useLocation } from 'react-router-dom';


// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import ProfileCoverMinClient from 'src/sections/@dashboard/pack/profile/ProfileCoverMinCliente';
import ProfileCoverMinProfesor from 'src/sections/@dashboard/pack/profile/ProfileCoverMinProfesor';
import { IEnvoltorioPackGeneral } from 'src/@types/envoltorioPack';
import CuposList from 'src/sections/@dashboard/pack/list/CuposList';
import { Block } from 'src/sections/_examples/Block';
import DialogTransfer from 'src/sections/@dashboard/pack/dialog/DialogTransfer';
import FichaAlumnoForm from 'src/sections/@dashboard/pack/ficha/FichaAlumnoForm';
import SteeperPack from 'src/sections/_examples/mui/stepper/SteeperPack';


import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from '../_mock/arrays';
import axios from '../utils/axios';

import { getEnvoltorioPack } from '../redux/slices/envoltorioPack';

// components
import ScrollProgress from '../components/scroll-progress';
import useResponsive from '../hooks/useResponsive';

// components
import { useSettingsContext } from '../components/settings';
import { useSnackbar } from '../components/snackbar';
// routes
import { PATH_PAGE } from '../routes/paths';
import FormProvider, {
  RHFTextField,
} from '../components/hook-form';
// sections
import {
  WidgetMinSummary
} from '../sections/@dashboard/general/analytics';





// ----------------------------------------------------------------------

interface FormValuesProps  {
  codigoPack: any;
}

export default function ClientsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const clientId = searchParams.get('clientId');

  const isDesktop = useResponsive('up', 'md');

  const [codigoPack, setCodigoPack] = useState('');
  const [pcoId, setPcoId] = useState('');
  const [errorPack, setErrorPack] = useState(false);
  const [messageErrorPack, setMessageErrorPack] = useState('');

  const [packSearch, setPackSearch] = useState<IEnvoltorioPackGeneral>();

  const [showInfo, setShowInfo] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const [tieneAgenda, setTieneAgenda] = useState(false);
  const [tieneAceptaCondiciones, setTieneAceptaCondiciones] = useState(false);
  const [tieneFichaAlumnos, setTieneFichaAlumnos] = useState(false);

  const [clasesFuturas, setClasesFuturas] = useState([]);
  const [clasesPasadas, setClasesPasadas] = useState([]);

  // dialog
  const [openDialog, setOpenDialog] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    codigoPack: Yup.string().required('Codigo requerido'),
  });

  const defaultValues = useMemo(
    () => ({
      codigoPack: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { themeStretch } = useSettingsContext();

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const limpiar = async ()=>{
    const fechaActual = new Date();
    setCodigoPack('');
    setPackSearch(undefined);
    setPcoId('');
    setTieneAgenda(false);
    setTieneAceptaCondiciones(false);
    setTieneFichaAlumnos(false);
    setClasesFuturas([]);
    setClasesPasadas([]);
    setMessageErrorPack('');
    setErrorPack(false);
    setShowInfo(false);
    setExpanded(false);
    reset();

  }

  const buscar = async (codigo: string) =>{
    try {
      const fechaActual = new Date();

      setCodigoPack(codigo);
      const responsePost = await axios.post('/Envoltorio', { Nombre:  codigo});


      const pack = responsePost.data;

      if (pack){
        setPackSearch(responsePost.data);
      }

      // dispatch(getEnvoltorioPack(data.codigoPack));
      setPcoId(responsePost.data.ProductoCodigo.Id.toString());

      setTieneAgenda(pack?.Cupos.length > 0);

      setTieneAceptaCondiciones(pack?.TieneAceptaCondiciones);

      setTieneFichaAlumnos(pack?.FichaAlumnos.length > 0);

        // Filtrar clases con FechaHoraInicio mayor a la actual
      const clasesFut = pack?.Cupos.filter(
        (clase:any) => new Date(clase.FechaHoraInicio) > fechaActual
      );

      // Filtrar clases con FechaHoraInicio menor a la actual
      const clasesPas = pack?.Cupos.filter(
        (clase:any) => new Date(clase.FechaHoraInicio) < fechaActual
      );

      setClasesFuturas(clasesFut);
      setClasesPasadas(clasesPas);


      if (pack?.Cliente.Id > 0){
        enqueueSnackbar('Redirigiendo');
        setMessageErrorPack('');
        setErrorPack(false);
        setShowInfo(true);
        setExpanded(true);

      }
      else{
        const message = `El código ${codigoPack} que ingresaste no existe. Contacta al administrador si no lo sabes.`
        enqueueSnackbar(message, {variant: 'error'});
        setMessageErrorPack(message);
        setErrorPack(true);
        setShowInfo(false);
        setExpanded(false);
      }

    } catch (error) {
      console.error(error);
      setMessageErrorPack('Error al obtener los datos.');
      setErrorPack(true);
      setShowInfo(false);
      setExpanded(false);
      enqueueSnackbar('Error al obtener los datos.', {variant: 'error'});
    }
  }

  const onSubmit = async (data: FormValuesProps) => {
    buscar(data?.codigoPack.toString());
  };

  const onAcepta = () => {
    buscar(codigoPack);
  }

  // ****** dialog *****

  const handleClickOpen = (profesor: any) => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // *******************
  const dispatch = useDispatch();

  const {
    pack,
    count,
    isLoading
  } = useSelector((state) => state.envoltorioPack);

  useEffect(() => {
    if (clientId) {
      const buscarCod = async () => {
        try {
          const fechaActual = new Date();
    
          setCodigoPack(clientId);
          const responsePost = await axios.post('/Envoltorio', { Nombre:  clientId});
    
          const packN = responsePost.data;
    
          if (packN){
            setPackSearch(responsePost.data);
          }
    
          // dispatch(getEnvoltorioPack(data.codigoPack));
          setPcoId(responsePost.data.ProductoCodigo.Id.toString());
    
          setTieneAgenda(packN?.Cupos.length > 0);
    
          setTieneAceptaCondiciones(packN?.TieneAceptaCondiciones);
    
          setTieneFichaAlumnos(packN?.FichaAlumnos.length > 0);
    
            // Filtrar clases con FechaHoraInicio mayor a la actual
          const clasesFut = packN?.Cupos.filter(
            (clase:any) => new Date(clase.FechaHoraInicio) > fechaActual
          );
    
          // Filtrar clases con FechaHoraInicio menor a la actual
          const clasesPas = packN?.Cupos.filter(
            (clase:any) => new Date(clase.FechaHoraInicio) < fechaActual
          );
    
          setClasesFuturas(clasesFut);
          setClasesPasadas(clasesPas);
    
          if (packN?.Cliente.Id > 0){
            enqueueSnackbar('Redirigiendo');
            setMessageErrorPack('');
            setErrorPack(false);
            setShowInfo(true);
            setExpanded(true);
    
          }
          else{
            const message = `El código ${clientId} que ingresaste no existe. Contacta al administrador si no lo sabes.`
            enqueueSnackbar(message, {variant: 'error'});
            setMessageErrorPack(message);
            setErrorPack(true);
            setShowInfo(false);
            setExpanded(false);
          }
    
        } catch (error) {
          console.error(error);
          setMessageErrorPack('Error al obtener los datos.');
          setErrorPack(true);
          setShowInfo(false);
          setExpanded(false);
          enqueueSnackbar('Error al obtener los datos.', {variant: 'error'});
        }
      };
      buscarCod();
    }
  }, [clientId, pack, enqueueSnackbar]);

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAccordionChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <>
      <Helmet>
        <title> Sin alitas app | Cliente</title>
      </Helmet>
      
      <ScrollProgress />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
          heading="Buscar pack"
          links={[
            {
              name: 'Inicio',
              href: PATH_PAGE.home,
            },
          ]}
        />
        <Grid container>

          <Grid item xs={12} md={4} sx={{mb: 2}}>
            <Card>
              <Alert severity="success" icon={false}>
                <Typography variant='h6'>
                  Estimado cliente
                </Typography>
                <Typography variant='body1'>
                  Ingrese el código proporcionado, el formato del código es 0-A/0/B, luego presione buscar para saber el estado del pack contratado o llenar los datos
                </Typography>
              </Alert>

            </Card>

          </Grid>

            <Grid item xs={12} md={8} sx={{ pl: 1, mb: 2 }}>
              <RHFTextField name="codigoPack" label="Código de pack" />

              {errorPack && <Alert severity="error" icon={false} sx={{mt: 1}}>
                <Typography variant='h6'>
                  No existe
                </Typography>
                <Typography variant='body1'>
                  {messageErrorPack}
                </Typography>
              </Alert>}

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} spacing={2}>
                <LoadingButton type="button" variant="contained" color='secondary' loading={isSubmitting} onClick={limpiar}>
                  Limpiar
                </LoadingButton>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Buscar pack
                </LoadingButton>
              </Stack>

            </Grid>

          {
            showInfo && (
              <Grid item xs={12} sx={{mb: 2}}>
                  <Accordion expanded={expanded} onChange={handleAccordionChange}>
                    <AccordionSummary
                      expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant='subtitle1' sx={{textTransform: 'uppercase'}}>Datos del pack {codigoPack}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                      {
                        !tieneAceptaCondiciones && (
                          <Stack spacing={3}>
                            <Block title="Condiciones del servicio">
                              <Paper
                                sx={{
                                  p: 3,
                                  width: '100%',
                                  boxShadow: (theme) => theme.customShadows.z8,
                                }}
                              >

                                <SteeperPack onAcepta={onAcepta} pcoId={pcoId} codigoPack={codigoPack} />

                              </Paper>
                            </Block>
                          </Stack>


                        )
                      }

                      {
                        packSearch?.FichaAlumnos.length === 0 && (
                          <FichaAlumnoForm 
                          pcoId={pcoId}
                          onGuardar={onAcepta}
                          openInit={tieneAceptaCondiciones}
                          />
                        )
                      }

                      {/* esto lo comentamos */}
{/*                       {
                        !tieneAgenda && (
                            <DialogTransfer 
                              pcoId={pcoId}
                              onGuardar={onAcepta}
                              openInit={tieneFichaAlumnos}
                            />
                        )
                      } */}

                      {
                        tieneAceptaCondiciones && 
                        <Grid container spacing={3}>

                          <Grid item xs={12} md={6}>
                            <Card
                              sx={{
                                height: isDesktop ? 242 : 242,
                                position: 'relative',
                              }}
                            >
                              <ProfileCoverMinClient client={packSearch?.Cliente} comuna={packSearch?.ComunaCliente} />
                            </Card>
                          </Grid>

                          <Grid item xs={12} sm={6} md={3}>
                            <WidgetMinSummary
                              title="Código Pack"
                              icon="noto:package"
                              subtitle={codigoPack}
                              sx={{ textTransform: 'uppercase' }}
                              color='info' />
                          </Grid>

                          <Grid item xs={12} sm={6} md={3}>
                            <WidgetMinSummary
                              title={packSearch?.FichaAlumnos.length === 0 ? 'por crear' : 'creada(s)'}
                              icon="uil:swimmer"
                              subtitle={packSearch?.FichaAlumnos.length === 0 ? `${packSearch?.ProductoCodigo.CantidadAlumnos} ficha(s)` : `${packSearch?.ProductoCodigo.CantidadAlumnos} ficha(s)`}
                              sx={{ textTransform: 'uppercase' }}
                              color={packSearch?.FichaAlumnos.length === 0 ? 'error' : 'secondary'}
                              useBadge={packSearch?.FichaAlumnos.length === 0}
                              textBadge=' ' />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Card
                              sx={{
                                height: isDesktop ? 242 : 242,
                                position: 'relative',
                              }}
                            >
                              <ProfileCoverMinProfesor
                                profesor={packSearch?.Profesor.Id > 0 ?
                                  packSearch?.Profesor :
                                  {
                                    Nombres: 'Sin profesor',
                                    TelefonosContacto: 'Aún no se asigna profesor'
                                  }} />
                            </Card>
                          </Grid>

                          {!tieneAgenda ?
                            (
                              <>
                                <Grid item xs={12} sm={6} md={3}>
                                  <WidgetMinSummary
                                    title='por agendar'
                                    icon="solar:calendar-bold-duotone"
                                    subtitle={`${packSearch?.ProductoCodigo.CantidadClases} clases`}
                                    sx={{ textTransform: 'uppercase' }}
                                    color='error'
                                    useBadge={packSearch?.Cupos.length === 0}
                                    textBadge=' ' />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <WidgetMinSummary
                                    title='condiciones del servicio'
                                    icon="solar:calendar-bold-duotone"
                                    subtitle={tieneAceptaCondiciones ? 'tiene' : 'falta'}
                                    sx={{ textTransform: 'uppercase' }}
                                    color={tieneAceptaCondiciones ? 'info' : 'error'}
                                    useBadge={!tieneAceptaCondiciones}
                                    textBadge=' ' />
                                </Grid>
                              </>
                            ) :
                            (
                              <>
                                <Grid item xs={12} md={6}>
                                  <CuposList title={`${packSearch?.ProductoCodigo.CantidadClases} clases`} list={packSearch?.Cupos} />
                                </Grid>
                              </>
                            )}

                        </Grid> 
                      }

                    </AccordionDetails>
                  </Accordion>
              </Grid>
            )
          }


        </Grid>
      </Container>
      </FormProvider>

    </>
  );
}