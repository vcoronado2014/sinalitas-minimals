import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, FormControlLabel, Switch } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingButton } from '@mui/lab';

import { getToken, onMessage } from "firebase/messaging";
import { messaging } from 'src/firebase'
// routes
import { PATH_AUTH } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFCheckbox, RHFTextField } from '../../components/hook-form';
import { USE_FCM } from '../../config-global';


// ----------------------------------------------------------------------

type FormValuesProps = {
  userName: string;
  password: string;
  afterSubmit?: string;
  recuerdame: boolean;
};

export default function AuthLoginForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [tokenFcm, setTokenFcm] = useState('');
  const [checked, setChecked] = useState(false);

  const LoginSchema = Yup.object().shape({
    userName: Yup.string().required('userName is required'),
    password: Yup.string().required('Password is required'),
  });

  const storedUserName = localStorage.getItem('USER_NAME');
  const storedRecordarme = localStorage.getItem('RECORDARME');
  const recuerdame = storedRecordarme === 'true';
  const userName = storedUserName !== null && recuerdame ? storedUserName : '';

  const defaultValues = {
    userName,
    password: '',
    token: '',
    recuerdame,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const activarMensajes = async () => {
    if (USE_FCM) {
      try {
        const token = await getToken(messaging, {
          vapidKey: "BOnY7h-2BHR9pwZQQDUikcHKty4SBYpFLQy2nBFL3q_b1V7XwGmKfrVG0CO47OxRO18nM9npKnbE_4RLKsmpfoY"
        });
        setTokenFcm(token); // Puedes almacenar el token en el estado si es necesario
        return token;
      } catch (error) {
        return ''; // Si hay un error, devolver un token vacío o manejarlo según sea necesario
      }
    }
    else{
      return '';
    }

  }

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const token = await activarMensajes();

      await login(data.userName, data.password, token, checked);
      // activarMensajes();

    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    const recordarme = event.target.checked ? 'true' : 'false';
    localStorage.setItem('RECORDARME', recordarme);
  };

  useEffect(()=>{
    onMessage(messaging, message=>{
      enqueueSnackbar(message.notification?.title, {anchorOrigin:{vertical: 'top', horizontal: 'center'}, variant: 'default', persist: true})
    })
  }, [enqueueSnackbar])

  useEffect(()=>{
    const storedR = localStorage.getItem('RECORDARME');
    const recuerd = storedR === 'true';
    setChecked(recuerd);
  }, [])

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        {/* <RHFTextField name="email" label="Email address" /> */}
        <RHFTextField name="userName" label="User Name" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* <RHFCheckbox name="recuerdame" label="Recuerdame" sx={{ mt: 0 }} onChange={handleRecuerdame}  /> */}
        <FormControlLabel
                      control={
                        <Switch
                          name="recuerdame"
                          onChange={handleChange}
                          /* checked={defaultValues.recuerdame} */
                          /* checked={localStorage.getItem('RECORDARME') && localStorage.getItem('RECORDARME') === 'true' || false} */
                          checked={checked}
                        />
                      }
                      label="Recordarme"
                    />
        

      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
{/*         <Link
          component={RouterLink}
          to={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
