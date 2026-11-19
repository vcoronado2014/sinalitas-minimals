import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  StepLabel,
  Typography,
  StepContent,
  Card,
  Grid,
  Stack,
  Alert,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
  ListSubheader
} from '@mui/material';
import { role, sexo, comunas, regiones } from 'src/_mock/assets';
import { useDispatch, useSelector } from 'src/redux/store';
import { LoadingButton } from '@mui/lab';
// @types
import { IFormPack } from 'src/@types/products';
import { IAlumnos } from 'src/@types/clientePack';
import { IClientAccountGeneral } from '../../@types/client';


// assets
import { countries, comunes } from '../../assets/data';

import snackbar, { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFCuit,
  RHFRun,
  RHFAutocomplete,
} from '../../components/hook-form';

// components
import LoadingScreen from '../../components/loading-screen';
import FichaAlumnoCliente from '../@dashboard/client/form/FichaAlumnoCliente';

import axios from '../../utils/axios';




interface FormValuesProps extends Omit<IClientAccountGeneral, 'avatarUrl'> {
  avatarUrl:  null;
}

interface FormValuesPropsPack extends IFormPack  {

}

// import ClienteRegister from './ClienteRegister'; 

// ----------------------------------------------------------------------

const steps = [
  {
    label: 'Select campaign settings',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: 'Create an ad group',
    description: 'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

export default function StepperRegister() {
  const sexs = ['No Informado', ...sexo ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loguedUser, setLoguedUser] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    const formData = watch();
    methods.trigger().then((isValid) => {
      // Puedes ejecutar la lógica que desees con los resultados de la validación
      if (isValid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        // Aquí puedes ejecutar la lógica de envío o cualquier otra acción
      } else {
        console.log('Formulario inválido');
      }
    });

  };
  const handleNextPack = () => {
    const formData = watchPack();
    methodsPack.trigger().then((isValidPack) => {
      // Puedes ejecutar la lógica que desees con los resultados de la validación
      if (isValidPack) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        // Aquí puedes ejecutar la lógica de envío o cualquier otra acción
      } else {
        console.log('Formulario inválido');
      }
    });

  };

  const onSubmit = async (data: any) => {
    // Lógica a ejecutar al enviar el formulario
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const clear = () =>{
    reset();
    setEmail('');
    setClient(null);
  }

  // ********* form user ***********

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<IClientAccountGeneral | null>(null);

  const NewUserSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email es requiredo').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Teléfono es requerido'),
    address: Yup.string().required('Dirección es requerida'),
    country: Yup.string().required('País es requerido'),
    // company: Yup.string().required('Company is required'),
    state: Yup.string().required('Región es requerido'),
    city: Yup.string().required('Ciudad es requerido'),
    // avatarUrl: Yup.mixed().required('Avatar is required'),
    firstName: Yup.string().required('Apellido requerido'),
    names: Yup.string().required('Nombres requerido'),
    sexo: Yup.string().required('Sexo requerido'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      country: '',
      state: '',
      city: '',
      avatarUrl: null,
      status: '',
      company: '',
      cuit: '',
      firstName:  '',
      lastName:  '',
      names: '',
      run: '',
      sexo: '',
      id: '0',
      observaciones:  '',

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

/*   const NewUserSchemaPack = Yup.object().shape({
    CantidadAlumnos: Yup.string().required('CantidadAlumnos is required'),
    
  }); */

  const NewUserSchemaPack = Yup.object().shape({
    CantidadAlumnos: Yup.string().required('CantidadAlumnos is required'),
    Pack: Yup.string()
    .test('non-zero', 'Debes seleccionar pack', (value) => {
      if (value === '0') {
        return false;
      }
      return true;
    })
    .required('Debes seleccionar pack'),
    Segmento: Yup.string()
    .test('non-zero', 'Debes seleccionar horario', (value) => {
      if (value === '0') {
        return false;
      }
      return true;
    })
    .required('Debes seleccionar horario'),
  });

  const defaultValuesPack = useMemo(
    () => ({
        CantidadAlumnos: 1,
        Pack: '0',
        Segmento: '0'
    }),
    []
  );


  const methodsPack = useForm<FormValuesPropsPack>({
    resolver: yupResolver(NewUserSchemaPack),
    defaultValues: defaultValuesPack,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  const {
    reset: resetPack,
    watch: watchPack,
    control: controlPack,
    setValue: setValuePack,
    handleSubmit: handleSubmitPack,
    formState: { isSubmitting: isSubmittingPack, errors: errorsPack, isValid: isValidPack },
  } = methodsPack;

  const values = watch();
  const valuesPack = watchPack();

  // ********************************

  const setValuesForm=( cliente : IClientAccountGeneral)=>{
    setValue('names', cliente.names);
    setValue('firstName', cliente.firstName);
    setValue('lastName', cliente.lastName);
    setValue('phoneNumber', cliente.phoneNumber);
    setValue('country', cliente.country);
    setValue('state', cliente.state);
    setValue('city', cliente.city);
    setValue('address', cliente.address);
    setValue('sexo', cliente.sexo);
    setValue('observaciones', cliente.observaciones);
  }

  const transformEntidad = (data: any)=>{
    const coverUrl = `https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_${3}.jpg`;
    let eliminado = false;
    if (data.Eliminado === 1){
      eliminado = true;
    }
    const entidad: IClientAccountGeneral = {
      id: data?.Id || '0',
      avatarUrl: '',
      name: `${data.Nombres} ${data.PrimerApellido} ${data.SegundoApellido}` || '',
      address: data?.Direccion || '',
      city: comunas[data.ComId - 1] || '',
      company: 'SinAlitas.cl' || '',
      country: data.PaiId === 1 ? 'Chile' : 'United States' || 'Chile',
      cover: coverUrl || '',
      email: data.Email || '',
      firstName: data.PrimerApellido || '',
      lastName: data.SegundoApellido || '',
      isDeleted: eliminado || false,
      names: data.Nombres || '',
      phoneNumber: data.TelefonosContacto || '',
      run: data.Rut || '',
      sexo: data.Sexo || 'Masculino',
      status: data.Activo === 1 ? 'activo' : 'inactivo' || 'Inactivo',
      state: regiones[data.RegId -1] || '',
      observaciones: data.Observaciones || ''
    }
    return entidad;
  }

  const handleBuscarEmail = async () => {
    if (values.email && values.email.length > 3) {
      setIsLoading(true);
      try {
        const responsePost = await axios.post('/Register', { Email: values.email });

        if (responsePost.data && responsePost.data !== '') {
          const searchUser = responsePost.data;
          const entidad = transformEntidad(searchUser);
          setClient(entidad);
          // datos obtenidos
          // mostrar modal o setear los datos
          setValuesForm(entidad);
          // setValue('names', searchUser.Nombres);
          // Segunda llamada a axios para obtener datos de la ficha de alumnos
          const responseFichaAlumnos = await axios.post('/FichaAlumnos', { ClieId: entidad.id });

          const alumnosFicha = responseFichaAlumnos.data;
          setAlumnos(alumnosFicha);

        }
        else {
          // no existe

        }
        setIsLoading(false);
      }
      catch (error) {
        console.log(error);
        enqueueSnackbar('Hubo un error al obtener los datos del cliente', { variant: 'error' })
        setIsLoading(false);
      }
    }
  }

  // ********* alumnos *****


  const CANTIDAD_ALUMNOS = [1,2,3,4]

  const PACKS_DISPONIBLES = [
    {
      label: 'Seleccione Pack',
      value: '0'
    },
    {
      label: 'Pack A, 3 veces por semana',
      value: '1'
    },
    {
      label: 'Pack B, 2 veces por semana',
      value: '2'
    },
  ]

  const HORARIO_CLASES = [
    {
      label: 'Seleccione Horario',
      value: '0'
    },
    {
      label: '9:00 a 9:45 Hrs (Horario económico)',
      value: '1'
    },
    {
      label: '10:15 a 11:00 Hrs (Horario económico)',
      value: '2'
    },
    {
      label: '11:30 a 12:15 Hrs (Horario económico)',
      value: '3'
    },
    {
      label: '13:00 a 13:45 Hrs (Horario premium)',
      value: '4'
    },
    {
      label: '14:15 a 15:00 Hrs (Horario premium)',
      value: '5'
    },
    {
      label: '15:30 a 16:15 Hrs (Horario premium)',
      value: '6'
    },
    {
      label: '16:45 a 17:30 Hrs (Horario premium)',
      value: '7'
    },
    {
      label: '18:00 a 18:45 Hrs (Horario premium)',
      value: '8'
    },
/*     {
      label: '19:15 a 20:00 Hrs (Horario económico)',
      value: 9
    }, */
  ]

  const DIAS_SEMANA = [
    {
      label: 'Lunes',
      value: 1,
      checked: false,
    },
    {
      label: 'Martes',
      value: 2,
      checked: false,
    },
    {
      label: 'Miércoles',
      value: 3,
      checked: false,
    },
    {
      label: 'Jueves',
      value: 4,
      checked: false,
    },
    {
      label: 'Viernes',
      value: 5,
      checked: false,
    },
    {
      label: 'Sábado',
      value: 6,
      checked: false,
    },
  ]

  const [cantAlumnosAgregar, setCantAlumnosAgregar] = useState(0);
  const [packAgregar, setPackAgregar] = useState(1);
  const [checked, setChecked] = useState([0]);
  const [alumnos, setAlumnos] = useState<IAlumnos[]>([]);
  // ***** alumnos agregados ********
  const [alumnosAgregados, setAlumnosAgregados] = useState<IAlumnos[]>([]);
  // ********************************


  const handleChangeCantAlumnos = (event: any)=>{

    // setCantAlumnosAgregar(event.target.value);
    // setAlumnosAgregados([]);
    // setCantAlumnosAgregar(event.target.value);
  }
  const handleChangePack = (event: any)=>{
    setValuePack('Pack', event.target.value);
    if (event.target.value === '0'){
      uncheckAll();
    }
    
  }
  const handleChangeHorario = (event: any)=>{
    setValuePack('Segmento', event.target.value);
    if (event.target.value === '0'){
      uncheckAll();
    }
  }

  const uncheckAll = () => {
    const updatedDiasSemana = diasSemana.map(dia => ({ ...dia, checked: false }));
    setDiasSemana(updatedDiasSemana);
  };
  


  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const [diasSemana, setDiasSemana] = useState(DIAS_SEMANA);


  const handleCheckboxChange = (index: number) => {
    const updatedDiasSemana = [...diasSemana];
    const newCheckedValue = !updatedDiasSemana[index].checked;
    const numChecked = updatedDiasSemana.filter(dia => dia.checked).length;
    const maxChecked = valuesPack.Pack === '1' ? 3 : 2;

    if (newCheckedValue && numChecked >= maxChecked) {
      enqueueSnackbar(`Se permite un máximo de ${maxChecked} días seleccionados`, { variant: 'error'});
      return; // No actualiza el estado si ya se alcanzó el máximo permitido
    }

    updatedDiasSemana[index].checked = newCheckedValue;
    setDiasSemana(updatedDiasSemana);
  };

  const clearPack = () =>{
    resetPack();
    valuesPack.CantidadAlumnos = 1;
    valuesPack.Pack = '0';
    valuesPack.Segmento = '0';
    uncheckAll();
  }

  function obtenerLabelPorValorPack(valor: string): string | undefined {
    const pack_buscar = PACKS_DISPONIBLES.find(pack => pack.value === valor);
    return pack_buscar ? pack_buscar.label : undefined;
  }

  function transformaEntero(valor: string): number | 0 {
    const retorno = parseInt(valor, 10) || 0;
    return retorno;
  }

  // ***********************

  return (
    <>
          <Stepper activeStep={activeStep} orientation="vertical">
              
                  <Step key="Primer paso">
                      <StepLabel
                          optional={client && client?.name ? <Typography variant="caption">{`Tu nombre: ${client?.name}, correo: ${client?.email}, dirección: ${client?.address}`}</Typography> : null}
                      >
                          Ingresa tus datos y del lugar donde necesitas las clases.
                      </StepLabel>
                      <StepContent>
                          {
                            isLoading ? <LoadingScreen/> :
                            <FormProvider methods={methods}>
                              <Grid item xs={12} md={12}>
                              <Alert severity="info" sx={{mb: 2}}>
                                Ingresa tus datos, en la dirección debes considerar donde se realizarán las clases.
                              Después de ingresar tu email el sistema validará si ya te encuentras registrado, si es así se mostrarán tus datos y si quieres 
                              los puedes actualizar.
                              <Typography variant='body2' sx={{fontWeight: 'bold'}}>Si ya completaste lo solicitado presiona el botón Siguiente</Typography> 
                              </Alert>
                                <Card sx={{ p: 3 }}>
                                  <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                      xs: 'repeat(1, 1fr)',
                                      sm: 'repeat(2, 1fr)',
                                    }}
                                  >
                                    <RHFTextField name="email" label="Email" autoComplete='off' onBlur={handleBuscarEmail} />
                                    <RHFTextField name="names" label="Nombres" />
                                    <RHFTextField name="firstName" label="A. Paterno" />
                                    <RHFTextField name="lastName" label="A. Materno" />
                                    <RHFTextField name="phoneNumber" label="Celular" />

                                    <RHFSelect native name="country" label="País" placeholder="País">
                                      <option value="" />
                                      {countries.map((country) => (
                                        <option
                                          key={country.code}
                                          value={country.label}
                                        >
                                          {country.label}
                                        </option>
                                      ))}
                                    </RHFSelect>


                                    <RHFAutocomplete
                                      name="state"
                                      label="Región"
                                      placeholder='Región'
                                      helperText="Región donde se solicita la clase."
                                      options={regiones.map((option) => option
                                      )}
                                    />


                                    <RHFAutocomplete
                                      name="city"
                                      label="Comuna"
                                      placeholder='Comuna'
                                      helperText="Comuna donde se solicita la clase."
                                      options={comunes.map((option) => option.label
                                      )}
                                    />


                                    <RHFTextField name="address" label="Dirección" helperText="Dirección donde se solicita la clase." />



                                    <RHFTextField name="observaciones" label="Obs. Dirección" sx={{}} helperText="Observación donde se solicita la clase." />


                                    <RHFSelect native name="sexo" label="Sexo" placeholder="Sexo">
                                      <option value="" />
                                      {sexs.map((sex) => (
                                        <option key={sex} value={sex}>
                                          {sex}
                                        </option>
                                      ))}
                                    </RHFSelect>

                                  </Box>

                                  <Stack  direction="row" sx={{ mt: 3 }}>
                                    <Button variant="outlined" onClick={clear}>
                                      Limpiar
                                    </Button>
                                    <Button variant="contained" onClick={handleNext} sx={{ marginLeft: 'auto' }}>
                                      Siguiente
                                    </Button>
                                  </Stack>


                                </Card>
                              </Grid>
                            </FormProvider>
                          }
                      </StepContent>
                  </Step>

                  <Step key="Segundo paso">
                      <StepLabel
                          optional={valuesPack.Pack !== '0' && valuesPack.CantidadAlumnos ? <Typography variant="caption">
                            {`N° de alumnos: ${valuesPack.CantidadAlumnos}, Tu pack de 9 clases: ${obtenerLabelPorValorPack(valuesPack.Pack)}`}
                          </Typography> : null}
                      >
                          Configura las clases a solicitar de acuerdo a tus necesidades
                      </StepLabel>
                      <StepContent>
                        <FormProvider methods={methodsPack}>
                          <Grid item xs={12} md={12}>
                            <Alert severity="info" sx={{mb: 2}}>
                              Ingresa los datos de los alumnos y las clases a solicitar.
                              <Typography variant='body2' sx={{fontWeight: 'bold'}}>Si necesitas corregir algo de los pasos anteriores, presiona el botón Atrás.</Typography> 
                              <Typography variant='body2' sx={{fontWeight: 'bold'}}>Si ya completaste lo solicitado presiona el botón Siguiente</Typography> 
                              </Alert>
                            <Card sx={{ p: 3 }}>
                              <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                  xs: 'repeat(1, 1fr)',
                                  sm: 'repeat(3, 1fr)',
                                }}
                              >
                              <RHFSelect native name="CantidadAlumnos" label="N° de alumnos" placeholder="N° de alumnos">
                                {CANTIDAD_ALUMNOS.map((cant) => (
                                  <option
                                    key={cant}
                                    value={cant}
                                  >
                                    {cant}
                                  </option>
                                ))}
                              </RHFSelect>

                              <RHFSelect native name="Pack" label="Seleccione pack de 9 clases" placeholder="Seleccione pack" onChange={handleChangePack}>
                                {PACKS_DISPONIBLES.map((product) => (
                                    <option
                                        key={product.value}
                                        value={product.value}
                                    >
                                        {product.label}
                                    </option>
                                ))}
                            </RHFSelect>    

                            <RHFSelect native name="Segmento" label="Horario de sus clases" placeholder="Horario de sus clases" onChange={handleChangeHorario}>
                              {HORARIO_CLASES.map((product) => (
                                <option
                                  key={product.value}
                                  value={product.value}
                                >
                                  {product.label}
                                </option>
                              ))}
                            </RHFSelect>             

                              </Box>
                              <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                  xs: 'repeat(1, 1fr)',
                                  sm: 'repeat(1, 1fr)',
                                }}
                              >

                                <List 
                                
                                  sx={{ width: '100%', bgcolor: 'background.paper',  }} 
                                  subheader={<ListSubheader>Seleccione días de la semana</ListSubheader>}
                                  >
                                  {diasSemana.map((dia: any, index) => (

                                    <>
                                      <ListItem 
                                        key={dia.value} 
                                        sx={{ display: 'inline-block', marginRight: 1, width: 'auto' }}
                                        
                                        >
                                        <ListItemButton role={undefined} 
                                        dense
                                        disabled={valuesPack.CantidadAlumnos === 0 || valuesPack.Pack === '0' || valuesPack.Segmento === '0'}
                                        onClick={() => handleCheckboxChange(index)}
                                        >

                                          <Checkbox
                                            id={`checkbox-${dia.value}`}
                                            checked={dia.checked}
                                            edge="start"
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': `checkbox-list-label-${dia.value}` }}
                                          />

                                          <ListItemText id={`checkbox-list-label-${dia.value}`}
                                            primary={<Typography variant='body2'>{dia.label}</Typography>}
                                          />
                                        </ListItemButton>
                                      </ListItem>
                                    </>

                                  ))}

                                </List>
                              </Box>

                              <Stack direction="row" sx={{ mt: 3 }}>
                                <Button variant="outlined" onClick={clearPack}>
                                  Limpiar
                                </Button>
                                <Button disabled={activeStep === 0} onClick={handleBack} sx={{ marginLeft: 1 }}>
                                  Atrás
                                </Button>
                                <Button variant="contained" onClick={handleNextPack} sx={{ marginLeft: 'auto' }}>
                                  Siguiente
                                </Button>

                              </Stack>
                            </Card>
                          </Grid>
                        </FormProvider>
                      </StepContent>
                  </Step>

                  <Step key="Tercer paso">
                      <StepLabel
                          optional={watchPack('CantidadAlumnos') ? <Typography variant="caption">Revisa aquí los alumnos agregados a tu pack</Typography> : null}
                      >
                          Agrega los alumnos que participarán en las clases.
                      </StepLabel>
                      <StepContent>
                        <Grid item xs={12} md={12}>
                          <Alert severity="info" sx={{ mb: 2 }}>{
                          `Si ya estás registrado en el sistema y alguna vez te ingresaron alumnos estos aparecerán disponibles para usar. Se encontrarán en la lista de 
                            Alumnos y al costado puedes presionar "Usar", si necesitas agregar uno distinto en la lista Alumnos agregados se encuentra el botón + Nuevo, 
                            puedes también editar al alumno que estás usando de tu lista, como también quitarlo y volverlo a agregar. Lo importante es que debes dejar la 
                            misma cantidad de alumnos en "Alumnos agregados" que la cantidad de alumnos que configuraste en tu pack.`}
                            <Typography variant='body2' sx={{fontWeight: 'bold'}}>Si necesitas corregir algo de los pasos anteriores, presiona el botón Atrás.</Typography> 
                            <Typography variant='body2' sx={{fontWeight: 'bold'}}>Si ya completaste lo solicitado presiona el botón Enviar Formulario</Typography> 
                          </Alert>
                          <FichaAlumnoCliente cantAlumnosAgregar={watchPack('CantidadAlumnos').toString()} alumnosFicha={alumnos} esPack={false}
                            limpiarAlumnos={setAlumnosAgregados} dataForm={
                              {
                                Id: watchPack('Pack'),
                                Nombre: '',
                                Descripcion: '',
                                Precio: 0,
                                CantidadAlumnos: watchPack('CantidadAlumnos'),
                                Eliminado: 0,
                                Activo: 1,
                                TopeClases: 9,
                                ValorClase: 0,
                                Descuento: '0',
                                TotalPack: '0',
                                CodigoCliente: '',
                                IdCliente: client?.id || '0',
                                ProId: '0',
                                CantidadClases: '9',
                                ClieId: client?.id || '0',
                                PorcentajeDescuento: '0',
                              }
                            }
                          />


                            <Stack direction="row" sx={{ mt: 3 }}>
                              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ marginLeft: 1 }}>
                                Atrás
                              </Button>
{/*                               <Button variant="contained" onClick={handleNext} sx={{ marginLeft: 'auto' }}>
                                Siguiente
                              </Button> */}

                            </Stack>
{/*                           <Box sx={{ mt: 3 }}>
                            <Button variant="contained" onClick={handleNext}>
                              Terminar
                            </Button>
                            <Button disabled={activeStep === 0} onClick={handleBack}>
                              Atrás
                            </Button>
                          </Box> */}
                        </Grid>
                      </StepContent>
                  </Step>
              
          </Stepper>

          {activeStep === 3 && (
              <Paper
                  sx={{
                      p: 3,
                      mt: 3,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                  }}
              >
                  <Typography paragraph>All steps completed - you&apos;re finished</Typography>
                  <Button onClick={handleReset}>Reset</Button>
              </Paper>
          )}

    </>
  );
}