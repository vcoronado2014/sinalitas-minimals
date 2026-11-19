// @mui
import { styled, alpha } from '@mui/material/styles';
import { Paper, ListSubheader, ListItemButton } from '@mui/material';
import { useSettingsContext } from '../../../../components/settings';
// utils
import { bgBlur } from '../../../../utils/cssStyles';
//
import { NavItemDesktopProps } from '../types';

// ----------------------------------------------------------------------

type ListItemProps = Omit<NavItemDesktopProps, 'item'>;

export const ListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) =>
    prop !== 'active' && prop !== 'open' && prop !== 'isOffset' && prop !== 'subItem',
})<ListItemProps>(({ active, open, isOffset, subItem, theme }) => {
  const { themeMode } = useSettingsContext();
  const dotActive = {
    content: '""',
    borderRadius: '50%',
    position: 'absolute',
    width: 6,
    height: 6,
    left: -14,
    opacity: 0.48,
    backgroundColor: 'currentColor',
/*     backgroundColor: 'white',
    padding: 2, */
  };

  return {
    ...theme.typography.subtitle2,
    padding: 0,
    height: '100%',
    /* color: theme.palette.text.primary, */
    color: themeMode === 'dark' ? 'white' : 'white',

/*     paddingTop: 2,
    backgroundColor: 'white', */
    
/*     border: 'white',
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    paddingTop: 5, */
/*     borderBottom: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: 2, */

    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      opacity: 0.48,
      backgroundColor: 'transparent',
    },
    // Sub item
    ...(subItem && {
      ...theme.typography.body2,
      color: theme.palette.text.secondary,
    }),
    // isOffset
    ...(isOffset && {
      color: theme.palette.text.primary,
    }),
    // Active
    ...(active && {
      /* color: theme.palette.primary.main, */
      color: themeMode === 'dark' ? 'white' : 'white',

      borderBottom: 'white',
      borderBottomStyle: 'solid',
      borderBottomWidth: 2,

      '&::before': dotActive,
    }),
    // Active sub item
    ...(active &&
      subItem && {
        ...theme.typography.subtitle2,
        color: theme.palette.text.primary,
        '&::before': {
          ...dotActive,
          color: theme.palette.primary.main,
        },
      }),
    // Open
    ...(open && {
      opacity: 0.48,
    }),
  };
});

// ----------------------------------------------------------------------

export const StyledMenu = styled(Paper)(({ theme }) => ({
  ...bgBlur({
    opacity: 0.94,
    color: theme.palette.background.default,
  }),
  top: 72,
  left: 0,
  right: 0,
  margin: 'auto',
  display: 'grid',
  position: 'fixed',
  alignItems: 'flex-start',
  zIndex: theme.zIndex.modal,
  padding: theme.spacing(5, 1, 1, 3),
  boxShadow: theme.customShadows.dialog,
  maxWidth: theme.breakpoints.values.lg,
  gridTemplateColumns: 'repeat(12, 1fr)',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
}));

// ----------------------------------------------------------------------

export const StyledSubheader = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.overline,
  padding: 0,
  fontSize: 11,
  color: theme.palette.text.primary,
}));
