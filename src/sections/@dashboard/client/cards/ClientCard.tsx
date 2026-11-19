import { useState } from 'react';
import { paramCase } from 'change-case';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Box, Card, Avatar, Divider, Typography, Stack, IconButton,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    Button,
    MenuItem
} from '@mui/material';
import { useDispatch, useSelector } from 'src/redux/store';
import MenuPopover from 'src/components/menu-popover';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import ConfirmDialog from 'src/components/confirm-dialog';
import { putClient } from 'src/redux/slices/client';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// @types
// import { IUserCard } from '../../../../@types/user';
import { IClientAccountGeneral } from '../../../../@types/client';
// _mock
import { _socials } from '../../../../_mock/arrays';
// components
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import SvgColor from '../../../../components/svg-color';
import Label from '../../../../components/label';


import { useSnackbar } from '../../../../components/snackbar';




// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 8,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

type Props = {
  client: IClientAccountGeneral;
  onCreatePack: VoidFunction;
};


export default function ClientCard({ client, onCreatePack, }: Props) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { name, cover, avatarUrl, status, run, email, phoneNumber, city, address } = client;
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmReactive, setOpenConfirmReactive] = useState(false);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleEditRow = (id: string, row: any) => {
    navigate(PATH_DASHBOARD.client.edit(paramCase(id)), {state: row});
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };


  const handleClickOnDelete = () =>{
    setOpenConfirm(false);
    dispatch(putClient(client, true, true));
    enqueueSnackbar('Desactivado con éxito!');
  }

  const handleCloseConfirmReactive = () => {
    setOpenConfirmReactive(false);
  };

  const handleClickOnReactive = () =>{
    setOpenConfirmReactive(false);
    dispatch(putClient(client, true, false));
    enqueueSnackbar('Activado con éxito!');
  }

  return (
    <>
    <Card sx={{ textAlign: 'center' }}>
          <Box sx={{ position: 'relative' }}>
              <SvgColor
                  src="/assets/shape_avatar.svg"
                  sx={{
                      width: 144,
                      height: 62,
                      zIndex: 10,
                      left: 0,
                      right: 0,
                      bottom: -26,
                      mx: 'auto',
                      position: 'absolute',
                      color: 'background.paper',
                  }} />

              <Avatar
                  alt={name}
                  src={avatarUrl}
                  sx={{
                      width: 64,
                      height: 64,
                      zIndex: 11,
                      left: 0,
                      right: 0,
                      bottom: -32,
                      mx: 'auto',
                      position: 'absolute',
                  }} />

              <StyledOverlay />

              <Image src={cover} alt={cover} ratio="16/9" />
          </Box>

          <Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
              {name} 
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {address} {city}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 1, mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {email} - teléfonos: {phoneNumber}
            </Typography>


          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" sx={{ py: 3 }}>
              <div>
                  <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
                      Comuna
                  </Typography>
                  <Typography variant="subtitle1">{city}</Typography>
              </div>

              <div>
                  <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
                      Estado
                  </Typography>
                  <Label
                      variant="soft"
                      color={(status === 'inactivo' && 'error') || 'success'}
                      sx={{ textTransform: 'capitalize' }}
                  >
                      {status}
                  </Label>
              </div>

              <div>
                  <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
                      Editar
                  </Typography>
                      <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                          <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>


                      <MenuPopover
                          open={openPopover}
                          onClose={handleClosePopover}
                          arrow="right-top"
                          sx={{ width: 140 }}
                      >

                                  
                          <MenuItem
                              onClick={() => {
                                  handleOpenConfirm();
                                  handleClosePopover();
                              }}
                              sx={{ color: 'error.main' }}
                          >
                              <Iconify icon="eva:trash-2-outline" />
                              Desactivar
                          </MenuItem>
                                  

                          <MenuItem
                              onClick={() => {
                                  handleEditRow(client.name, client);
                                  handleClosePopover();
                              }}
                          >
                              <Iconify icon="eva:edit-fill" />
                              Editar
                          </MenuItem>

                          <MenuItem
                              onClick={() => {
                                  onCreatePack();
                                  handleClosePopover();
                              }}
                          >
                              <Iconify icon="twemoji:package" />
                              Crear Pack
                          </MenuItem>
                      </MenuPopover>
                  {/* <Typography variant="subtitle1">{fShortenNumber(1457)}</Typography> */}
{/*                   <IconButton
                  onClick={() => handleEditRow(client.name, client)}
                      key="edit"
                      sx={{
                          color: '#1877F2',
                          '&:hover': {
                              bgcolor: alpha('#1877F2', 0.08),
                          },
                      }}
                  >
                      <Iconify icon="eva:edit-fill" />
                  </IconButton> */}
              </div>
                  <ConfirmDialog
                      open={openConfirm}
                      onClose={handleCloseConfirm}
                      title="Desactivar"
                      content={<Typography>Está seguro de desactivar a {client.name}</Typography>}
                      action={
                          <Button variant="contained" color="error" onClick={handleClickOnDelete}>
                              Desactivar
                          </Button>
                      }
                  />

                  <ConfirmDialog
                      open={openConfirmReactive}
                      onClose={handleCloseConfirmReactive}
                      title="Reactivar"
                      content={<Typography>Está seguro de reactivar a {client.name}</Typography>}
                      action={
                          <Button variant="contained" color="error" onClick={handleClickOnReactive}>
                              Reactivar
                          </Button>
                      }
                  />
          </Box>
      </Card>
</> 
  );
}