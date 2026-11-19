import * as Yup from 'yup';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'src/utils/axios';
import { useDispatch, useSelector } from 'src/redux/store';
import { putUser } from 'src/redux/slices/user';

import { HOST_PHOTO } from 'src/config-global';
import { IUserAccountGeneral } from 'src/@types/user';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// import { updateUser } from 'src/redux/slices/user';
// utils
import { fData } from '../../../../utils/formatNumber';
// assets
import { countries } from '../../../../assets/data';
// components
import { CustomFile } from '../../../../components/upload';
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../../components/hook-form';




// ----------------------------------------------------------------------

type FormValuesProps = {
  displayName: string;
  email: string;
  photoURL: CustomFile | string | null;
  phoneNumber: string | null;
  country: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  about: string | null;
  isPublic: boolean;
};

export default function AccountGeneral() {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { user, updateUser } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    /* displayName: Yup.string().required('Name is required'), */
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed().required('Avatar is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
/*     zipCode: Yup.string().required('Zip code is required'),
    about: Yup.string().required('About is required'), */
  });

  const defaultValues = {
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || null,
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    about: user?.about || '',
    isPublic: user?.isPublic || false,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

/*   const transformEntidad = (data: FormValuesProps)=>{
    const entidad: IClientAccountGeneral = {
      id: user?.id || '0',
      avatarUrl: user?.avatarUrl || '',
      name: `${user?.Nombres} ${user?.PrimerApellido} ${user?.SegundoApellido}` || '',
      address: data.address || '',
      city: data.city || '',
      company: user?.company || '',
      country: data.country || 'Chile',
      cover: user?.cover || '',
      email: data.email || '',
      firstName: user?.PrimerApellido || '',
      lastName: user?.SegundoApellido || '',
      isDeleted: user?.isDeleted || false,
      names: user?.Nombres || '',
      phoneNumber: data.phoneNumber || '',
      run: user?.Rut || '',
      sexo: user?.Sexo || 'Masculino',
      status: user?.status || 'Inactivo',
      state: user?.state || '',
    }
    return entidad;
  } */

  const transformEntidad = (data: FormValuesProps)=>{
    const entidad: any = {
      id: user?.id || '0',
      avatarUrl: user?.avatarUrl || '',
      name: `${user?.Nombres} ${user?.PrimerApellido} ${user?.SegundoApellido}` || '',
      address: data.address || '',
      city: user?.city || '',
      company: user?.company || '',
      comunasAsociadas: user?.comunasAsociadas || [],
      comunasNoAsociadas: user?.comunasAsociadas || [],
      country: data.country || 'Chile',
      cover: user?.cover || '',
      email: data.email || '',
      firstName: user?.PrimerApellido || '',
      lastName: user?.SegundoApellido || '',
      isDeleted: false,
      isVerified: true,
      names: user?.Nombres || '',
      phoneNumber: data.phoneNumber || '',
      role: user?.role || 'Profesor',
      run: user?.Rut || '',
      sexo: user?.Sexo || 'Masculino',
      status: user?.status || 'Inactivo',
      textoComunas: user?.textoComunas || '',
      state: data.state || '',
      userName: user?.Rut || '',
      zipCode: '',
      Activo: user?.Activo || 1,
      Codigo: user?.Codigo || '',
      ComId: user?.ComId,
      ComIdAsignada: user?.ComIdAsignada,
      NodId: user?.NodId,
      RegId: user?.RegId,
      RolId: user?.RolId,

    }
    return entidad;
  }

  const onSubmit = async (data: FormValuesProps) => {
    const dataProcesar = transformEntidad(data);
    try {
       dispatch(putUser(dataProcesar, false, false, true));
      // reset();  
      enqueueSnackbar('Guardado con éxito!');
    } catch (error) {
      console.error(error);
    }
  };

/*   const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const nombreArchivo = await handleFileUpload(file, user?.id);

      if (nombreArchivo !== ''){
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
  
        if (file) {
          setValue('photoURL', newFile, { shouldValidate: true });
        }

        enqueueSnackbar('Archivo guardado con éxito', { anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'default', autoHideDuration: 7000})
      }
      else{
        enqueueSnackbar('Hubo un error al guardar', {anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'error', autoHideDuration: 7000 })
      }

    },
    [setValue, enqueueSnackbar, user, handleFileUpload]
  ); */

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const handleFileUpload = async (fileUpload: File, profId: number) => {
        let nombreArchivo = '';
        try {
          const formData = new FormData();
          formData.append('file', fileUpload);

          const response = await axios.post(`/File?profId=${profId}`, formData);

          if (response.status === 200 && response.data !== '') {
            nombreArchivo = response.data;
            updateUser({ ...user, photoURL: `${HOST_PHOTO}${nombreArchivo}` });
          }

          // setMessage('Archivo cargado correctamente.');
        } catch (error) {
          // setMessage(`Error al cargar el archivo: ${error.message}`);
          console.log(error);
        }

        return nombreArchivo;
      };

      const nombreArchivo = await handleFileUpload(file, user?.id);

      if (nombreArchivo !== '') {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        if (file) {
          setValue('photoURL', newFile, { shouldValidate: true });
        }

        enqueueSnackbar('Archivo guardado con éxito', {
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          variant: 'default',
          autoHideDuration: 7000,
        });
      } else {
        enqueueSnackbar('Hubo un error al guardar', {
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          variant: 'error',
          autoHideDuration: 7000,
        });
      }
    },
    [setValue, enqueueSnackbar, user, updateUser]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
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
                  Permitidos *.jpeg, *.jpg, *.png, *.gif
                  <br /> tamaño max {fData(3145728)}
                </Typography>
              }
            />

{/*             <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            /> */}
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
              <RHFTextField name="displayName" label="Nombre completo" disabled />

              <RHFTextField name="email" label="Correo electrónico" />

              <RHFTextField name="phoneNumber" label="Teléfono" />

              <RHFTextField name="address" label="Dirección" disabled />

              <RHFSelect native name="country" label="País" placeholder="Country" disabled>
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="Región" disabled />

              <RHFTextField name="city" label="Ciudad" disabled />

              {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Guardar cambios
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
