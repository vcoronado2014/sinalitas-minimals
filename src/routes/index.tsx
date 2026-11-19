import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import MainLayout from '../layouts/main';
import SimpleLayout from '../layouts/simple';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Auth
  LoginPage,
  RegisterPage,
  VerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  // Dashboard: General
  GeneralAppPage,
  // Dashboard: User
  UserListPage,
  UserEditPage,
  UserCardsPage,
  UserCreatePage,
  UserProfilePage,
  UserAccountPage,
  // dashboard: client
  ClientListPage,
  ClientEditPage,
  ClientCreatePage,
  PackEditPage,
  PackCreatePage,
  CalendarPage,
  //
  BlankPage,
  PermissionDeniedPage,
  //
  Page500,
  Page403,
  Page404,
  HomePage,
  Contact,
  MaintenancePage,

  //
  PackListPage,
  ClientePackEditPage,
  ClientsPage,
  AgendaProfesorListPage,
  MisClasesListPage,
  ClasesCerradasListPage,
  PackProfesorListPage,
  ReporteListPage,
  MiAgendaListPage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'cards', element: <UserCardsPage /> },
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserCreatePage /> },
            { path: ':name/edit', element: <UserEditPage /> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        },
        {
          path: 'client',
          children: [
            { path: 'list', element: <ClientListPage /> },
            { path: ':name/edit', element: <ClientEditPage /> },
            { path: 'new', element: <ClientCreatePage /> },
            { path: ':name/edit-pack', element: <PackEditPage /> },
            { path: ':name/create-pack', element: <PackCreatePage /> },
          ],
        },
        {
          path: 'pack',
          children: [
            { path: 'list', element: <PackListPage /> },
            { path: ':name/edit', element: <ClientePackEditPage /> },
          ],
        },
        {
          path: 'agenda',
          children: [
            { path: 'list', element: <AgendaProfesorListPage /> },
            { path: 'mis-clases', element: <MisClasesListPage /> },
            { path: 'cerradas', element: <ClasesCerradasListPage /> },
            { path: 'packs-profesor', element: <PackProfesorListPage /> },
            { path: 'mi-agenda', element: <MiAgendaListPage /> },
          ],
        },
        {
          path: 'reporte',
          children: [
            { path: 'list', element: <ReporteListPage /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
          ],
        },
        { path: 'calendar', element: <CalendarPage /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'clientsCode', element: <ClientsPage /> },
        { path: 'clientsRegister', element: <RegisterPage /> },
        { path: 'contact-us', element: <Contact /> },

      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
