import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Accordion, AccordionDetails, AccordionSummary, Alert, Badge, Box, Button, Card, Container, Grid, Paper, Stack, Typography } from '@mui/material';
// import from '@mui/icons-material/'

// redux
import { useDispatch, useSelector } from 'src/redux/store';


// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { Block } from 'src/sections/_examples/Block';
import SteeperPack from 'src/sections/_examples/mui/stepper/SteeperPack';

import StepperRegister from 'src/sections/register/SteeperRegister';
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


interface FormValuesProps  {
    codigoPack: any;
  }

export default function RegisterPage() {
    const isDesktop = useResponsive('up', 'md');
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

    const dispatch = useDispatch();

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
      } = methods;

      const onSubmit = async (data: FormValuesProps) => {
        console.log('data submit');
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
                      
                      <StepperRegister />

                  </Container>
              </FormProvider>

          </>
          );


}