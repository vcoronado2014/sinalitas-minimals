// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';


// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  report: icon('ic_chart'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard, upXs: true, upMd: true },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'users',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        upXs: true,
        upMd: true,
        children: [
          /* { title: 'profile', path: PATH_DASHBOARD.user.profile }, */
          /* { title: 'cards', path: PATH_DASHBOARD.user.cards, upXs: true, upMd: false }, */
          {
            title: 'list', path: PATH_DASHBOARD.user.list, upXs: true, upMd: true
          },
          { title: 'create', path: PATH_DASHBOARD.user.new, upXs: true, upMd: true },
        ],
        roles: ['Supervisor'],
        caption: 'only_admin_can_see_this_item',
      },
      // client
      {
        title: 'clients',
        path: PATH_DASHBOARD.client.root,
        icon: ICONS.user,
        upXs: true,
        upMd: true,
        children: [
          {
            title: 'list', path: PATH_DASHBOARD.client.list, upXs: true, upMd: true
          },
          { title: 'create', path: PATH_DASHBOARD.client.new, upXs: true, upMd: true },
        ],
        roles: ['Supervisor'],
        caption: 'only_admin_can_see_this_item',
      },

      // packs
      {
        title: 'packs',
        path: PATH_DASHBOARD.pack.root,
        icon: ICONS.cart,
        upXs: true,
        upMd: true,
        children: [
          {
            title: 'list', path: PATH_DASHBOARD.pack.list, upXs: true, upMd: true
          },
        ],
        roles: ['Supervisor'],
        caption: 'only_admin_can_see_this_item',
      },
      // agenda
      {
        title: 'agenda',
        path: PATH_DASHBOARD.agenda.root,
        icon: ICONS.calendar,
        upXs: true,
        upMd: true,
        children: [
          {
            title: 'mi agenda', path: PATH_DASHBOARD.agenda.list, upXs: true, upMd: true
          },
          {
            title: 'mis clases', path: PATH_DASHBOARD.agenda.misClases, upXs: true, upMd: true
          },
          {
            title: 'clases cerradas', path: PATH_DASHBOARD.agenda.cerradas, upXs: true, upMd: true
          },
          {
            title: 'packs profesor', path: PATH_DASHBOARD.agenda.packsProfesor, upXs: true, upMd: true
          },
          {
            title: 'mi calendario', path: PATH_DASHBOARD.agenda.miAgenda, upXs: true, upMd: true
          },
        ],
        roles: ['Profesor'],
        caption: 'only_prof_can_see_this_item',
      },
      // packs
      {
        title: 'reporte',
        path: PATH_DASHBOARD.reporte.root,
        icon: ICONS.report,
        upXs: true,
        upMd: true,
        children: [
          {
            title: 'list', path: PATH_DASHBOARD.reporte.list, upXs: true, upMd: true
          },
        ],
        roles: ['Supervisor'],
        caption: 'only_admin_can_see_this_item',
      },

      // E-COMMERCE
/*       {
        title: 'ecommerce',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        upXs: true,
        upMd: true,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop, upXs: true, upMd: true },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView, upXs: true, upMd: true },
          { title: 'list', path: PATH_DASHBOARD.eCommerce.list, upXs: true, upMd: true },
          { title: 'create', path: PATH_DASHBOARD.eCommerce.new, upXs: true, upMd: true },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit, upXs: true, upMd: true },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout, upXs: true, upMd: true },
        ],
      }, */

      // INVOICE
/*       {
        title: 'invoice',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        upXs: true,
        upMd: true,
        children: [
          { title: 'list', path: PATH_DASHBOARD.invoice.list, upXs: true, upMd: true },
          { title: 'details', path: PATH_DASHBOARD.invoice.demoView, upXs: true, upMd: true },
          { title: 'create', path: PATH_DASHBOARD.invoice.new, upXs: true, upMd: true },
          { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit, upXs: true, upMd: true },
        ],
      }, */

      // BLOG
/*       {
        title: 'blog',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        upXs: true,
        upMd: true,
        children: [
          { title: 'posts', path: PATH_DASHBOARD.blog.posts, upXs: true, upMd: true },
          { title: 'post', path: PATH_DASHBOARD.blog.demoView, upXs: true, upMd: true },
          { title: 'create', path: PATH_DASHBOARD.blog.new, upXs: true, upMd: true },
        ],
      }, */
/*       {
        title: 'File manager',
        path: PATH_DASHBOARD.fileManager,
        icon: ICONS.folder,
        upXs: true,
        upMd: true,
      }, */
    ],
  },

  // APP
  // ----------------------------------------------------------------------
/*   {
    subheader: 'app',
    items: [
      {
        title: 'mail',
        path: PATH_DASHBOARD.mail.root,
        icon: ICONS.mail,
        info: <Label color="error">+32</Label>,
      },
      {
        title: 'chat',
        path: PATH_DASHBOARD.chat.root,
        icon: ICONS.chat,
      },
      {
        title: 'calendar',
        path: PATH_DASHBOARD.calendar,
        icon: ICONS.calendar,
      },
      {
        title: 'kanban',
        path: PATH_DASHBOARD.kanban,
        icon: ICONS.kanban,
      },
    ],
  }, */

  // DEMO MENU STATES
/*   {
    subheader: 'Other cases',
    items: [
      {
        // default roles : All roles can see this entry.
        // roles: ['user'] Only users can see this item.
        // roles: ['admin'] Only admin can see this item.
        // roles: ['admin', 'manager'] Only admin/manager can see this item.
        // Reference from 'src/guards/RoleBasedGuard'.
        title: 'item_by_roles',
        path: PATH_DASHBOARD.permissionDenied,
        icon: ICONS.lock,
        roles: ['admin'],
        caption: 'only_admin_can_see_this_item',
      },
      {
        title: 'menu_level',
        path: '#/dashboard/menu_level',
        icon: ICONS.menuItem,
        children: [
          {
            title: 'menu_level_2a',
            path: '#/dashboard/menu_level/menu_level_2a',
          },
          {
            title: 'menu_level_2b',
            path: '#/dashboard/menu_level/menu_level_2b',
            children: [
              {
                title: 'menu_level_3a',
                path: '#/dashboard/menu_level/menu_level_2b/menu_level_3a',
              },
              {
                title: 'menu_level_3b',
                path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b',
                children: [
                  {
                    title: 'menu_level_4a',
                    path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4a',
                  },
                  {
                    title: 'menu_level_4b',
                    path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4b',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'item_disabled',
        path: '#disabled',
        icon: ICONS.disabled,
        disabled: true,
      },

      {
        title: 'item_label',
        path: '#label',
        icon: ICONS.label,
        info: (
          <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
            NEW
          </Label>
        ),
      },
      {
        title: 'item_caption',
        path: '#caption',
        icon: ICONS.menuItem,
        caption:
          'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
      },
      {
        title: 'item_external_link',
        path: 'https://www.google.com/',
        icon: ICONS.external,
      },
      {
        title: 'blank',
        path: PATH_DASHBOARD.blank,
        icon: ICONS.blank,
      },
    ],
  }, */
];

export default navConfig;
