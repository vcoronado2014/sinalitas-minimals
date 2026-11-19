import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import ClientePackNewEditForm from '../../sections/@dashboard/pack/ClientePackNewEditForm';

// ----------------------------------------------------------------------

export default function ClientePackEditPage() {
  const { user } = useAuthContext();
  const isDesktop = useResponsive('up', 'md');
  const { themeStretch } = useSettingsContext();

  const { name } = useParams();
  const location = useLocation();
  const queryParams = location.state;
  const currentUser = queryParams;

  return (
    <>
      <Helmet>
        <title> Editar Pack</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Editar pack"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            user?.RolId === 2 ? {
              name: 'Packs',
              href: PATH_DASHBOARD.pack.list
            } : {
              name: 'Packs',
              href: PATH_DASHBOARD.agenda.packsProfesor
            },
            { name: currentUser?.Id },
          ]}
        />

        <ClientePackNewEditForm isEdit productoGrilla={currentUser} />
      </Container>
    </>
  );
}