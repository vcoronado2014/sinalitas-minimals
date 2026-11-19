import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import ClientNewEditForm from '../../sections/@dashboard/client/ClientNewEditForm';

// ----------------------------------------------------------------------

export default function ClientEditPage() {
  const isDesktop = useResponsive('up', 'md');
  const { themeStretch } = useSettingsContext();

  const { name } = useParams();
  const location = useLocation();
  const queryParams = location.state;
  const currentUser = queryParams;

  return (
    <>
      <Helmet>
        <title> Editar Cliente</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Editar Cliente"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Clientes',
              href: PATH_DASHBOARD.client.list,
            },
            { name: currentUser?.name },
          ]}
        />

        <ClientNewEditForm isEdit currentUser={currentUser} />
      </Container>
    </>
  );
}