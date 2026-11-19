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
import ClientNewEditForm from '../../sections/@dashboard/client/ClientNewEditForm';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  
  const isDesktop = useResponsive('up', 'md');

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> User: Crear nuevo cliente</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Crear nuevo cliente"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            
            {
              name: 'Clientes',
              href: PATH_DASHBOARD.client.list,
            }
            ,
            { name: 'Nuevo cliente' },
          ]}
        />
        <ClientNewEditForm isEdit={false} />
      </Container>
    </>
  );
}
