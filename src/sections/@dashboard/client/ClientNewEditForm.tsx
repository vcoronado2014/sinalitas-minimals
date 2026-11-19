import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { putUser, deleteUser } from 'src/redux/slices/user';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, Alert } from '@mui/material';
import { role, sexo, comunas, regiones } from 'src/_mock/assets';
import { useDispatch, useSelector } from 'src/redux/store';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import { putClient } from 'src/redux/slices/client';
// @mui
import { LoadingButton } from '@mui/lab';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { IClientAccountGeneral } from '../../../@types/client';
// assets
import { countries, comunes } from '../../../assets/data';


import Iconify from '../../../components/iconify';
// components
import Label from '../../../components/label';
import { CustomFile } from '../../../components/upload';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFCuit,
  RHFRun,
  RHFAutocomplete,
} from '../../../components/hook-form';






// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IClientAccountGeneral, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  isEdit?: boolean;
  currentUser?: IClientAccountGeneral;
};

interface PreviewFile extends File {
  preview?: string;
}



export default function ClientNewEditForm({ isEdit = false, currentUser }: Props) {
  const sexs = ['No informado', ...sexo ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loguedUser, setLoguedUser] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    // setSelectedValue(value);
  };

  const NewUserSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    // company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    // avatarUrl: Yup.mixed().required('Avatar is required'),
    firstName: Yup.string().required('Apellido requerido'),
    names: Yup.string().required('Nombres requerido'),
    sexo: Yup.string().required('Sexo requerido'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      avatarUrl: currentUser?.avatarUrl || null,
      status: currentUser?.status,
      company: currentUser?.company || '',
      cuit: '',
      firstName: currentUser?.firstName || '',
      lastName:  currentUser?.lastName || '',
      names: currentUser?.names || '',
      run: currentUser?.run || '',
      sexo: currentUser?.sexo || '',
      id: currentUser?.id,
      observaciones: currentUser?.observaciones || '',

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
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

  useEffect(() => {
    const userLogued = sessionStorage.getItem('USER_NAME') ? sessionStorage.getItem('USER_NAME') : '';
    setLoguedUser(userLogued);
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const transformEntidad = (data: FormValuesProps)=>{
    const entidad: IClientAccountGeneral = {
      id: currentUser?.id || '0',
      avatarUrl: currentUser?.avatarUrl || '',
      name: currentUser?.name || '',
      address: data.address || '',
      city: data.city || '',
      company: currentUser?.company || '',
      country: data.country || 'Chile',
      cover: currentUser?.cover || '',
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      isDeleted: data.isDeleted || false,
      names: data.names || '',
      phoneNumber: data.phoneNumber || '',
      run: data.run || '',
      sexo: data.sexo || 'Masculino',
      status: data.status || 'Inactivo',
      state: data.state || '',
      observaciones: data.observaciones || ''
    }
    return entidad;
  }

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const dataProcesar = transformEntidad(data);
      dispatch(putClient(dataProcesar, false, false));
      reset();  
      enqueueSnackbar(!isEdit ? 'Creado con éxito!' : 'Actualizado con éxito!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeRegion = (regName:string)=>{
    console.log('regiiion selecciionada ', regName);
  }

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      }) as PreviewFile;

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status === 'activo' ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                disabled
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <strong>Deshabilitado por el momento</strong> <br />
                    Permitidos *.jpeg, *.jpg, *.png, *.gif
                    <br /> Max {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {(isEdit && loguedUser !== currentUser?.run) && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'activo'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'inactivo' : 'activo')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Desactivar
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Desactivar al Cliente
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

          </Card>
        </Grid>

        <Grid item xs={12} md={8}>         
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
              <RHFTextField name="names" label="Nombres" />
              <RHFTextField name="firstName" label="A. Paterno" />
              <RHFTextField name="lastName" label="A. Materno" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="phoneNumber" label="Celular" />

              <RHFSelect native name="country" label="Country" placeholder="País">
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
                options={regiones.map((option) => option
                )}
              />          

              
              <RHFAutocomplete
                name="city"
                label="Comuna"
                placeholder='Comuna'
                options={comunes.map((option) => option.label
                )}
              />    


              <RHFTextField name="address" label="Dirección" />

              

              <RHFTextField name="observaciones" label="Obs. Dirección" sx={{}} />


              <RHFSelect native name="sexo" label="Sexo" placeholder="Sexo">
                <option value="" />
                {sexs.map((sex) => (
                  <option key={sex} value={sex}>
                    {sex}
                  </option>
                ))}
              </RHFSelect>

            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Crear cliente' : 'Guardar cambios'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

    </FormProvider>
  );
}
