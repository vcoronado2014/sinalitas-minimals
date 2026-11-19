import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import useResponsive from '../../hooks/useResponsive';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  
  const isDesktop = useResponsive('up', 'md');

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> User: Crear nuevo profesor</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Crear nuevo profesor"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            isDesktop ?
            {
              name: 'Profesores',
              href: PATH_DASHBOARD.user.list,
            }:
            {
              name: 'Profesores',
              href: PATH_DASHBOARD.user.cards,
            }
            ,
            { name: 'Nuevo profesor' },
          ]}
        />
        <UserNewEditForm />
      </Container>
    </>
  );
}
