import { Link as RouterLink } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
// @mui
import { Stack, Button, Typography, StackProps, IconButton, Card, Divider, CircularProgress, Box, Chip } from '@mui/material';
// components
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  title: string;
  cliente?: string;
  fechaTexto?: string;
  fechaInicioFin?: string;
}

export default function InfoClase({
  title,
  cliente,
  fechaTexto,
  fechaInicioFin,
  sx,
  ...other
}: Props) {
  return (
    <Card sx={{ mb: 5 }}>
        <Scrollbar>
              <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                  sx={{ py: 2 }}
              >
                  <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ width: 1, minWidth: 200 }}
                  >
                      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
                          <Iconify icon="solar:calendar-bold" width={24} sx={{ color: 'info', position: 'absolute' }} />

                          <CircularProgress
                              variant="determinate"
                              value={100}
                              size={56}
                              thickness={4}
                              sx={{ color: 'info', opacity: 0.48 }}
                          />

                          <CircularProgress
                              variant="determinate"
                              value={100}
                              size={56}
                              thickness={4}
                              sx={{
                                  top: 0,
                                  left: 0,
                                  opacity: 0.48,
                                  position: 'absolute',
                                  color: (theme) => alpha(theme.palette.grey[500], 0.16),
                              }}
                          />
                      </Stack>

                      <Stack spacing={0.5} sx={{ ml: 2 }}>
                          <Typography variant="h6">{title}</Typography>

                          <Typography variant="subtitle2">
                              <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                                  Clase tomada por 
                              </Box>
                              {cliente}
                          </Typography>

                          <Typography variant="subtitle2" sx={{ color: 'info', textTransform:'capitalize' }}>
                              {fechaTexto}
                          </Typography>

                          <Chip label={fechaInicioFin} color='primary' variant="soft" sx={{fontWeight: 'bold'}} />
                      </Stack>
                  </Stack>
              </Stack>
        </Scrollbar>
    </Card>
  );
}