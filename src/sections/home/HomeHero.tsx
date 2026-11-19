import { m, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import MenuPopover from 'src/components/menu-popover';
import { Button, Box, Link, Container, Typography, Stack, Grid, Rating, MenuItem, Divider } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_FIGMA_PREVIEW, PATH_FREE_VERSION, PATH_AUTH, PATH_PAGE } from '../../routes/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
import { textGradient, bgGradient } from '../../utils/cssStyles';
// config
import { HEADER } from '../../config-global';
// components
import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';
import { MotionContainer, varFade } from '../../components/animate';


// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
/*   backgroundImage: '/assets/images/fondo.png',
  height: 1 ,
  backgroundSize: '100% 100%',  */
  ...bgGradient({
    /* color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94), */
    /* imgUrl: '/assets/background/overlay_2.jpg', */
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.24 : 0.28),
    imgUrl: '/assets/images/fondo.png',

  }),
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    position: 'fixed',
  },
}));

const StyledDescription = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(15, 0),
  height: '100%',
}));

const StyledGradientText = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontFamily: "'Barlow', sans-serif",
  fontSize: `${64 / 16}rem`,
  textAlign: 'center',
  lineHeight: 1,
  padding: 0,
  marginTop: 8,
  marginBottom: 24,
  letterSpacing: 8,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 16}rem`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 480,
  height: 480,
  top: -80,
  right: -80,
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.08),
}));

// ----------------------------------------------------------------------

export default function HomeHero() {

  const isDesktop = useResponsive('up', 'md');

  const { scrollYProgress } = useScroll();

  const [hide, setHide] = useState(false);

  useEffect(
    () =>
      scrollYProgress.on('change', (scrollHeight) => {
        if (scrollHeight > 0.8) {
          setHide(true);
        } else {
          setHide(false);
        }
      }),
    [scrollYProgress]
  );

  const fondoUrl = '/assets/images/fondo.png';

  return (
    <>
      <StyledRoot sx={{ ...(hide && { opacity: 0 }) }}>
        <Container component={MotionContainer} sx={{ height: 1 }}>
          <Grid container 
            spacing={10} 
            sx={{ 
              height: 1 ,
/*               backgroundImage: `url(${fondoUrl})`, // Aplica la imagen de fondo
              backgroundSize: isDesktop ? '100% 100%': 'cover',  */
              }}>
{/*             <Grid item xs={12} md={6} sx={{ height: 1 }}>
              <Description />
            </Grid> */}

            <Grid item xs={12} md={12} sx={{ height: 1 }}>
              <Description />
            </Grid>

{/*             {isDesktop && (
              <Grid item xs={12} md={6}>
                <Content />
              </Grid>
            )} */}
          </Grid>
        </Container>

        {isDesktop && <StyledEllipseTop />}

        <StyledEllipseBottom />
      </StyledRoot>

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}

// ----------------------------------------------------------------------

function Description() {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  return (
    <StyledDescription>
      <m.div variants={varFade().in}>
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          Bienvenidos a <br />
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <StyledGradientText
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          SinAlitas
        </StyledGradientText>
      </m.div>
      <m.div variants={varFade().in}>
        <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ mb: 5 }}>
          <Stack alignItems="center" spacing={2}>
            <Button
              component={RouterLink}
              to={PATH_PAGE.clientsCode}
              color="inherit"
              size="large"
              variant="contained"
              startIcon={<Iconify icon="eva:flash-fill" width={24} />}
              sx={{
                bgcolor: 'text.primary',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                '&:hover': {
                  bgcolor: 'text.primary',
                },
              }}
            >
              Acceso clientes
            </Button>

{/*             <Button
              onClick={handleOpenPopover}
              color="inherit"
              size="large"
              variant="contained"
              startIcon={<Iconify icon="eva:flash-fill" width={24} />}
              sx={{
                bgcolor: 'text.primary',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                '&:hover': {
                  bgcolor: 'text.primary',
                },
              }}
            >
              Acceso clientes
            </Button>
 */}
          </Stack>
          <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="top-center" sx={{padding: 0}}>
            <MenuItem>
              <Button
                component={RouterLink}
                to={PATH_PAGE.clientsCode}
                color="inherit"
                size="large"
                variant="contained"
                startIcon={<Iconify icon="stash:pack-light" width={24} />}
                sx={{
                  bgcolor: 'text.secondary',
                  color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.400'),
                  '&:hover': {
                    bgcolor: 'text.secondary',
                  },
                  width: '100%'
                }}
              >
                Revisa tu Pack
              </Button>

            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem sx={{ color: 'error.main' }}>
              <Button
                component={RouterLink}
                to={PATH_PAGE.clientsRegister}
                color="inherit"
                size="large"
                variant="contained"
                startIcon={<Iconify icon="arcticons:classroom" width={24} />}
                sx={{
                  bgcolor: 'text.secondary',
                  color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.400'),
                  '&:hover': {
                    bgcolor: 'text.secondary',
                  },
                }}
              >
                Solicita tus clases
              </Button>
            </MenuItem>
          </MenuPopover>

          <Button
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="eva:external-link-fill" width={24} />}
            target="_parent"
            rel="noopener"
            href={PATH_AUTH.login}
            sx={{ borderColor: 'text.primary' }}
          >
            Acceso Profesor/Instructor
          </Button>
        </Stack>
      </m.div>
    </StyledDescription>
  );
}
// ----------------------------------------------------------------------

function Content() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 60 * 4,
    repeat: Infinity,
  } as const;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        mt: `${HEADER.H_MAIN_DESKTOP}px`,
      }}
    >
      <Stack component={m.div} variants={varFade().in} sx={{ width: 344, position: 'relative' }}>
        <Box
          component={m.img}
          animate={{ y: ['0%', '100%'] }}
          transition={transition}
          alt={`hero_${isLight ? 'light' : 'dark'}_1`}
          src={`/assets/images/home/hero_${isLight ? 'light' : 'dark'}_1.png`}
          sx={{ position: 'absolute' }}
        />
        <Box
          component={m.img}
          animate={{ y: ['-100%', '0%'] }}
          transition={transition}
          alt={`hero_${isLight ? 'light' : 'dark'}_1`}
          src={`/assets/images/home/hero_${isLight ? 'light' : 'dark'}_1.png`}
          sx={{ position: 'absolute' }}
        />
      </Stack>

      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{ width: 720, position: 'relative', ml: -2 }}
      >
        <Box
          component={m.img}
          animate={{ y: ['100%', '0%'] }}
          transition={transition}
          alt={`hero_${isLight ? 'light' : 'dark'}_2`}
          src={`/assets/images/home/hero_${isLight ? 'light' : 'dark'}_2.png`}
          sx={{ position: 'absolute' }}
        />
        <Box
          component={m.img}
          animate={{ y: ['0%', '-100%'] }}
          transition={transition}
          alt={`hero_${isLight ? 'light' : 'dark'}_2`}
          src={`/assets/images/home/hero_${isLight ? 'light' : 'dark'}_2.png`}
          sx={{ position: 'absolute' }}
        />
      </Stack>
    </Stack>
  );
}
