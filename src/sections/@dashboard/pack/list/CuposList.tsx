// @mui
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Typography, Stack, StackProps, CardProps, Avatar } from '@mui/material';
import { isSameDay, isSameMonth, getYear, isBefore, compareAsc } from 'date-fns';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
// components
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';


// ----------------------------------------------------------------------

const StyledBlock = styled((props: StackProps) => (
  <Stack direction="row" alignItems="center" {...props} />
))({
  minWidth: 72,
  flex: '1 1',
});

const StyledItemIcon = styled(Iconify)(({ theme }) => ({
  width: 16,
  height: 16,
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.disabled,
}));

// ----------------------------------------------------------------------

type ItemProps = {
  Id: string;
  FechaHoraInicio: Date;
  FechaHoraTermino: Date;
  windows: number;
  apple: number;
  flag: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list?: any[];
}

export default function CuposList({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ height: 190 }}>
        <Stack spacing={3} sx={{ p: 3 }}>
          {list?.map((cupo:any, index) => (
            <CupoItem key={index + 1} cupo={cupo} index={index + 1} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CupoItemProps = {
  cupo: any;
};

function CupoItem({ cupo, index }: any) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <StyledBlock sx={{ minWidth: 120 }}>
        <Avatar sx={{ bgcolor: compareAsc(new Date(cupo?.FechaHoraTermino), new Date()) === -1 ? 'primary.success' : 'primary.light', mr: 1 }}>{index}</Avatar>
        <Typography variant="subtitle1">{fDate(cupo?.FechaHoraInicio, 'dd \'de\' MMMM \'del\' yyyy')}</Typography>
      </StyledBlock>

      <StyledBlock>
        <StyledItemIcon icon="solar:calendar-bold-duotone" />
        <Typography variant="body2">{`${fDate(cupo?.FechaHoraInicio, '\'De\' HH:mm')} a ${fDate(cupo?.FechaHoraTermino, 'HH:mm')}`}</Typography>
      </StyledBlock>

    </Stack>
  );
}
