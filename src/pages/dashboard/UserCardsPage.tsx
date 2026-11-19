import { useDispatch, useSelector } from 'src/redux/store';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import UserCardProfesor from 'src/sections/@dashboard/user/cards/UserCardProfesor';
// @mui
import { Container, Box, Button } from '@mui/material';
import Iconify from '../../components/iconify';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userCards } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
// import { UserCard } from '../../sections/@dashboard/user/cards';


// ----------------------------------------------------------------------

export default function UserCardsPage() {
  const { themeStretch } = useSettingsContext();
  const {
    users,
    count,
    isLoading
  } = useSelector((state) => state.user);

  return (
    <>
      <Helmet>
        <title> Listado Profesores</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Listado Profesores"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Profesores', href: PATH_DASHBOARD.user.root },
            { name: 'Cards' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Nuevo Profesor
            </Button>
          }
        />

        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >

          {users.map((user) => (
            <UserCardProfesor key={user.id} user={user} />
          ))}
        </Box>
      </Container>
    </>
  );
}
