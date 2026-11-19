// @mui
import { styled } from '@mui/material/styles';
import { Typography, CardProps, Stack, Divider, Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, Card, Chip, Badge, Alert, AvatarGroup, Tooltip } from '@mui/material';
import { IClientePackGeneral } from 'src/@types/clientePack';
import Iconify from 'src/components/iconify';
// utils
import { deepOrange } from '@mui/material/colors';
import { bgGradient } from '../../../../utils/cssStyles';
import { fCurrency, fShortenNumber } from '../../../../utils/formatNumber';


const COLORS = ['secondary.light', 'secondary.light', 'info.light', 'primary.main', 'warning.light'];
const getRandomIndex = () => Math.floor(Math.random() * COLORS.length);

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  color: theme.palette.primary.darker,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const StyledBg = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: -1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: theme.palette.common.white,
  '&:before': {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -2,
    content: '""',
    opacity: 0.2,
    ...bgGradient({
      direction: '135deg',
      startColor: theme.palette.primary.light,
      endColor: theme.palette.primary.main,
    }),
  },
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
    title?: string;
    description?: string;
    clientePack?: IClientePackGeneral;
    estaCompletado?: boolean;
    isShort?: boolean;
}

export default function AppWelcomeNew({ title, description, clientePack, estaCompletado=false, isShort=false, ...other }: Props) {

    const rolId = sessionStorage.getItem('ROL_ID');
  return (
    <StyledRoot {...other}>
      
        <Stack
          flexGrow={1}
          justifyContent="center"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          sx={{
            pl: isShort ? 0 : 5,
            py: { xs: isShort ? 1 : 5, md: 0 },
            pr: { xs: isShort? 1 : 5, md: 0 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
        <Grid container>
          <Grid item xs={isShort ? 12 : 8}>
            <Typography paragraph variant="h4" sx={{ whiteSpace: 'pre-line', pt: isShort ? 0 : 2, pb: 0 }}>
              {title}
            </Typography>
          </Grid>
          {
            !isShort && (
              <Grid item xs={4}>
                <Alert severity={estaCompletado ? 'success' : 'error'} sx={{ fontWeight: 'bold', alignItems: 'center', float: 'right' }} >
                  {estaCompletado ? 'Agendado' : 'Sin agendar'}
                </Alert>

              </Grid>
            )
          }


        </Grid>


        {
          !isShort && (<><Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              mb: { xs: 1, xl: 2 },
            }}
          >
            {description}
          </Typography><Divider /></>)
        }


          <Grid container sx={{ textAlign: 'center' }}>
            <Grid item xs={6} md={rolId === '2' ? 3 : 4} sx={{
              p: 1,
            }}>
              <Typography variant={isShort ? 'body1': 'h6'}>
                {isShort ? 'Código':'Código Pack'}
              </Typography>
              <Typography variant='subtitle1'>
                {clientePack?.ProductoCodigo.CodigoCliente}
              </Typography>

            </Grid>
            <Grid item xs={6} md={rolId === '2' ? 3 : 4} sx={{
              p: 1,
              borderLeftWidth: 1,
              borderLeftStyle: 'dashed',
              borderLeftColor: 'divider'
            }}>
              <Typography variant={isShort ? 'body1': 'h6'}>
                {isShort ? 'Alumnos':'N° de alumnos'}
              </Typography>
              <Typography variant='subtitle1'>
                {clientePack?.ProductoCodigo.CantidadAlumnos}
              </Typography>

            </Grid>
            <Grid item xs={6} md={rolId === '2' ? 3 : 4} sx={{
              p: 1,
              borderLeftWidth: 1,
              borderLeftStyle: 'dashed',
              borderLeftColor: 'divider'
            }}>
              <Typography variant={isShort ? 'body1': 'h6'}>
                {isShort ? 'Clases':'N° de clases'}
              </Typography>
              <Typography variant='subtitle1'>
                {clientePack?.ProductoCodigo.CantidadClases}
              </Typography>

            </Grid>
            {
              rolId === '2' &&             
              <Grid item xs={6} md={3} sx={{
              p: 1,
              borderLeftWidth: 1,
              borderLeftStyle: 'dashed',
              borderLeftColor: 'divider'
            }}>
              <Typography variant={isShort ? 'body1': 'h6'}>
                {isShort ? 'Total':'Total pack'}
              </Typography>
              <Typography variant='subtitle1'>
                {fCurrency(clientePack?.ProductoCodigo.TotalPack || 0)}
              </Typography>

            </Grid>
            }

          </Grid>

          <Typography variant='h6' sx={{ pb: 1 }}>
            Alumnos
          </Typography>

        {
          !isShort ? (
            <Grid container spacing={1} sx={{ mb: 1, pr: 5, pl: 0 }}>
              {
              clientePack?.Alumnos.map((alumno) => (
              <Grid item xs={12} md={6}>
                <Card sx={{ minHeight: 70 }}>
                  <List sx={{ bgcolor: 'background.default', width: '100%', }}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>{alumno.NombreCompleto.charAt(0).toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <Typography variant='subtitle2' sx={{ textTransform: 'capitalize' }}>
                              {alumno.NombreCompleto}
                            </Typography>
                            <Typography variant='body2'>
                              {alumno.Edad} años, acude a {alumno.DondeAcudir}, {alumno.NumeroEmergencia}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Chip color={alumno.TieneAsma === 1 ? 'error' : 'default'} icon={<Iconify icon="healthicons:asthma-outline" />} label={alumno.TieneAsma === 0 ? 'Asma: No' : 'Asma: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                            <Chip color={alumno.TieneProblemasCardiacos === 1 ? 'error' : 'default'} icon={<Iconify icon="icon-park-twotone:electrocardiogram" />} label={alumno.TieneProblemasCardiacos === 0 ? 'Cardiacos: No' : 'Cardiacos: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                            <Chip color={alumno.TieneProblemasMotores === 1 ? 'error' : 'default'} icon={<Iconify icon="emojione-monotone:wheelchair-symbol" />} label={alumno.TieneProblemasMotores === 0 ? 'Probl. Motores: No' : 'Probl. Motores: Si'} sx={{ mt: 1, pl: 1, mr: 1 }} />
                          </>
                        }
                      />
                    </ListItem>

                  </List>
                </Card>
              </Grid>
              ))
              }
            </Grid>
          ) :
            (
              <Grid container spacing={1} sx={{ mb: 1, pr: 0, pl: 1 }}>
                <AvatarGroup max={6}>
                {clientePack?.Alumnos.map((alumno, index) => (
                  <>
                  <Tooltip title={`${alumno.NombreCompleto}, ${alumno.Edad.toString()} años.`} key={index}>
                    <Avatar 
                      sx={{ bgcolor: COLORS[getRandomIndex()]}}  
                      // sx={{ bgcolor: 'secondary.light'}}  
                      alt={`${alumno.NombreCompleto}, ${alumno.Edad.toString()} años.`}
                      >
                        {`${alumno.NombreCompleto.split(' ').map(word => word.charAt(0).toUpperCase()).join('')}`}
                        </Avatar>
                  </Tooltip>
                  
                  </>
                ))}
                </AvatarGroup>
              </Grid>
            )
        }



        </Stack>


      <StyledBg />
    </StyledRoot>
  );
}