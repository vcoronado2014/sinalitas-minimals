import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
import axios from 'src/utils/axios';
import { IContador, IGraficoPack } from 'src/@types/indicadores';
import { PATH_DASHBOARD } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AppWidget,
  AppWidgetNew,
  AppWelcome,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets/illustrations';



// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const navigate = useNavigate();
  const [graficoPack, setGraficoPack] = useState<IGraficoPack>();
  const [contadorProfesores, setContadorProfesores] = useState<IContador>();
  const [contadorClientes, setContadorClientes] = useState<IContador>();
  const [contadorAgendados, setContadorAgendados] = useState<IContador>();
  const { user } = useAuthContext();

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const handleClickContadorProfesores = () =>{
    const url = user?.RolId === 3 ? PATH_DASHBOARD.agenda.packsProfesor : PATH_DASHBOARD.user.list;
    navigate(url);
  }

  const handleClickContadorClientes= () =>{
    const url = user?.RolId === 3 ? PATH_DASHBOARD.agenda.list : PATH_DASHBOARD.client.list;
    navigate(url);
  }

  const getIndicadores = useCallback(async () => {
    try {
      const profId = user?.RolId === 1 || user?.RolId === 2 ? '0' : user?.id.toString();
      const rolId = user?.RolId === 3 ? '0' : user?.RolId.toString(); 

      const response = await axios.post('/indicadores', { ProfId: profId, RolId: rolId });
      setGraficoPack(response.data.GraficoPack);
      setContadorProfesores(response.data.ContadorProfesores);
      setContadorClientes(response.data.ContadorClientes);
      setContadorAgendados(response.data.ContadorAgendados);
    } catch (error) {
      // setLoading(false);
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    getIndicadores();
  }, [getIndicadores]);


  const newSeriesData = graficoPack?.Series?.map(item => ({
    year: item.Nombre,
    data: [
      {
        name: 'Total',
        data: item.Datos,
      },
    ],
  })) || [];

  const newSeriesAgendados = contadorAgendados?.Series?.map(item => (
   
      {
        label: item.Label,
        value: item.Value,
      }
    
  )) || [];


  return (
    <>
      <Helmet>
        <title> General: App | Minimal UI</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Bienvenido de vuelta! \n ${user?.displayName}`}
              description="Toda tu información en el dashboard de sinalitas"
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              /* action={<Button variant="contained">Go Now</Button>} */
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <AppWidgetNew
                title={contadorProfesores?.Title || 'Profesores'}
                total={user?.RolId === 3 ? contadorProfesores?.Series[0]?.Value || 0 : contadorProfesores?.Total || 0}
                icon={user?.RolId !== 3 ? "fa6-solid:person-swimming" : "lucide:package"}
                usaPointer
                onLink={handleClickContadorProfesores}
              />
              
              <AppWidgetNew
                title={contadorClientes?.Title || 'Clientes'}
                total={contadorClientes?.Total || 0}
                icon={user?.RolId !== 3 ? "raphael:users" : "solar:calendar-bold-duotone"}
                color="info"
                usaPointer
                onLink={handleClickContadorClientes}
              />

            </Stack>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title={contadorAgendados?.Title || ''}
              chart={{
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                ],
                series: newSeriesAgendados,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title={graficoPack?.Title}
              subheader={graficoPack?.SubTitle}
              type='bar'
              chart={{
                categories: graficoPack?.Categorias.map(mes => mes.NombreCorto),
                series: newSeriesData
              }}
            />
          </Grid>

{/*           <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title="Packs"
              subheader="(+43%) than last year"
              type='bar'
              chart={{
                categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
                series: [
                  {
                    year: '2019',
                    data: [
                      { name: 'Total', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                    ],
                  },
                  {
                    year: '2020',
                    data: [
                      { name: 'Total', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    ],
                  },
                ],
              }}
            />
          </Grid> */}

{/*           <Grid item xs={12} lg={8}>
            <AppNewInvoice
              title="New Invoice"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid> */}


{/*           <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Active Users"
              percent={2.6}
              total={18765}
              chart={{
                colors: [theme.palette.primary.main],
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Installed"
              percent={0.2}
              total={4876}
              chart={{
                colors: [theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Downloads"
              percent={-0.1}
              total={678}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Current Download"
              chart={{
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.error.main,
                  theme.palette.warning.main,
                ],
                series: [
                  { label: 'Mac', value: 12244 },
                  { label: 'Window', value: 53345 },
                  { label: 'iOS', value: 44313 },
                  { label: 'Android', value: 78343 },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title="Area Installed"
              subheader="(+43%) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  {
                    year: '2019',
                    data: [
                      { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                      { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                    ],
                  },
                  {
                    year: '2020',
                    data: [
                      { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                      { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                    ],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppNewInvoice
              title="New Invoice"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated title="Top Related Applications" list={_appRelated} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors title="Top Authors" list={_appAuthors} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppFeatured list={_appFeatured} />
          </Grid> */}

        </Grid>

      </Container>
    </>
  );
}
