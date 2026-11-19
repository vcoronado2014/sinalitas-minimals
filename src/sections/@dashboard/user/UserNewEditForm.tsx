import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { putUser, deleteUser } from 'src/redux/slices/user';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, Alert } from '@mui/material';
import { role, sexo, comunas, regiones } from 'src/_mock/assets';
import { useDispatch, useSelector } from 'src/redux/store';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { IUserAccountGeneral } from '../../../@types/user';
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

import UserTransferComunas from './transfer/UserTransferComunas';



// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserAccountGeneral, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  isEdit?: boolean;
  currentUser?: IUserAccountGeneral;
};

interface PreviewFile extends File {
  preview?: string;
}

export interface TransferDialogProps {
  open: boolean;
  selectedValue?: string;
  onClose: () => void;
  row?: IUserAccountGeneral;
}

function TransferDialog(props: TransferDialogProps) {
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const { onClose, selectedValue, open, row } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Comunas de {row?.name}</DialogTitle>
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
          <UserTransferComunas row={row || undefined} onClose={handleClose} />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default function UserNewEditForm({ isEdit = false, currentUser }: Props) {
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
    role: Yup.string().required('Role is required'),
    // avatarUrl: Yup.mixed().required('Avatar is required'),
    firstName: Yup.string().required('Apellido requerido'),
    names: Yup.string().required('Nombres requerido'),
    run: Yup.string().required('Run requerido'),
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
      zipCode: currentUser?.zipCode || '',
      avatarUrl: currentUser?.avatarUrl || null,
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      company: currentUser?.company || '',
      cuit: '',
      role: currentUser?.role || '',
      firstName: currentUser?.firstName || '',
      lastName:  currentUser?.lastName || '',
      names: currentUser?.names || '',
      run: currentUser?.run || '',
      sexo: currentUser?.sexo || '',
      id: currentUser?.id,
      comunasAsociadas: currentUser?.comunasAsociadas || [],
      comunasNoAsociadas: currentUser?.comunasNoAsociadas || ['Puente Alto'],

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
    const entidad: IUserAccountGeneral = {
      id: currentUser?.id || '0',
      avatarUrl: currentUser?.avatarUrl || '',
      name: currentUser?.name || '',
      address: data.address || '',
      city: data.city || '',
      company: currentUser?.company || '',
      comunasAsociadas: currentUser?.comunasAsociadas || [],
      comunasNoAsociadas: currentUser?.comunasAsociadas || [],
      country: data.country || 'Chile',
      cover: currentUser?.cover || '',
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      isDeleted: data.isDeleted || false,
      isVerified: true,
      names: data.names || '',
      phoneNumber: data.phoneNumber || '',
      role: data.role || 'Profesor',
      run: data.run || '',
      sexo: data.sexo || 'Masculino',
      status: data.status || 'Inactivo',
      textoComunas: currentUser?.textoComunas || '',
      state: data.state || '',
      userName: currentUser?.userName || '',
      zipCode: '',
    }
    return entidad;
  }

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const dataProcesar = transformEntidad(data);
      dispatch(putUser(dataProcesar, false, false));
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
                    <strong>Sólo el profesor puede cambiar su imagen</strong> <br />
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
                      Desactivar al Profesor
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

{/*             <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {
            !isEdit && <Alert severity="warning">No puede agregar comunas a este profesor hasta que lo hayas creado.
            < br/>
            Crea al profesor y en el listado agrega las comunas.
            </Alert>
          }
          
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
              {/* <RHFTextField name="name" label="Full Name" /> */}
              <RHFTextField name="names" label="Nombres" />
              <RHFTextField name="firstName" label="A. Paterno" />
              <RHFTextField name="lastName" label="A. Materno" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="phoneNumber" label="Celular" />
              {/* <RHFCuit name="cuit" label="CUIT" /> */}
              <RHFRun name="run" label="Run" disabled={isEdit} />

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

{/*               <RHFSelect native name="state" label="Región" placeholder="Región">
                <option value="" />
                {regiones.map((region) => (
                  <option 
                    key={region} 
                    value={region}
                    onSelect={() => handleChangeRegion(region)}
                    onChange={() => handleChangeRegion(region)}
                    >
                    {region}
                  </option>
                ))}
              </RHFSelect> */}

              <RHFAutocomplete
                name="state"
                label="Región"
                placeholder='Región'
                options={regiones.map((option) => option
                )}
              />          


              {/* <RHFTextField name="state" label="Región" /> */}
              
              <RHFAutocomplete
                name="city"
                label="Comuna"
                placeholder='Comuna'
                options={comunes.map((option) => option.label
                )}
              />    
              {/* <RHFTextField name="city" label="Comuna" /> */}
              <RHFTextField name="address" label="Dirección" />
              {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
              {/* <RHFTextField name="company" label="Company" /> */}
              {/* <RHFTextField name="role" label="Role" /> */}
              <RHFSelect native name="role" label="Rol" placeholder="Rol">
                <option value="" />
                {role.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="sexo" label="Sexo" placeholder="Sexo">
                <option value="" />
                {sexo.map((sex) => (
                  <option key={sex} value={sex}>
                    {sex}
                  </option>
                ))}
              </RHFSelect>
              {
                isEdit ? (
                  <Button variant='outlined' onClick={handleClickOpen} color='primary' startIcon={<Iconify icon="eva:edit-fill" />} >
                    {currentUser?.textoComunas}
                  </Button>
                ) : (
                  <></>
                )
              }

            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Crear profesor' : 'Guardar cambios'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <TransferDialog
        selectedValue={currentUser?.name}
        open={open}
        onClose={handleClose}
        row={isEdit ? currentUser : {
          address: '',
          id: '0',
          avatarUrl: '',
          city: '',
          company: '',
          comunasAsociadas: [],
          comunasNoAsociadas: [],
          country: 'Chile',
          cover: '',
          email: '',
          firstName: '',
          isDeleted: false,
          isVerified: true,
          lastName: '',
          name: '',
          names: '',
          phoneNumber: '',
          role: '',
          run: '',
          sexo: '',
          status: 'activo',
          textoComunas: 'Todas',
          userName: '',
          zipCode: '',
          state: ''
        }}
      /> 
    </FormProvider>
  );
}
