// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Card, Typography, CardProps, Badge } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';
import { fShortenNumber } from '../../../../utils/formatNumber';
// theme
import { ColorSchema } from '../../../../theme/palette';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total?: number;
  icon: string;
  color?: ColorSchema;
  subtitle: string;
  useBadge?: boolean;
  textBadge?: string;
}

export default function WidgetMinSummary({
  title,
  total,
  icon,
  subtitle,
  useBadge = false,
  textBadge = '',
  color = 'primary',
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  return (

    <>
    <Badge 
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      color="error" badgeContent={textBadge} invisible={!useBadge} sx={{width: '100%'}}>
        <Card
          sx={{
            width: '100%',
            py: 5,
            boxShadow: 0,
            textAlign: 'center',
            color: theme.palette[color].darker,
            bgcolor: theme.palette[color].lighter,
            ...sx,
          }}
          {...other}
        >
          <Iconify
            icon={icon}
            sx={{
              mb: 3,
              p: 2.5,
              width: 64,
              height: 64,
              borderRadius: '50%',
              color: theme.palette[color].dark,
              ...bgGradient({
                direction: '135deg',
                startColor: `${alpha(theme.palette[color].dark, 0)} 0%`,
                endColor: `${alpha(theme.palette[color].dark, 0.24)} 100%`,
              }),
            }} />


          {total ? (<Typography variant="h3">{fShortenNumber(total)}</Typography>) : (<Typography variant="h3">{subtitle}</Typography>)}
          

          <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
            {title}
          </Typography>
        </Card>
    </Badge>
</>
  );
}