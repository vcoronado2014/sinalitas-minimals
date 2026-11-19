import { Suspense, lazy, ElementType } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
// export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
export const VerifyCodePage = Loadable(lazy(() => import('../pages/auth/VerifyCodePage')));
export const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPasswordPage')));
export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));

// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(lazy(() => import('../pages/dashboard/GeneralAppPage')));

// DASHBOARD: USER
export const UserProfilePage = Loadable(lazy(() => import('../pages/dashboard/UserProfilePage')));
export const UserCardsPage = Loadable(lazy(() => import('../pages/dashboard/UserCardsPage')));
export const UserListPage = Loadable(lazy(() => import('../pages/dashboard/UserListPage')));
export const UserAccountPage = Loadable(lazy(() => import('../pages/dashboard/UserAccountPage')));
export const UserCreatePage = Loadable(lazy(() => import('../pages/dashboard/UserCreatePage')));
export const UserEditPage = Loadable(lazy(() => import('../pages/dashboard/UserEditPage')));

// DASHBOARD: CLIENT
export const ClientListPage = Loadable(lazy(() => import('../pages/dashboard/ClientListPage')));
export const ClientEditPage = Loadable(lazy(() => import('../pages/dashboard/ClientEditPage')));
export const ClientCreatePage = Loadable(lazy(() => import('../pages/dashboard/ClientCreatePage')));
export const PackEditPage = Loadable(lazy(() => import('../pages/dashboard/PackEditPage')));
export const PackCreatePage = Loadable(lazy(() => import('../pages/dashboard/PackCreatePage')));

// DASHBOARD: PACK
export const PackListPage = Loadable(lazy(() => import('../pages/dashboard/PackListPage')));
export const ClientePackEditPage = Loadable(lazy(() => import('../pages/dashboard/ClientePackEditPage')));

// aca va eel reporte
// DASHBOARD: PACK
export const ReporteListPage = Loadable(lazy(() => import('../pages/dashboard/ReporteListPage')));

// DASHBOARD: AGENDA
export const AgendaProfesorListPage = Loadable(lazy(() => import('../pages/dashboard/AgendaProfesorListPage')));
export const MisClasesListPage = Loadable(lazy(() => import('../pages/dashboard/MisClasesListPage')));
export const ClasesCerradasListPage = Loadable(lazy(() => import('../pages/dashboard/ClasesCerradasListPage')));
export const PackProfesorListPage = Loadable(lazy(() => import('../pages/dashboard/PackProfesorListPage')));
export const MiAgendaListPage = Loadable(lazy(() => import('../pages/dashboard/MiAgendaListPage')));
// DASHBOARD: APP
export const CalendarPage = Loadable(lazy(() => import('../pages/dashboard/CalendarPage')));

// TEST RENDER PAGE BY ROLE
export const PermissionDeniedPage = Loadable(
  lazy(() => import('../pages/dashboard/PermissionDeniedPage'))
);

// BLANK PAGE
export const BlankPage = Loadable(lazy(() => import('../pages/dashboard/BlankPage')));

// MAIN
export const Page500 = Loadable(lazy(() => import('../pages/Page500')));
export const Page403 = Loadable(lazy(() => import('../pages/Page403')));
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const HomePage = Loadable(lazy(() => import('../pages/HomePage')));
export const ClientsPage = Loadable(lazy(() => import('../pages/ClientsPage')));
export const Contact = Loadable(lazy(() => import('../pages/ContactPage')));
export const MaintenancePage = Loadable(lazy(() => import('../pages/MaintenancePage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/RegisterPage')));



