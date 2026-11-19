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
import { putClient } from 'src/redux/slices/client';
// utils
import { fData } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { IClientAccountGeneral } from '../../@types/client';
// assets
import { countries, comunes } from '../../assets/data';


import Iconify from '../../components/iconify';
// components
import Label from '../../components/label';
import { CustomFile } from '../../components/upload';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFCuit,
  RHFRun,
  RHFAutocomplete,
} from '../../components/hook-form';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IClientAccountGeneral, 'avatarUrl'> {
    avatarUrl: CustomFile | string | null;
  }
  
  type Props = {
    isEdit?: boolean;
    currentUser?: IClientAccountGeneral;
    onBuscarEmail: () => void;
  };
  
  interface PreviewFile extends File {
    preview?: string;
  }

  export default function ClienteRegister({ isEdit = false, currentUser, onBuscarEmail }: Props) {
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
      }, []);

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

      return (
          <FormProvider methods={methods}>
              <Grid item xs={12} md={12}>
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
                          <RHFTextField name="email" label="Email" onChange={onBuscarEmail} />
                          <RHFTextField name="names" label="Nombres" />
                          <RHFTextField name="firstName" label="A. Paterno" />
                          <RHFTextField name="lastName" label="A. Materno" />
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

                  </Card>

              </Grid>

          </FormProvider>
      )

  }