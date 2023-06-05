// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

export const navSections = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'profile',
    path: '/dashboard/profil',
    icon: icon('ic_profile'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'test',
    path: '/dashboard/test',
    icon: icon('ic_test'),
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export const navPermission = {
  title: 'permissions',
  // permissions: {},
  path: '/dashboard/permissions',
  icon: icon('ic_permissions'),
}

export const navFields = {
  title: 'fields',
  // permissions: {},
  path: '/dashboard/fields',
  icon: icon('ic_skill'),
}
