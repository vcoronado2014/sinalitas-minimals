import { ApexOptions } from 'apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import { Typography, Box, CardProps, Stack } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import Chart, { useChart } from '../../../../components/chart';
// theme
import { ColorSchema } from '../../../../theme/palette';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  icon: string;
  title: string;
  total: number;
  color?: ColorSchema;
  usaPointer?: boolean;
  onLink?: () => void;
}

export default function AppWidgetNew({
  title,
  total,
  icon,
  color = 'primary',
  usaPointer = false,
  onLink,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      onClick={onLink}
      direction="row"
      alignItems="center"
      sx={{
        cursor: usaPointer ? 'pointer' : 'default',
        p: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        color: 'common.white',
        bgcolor: `${color}.dark`,
        minHeight: 130,
        '&:hover': {
          bgcolor: usaPointer ? `${color}.main`: `${color}.dark`,
          boxShadow: theme.customShadows.z20,
        },
        ...sx,
      }}
      
      {...other}
    >
      {/* <Chart type="radialBar" series={[series]} options={chartOptions} width={86} height={86} /> */}

      <Box sx={{ ml: 3 }}>
        <Typography variant="h4"> {fNumber(total)}</Typography>

        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          {title}
        </Typography>
      </Box>

      <Iconify
        icon={icon}
        sx={{
          width: 120,
          height: 120,
          opacity: 0.12,
          position: 'absolute',
          right: theme.spacing(-3),
        }}
      />
    </Stack>
  );
}
