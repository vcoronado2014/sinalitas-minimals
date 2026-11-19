import { Link as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { Box, Grid, Link, Stack, Divider, Container, Typography, IconButton } from '@mui/material';
// routes
import { PATH_PAGE } from '../../routes/paths';
// _mock
import { _socials } from '../../_mock/arrays';
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'App SinAlitas',
    children: [
      { name: 'Acerca de', href: PATH_PAGE.about },
/*       { name: 'Contact us', href: PATH_PAGE.contact },
      { name: 'FAQs', href: PATH_PAGE.faqs }, */
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Términos y condiciones', href: '#' },
      { name: 'Políticas de privacidad', href: '#' },
    ],
  },
  {
    headline: 'Contacto',
    children: [
      { name: 'contacto@sinalitas.com', href: '#' },
      { name: '+569 97481243', href: '#' },
    ],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {

  const handleOpenSocial = (link : string) => {
    window.open(link, '_blank');
  }

  const { pathname } = useLocation();

  const isHome = pathname === '/';

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          © Derechos reservados
          <br /> made by &nbsp;
          <Link href="https://sinalitas.cl/" target='_blank'> sinalitas.cl </Link>
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider />

      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
          sx={{
            textAlign: {
              xs: 'center',
              md: 'left',
            },
          }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
          </Grid>

          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              Bienvenidos a la página de la app sin alitas, acá podrás revisar
               tus packs contratados, podrás ingresar como profesor/instructor
                y revisar tus tareas.
            </Typography>

            <Stack
              spacing={1}
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{
                mt: 5,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social) => (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <IconButton key={social.name} onClick={()=>handleOpenSocial(social.path)}>
                    <Iconify icon={social.icon} />
                  </IconButton>
                  <Typography variant="body2" align='center'>{social.name}</Typography>
                  {/* <Typography>label</Typography> */}
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              justifyContent="space-between"
              direction={{ xs: 'column', md: 'row' }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      to={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 10,
            pb: 5,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © 2023. Todos los derechos reservados
        </Typography>
      </Container>
    </Box>
  );

  // return isHome ? simpleFooter : mainFooter;
  return mainFooter;
}
