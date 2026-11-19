import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import ProfileCoverClient from 'src/sections/@dashboard/user/profile/ProfileCoverClient';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import PackNewEditForm from '../../sections/@dashboard/client/PackNewEditForm';


// ----------------------------------------------------------------------

export default function PackCreatePage() {
  const isDesktop = useResponsive('up', 'md');
  const { themeStretch } = useSettingsContext();

  const { name } = useParams();
  const location = useLocation();

  const queryParams = location.state;

  const currentUser = queryParams;

  return (
    <>
      <Helmet>
        <title> Crear Pack</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Crear Pack"
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
        <Card
            sx={{
                mb: 3,
                height: 280,
                position: 'relative',
            }}
        >
            <ProfileCoverClient
                client={currentUser}
            />
        </Card>



        <PackNewEditForm isEdit idCliente={currentUser.id}  />
      </Container>
    </>
  );
}