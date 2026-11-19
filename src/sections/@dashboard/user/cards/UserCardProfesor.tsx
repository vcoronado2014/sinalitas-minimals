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
    Button
} from '@mui/material';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// @types
// import { IUserCard } from '../../../../@types/user';
import { IUserAccountGeneral } from '../../../../@types/user';
// _mock
import { _socials } from '../../../../_mock/arrays';
// components
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import SvgColor from '../../../../components/svg-color';
import Label from '../../../../components/label';
import { UserTransferComunas } from '../transfer';


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
  user: IUserAccountGeneral;
};

export interface TransferDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
    row: IUserAccountGeneral;
  }
  
  function TransferDialog(props: TransferDialogProps) {
    // const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
    const { onClose, selectedValue, open, row } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleListItemClick = (value: string) => {
      onClose(value);
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Comunas de {row.name}</DialogTitle>
        <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        <DialogContent dividers>
          <DialogContentText>
            <UserTransferComunas row={row} onClose={handleClose} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }

export default function UserCardProfesor({ user }: Props) {
  const navigate = useNavigate();
  const { name, cover, role, avatarUrl, textoComunas, status, run, email, phoneNumber } = user;
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleEditRow = (id: string, row: any) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)), {state: row});
  };

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
              {name} ({run})
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {role}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 1, mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {email} - cel: {phoneNumber}
            </Typography>


          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" sx={{ py: 3 }}>
              <div>
                  <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
                      Comunas
                  </Typography>
                    <Button variant="outlined" color="inherit" size='small' onClick={handleClickOpen}>
                        {textoComunas}
                    </Button>
{/*                   <Label
                      variant="soft"
                      color='success'
                      sx={{ textTransform: 'capitalize' }}
                      onClick={handleClickOpen}
                  >
                      {textoComunas}
                  </Label> */}
                  {/* <Typography variant="subtitle1">{textoComunas}</Typography> */}
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

                  {/* <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>{status}</Typography> */}
              </div>

              <div>
                  <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
                      Editar
                  </Typography>
                  {/* <Typography variant="subtitle1">{fShortenNumber(1457)}</Typography> */}
                  <IconButton
                  onClick={() => handleEditRow(user.name, user)}
                      key="edit"
                      sx={{
                          color: '#1877F2',
                          '&:hover': {
                              bgcolor: alpha('#1877F2', 0.08),
                          },
                      }}
                  >
                      <Iconify icon="eva:edit-fill" />
                  </IconButton>
              </div>
          </Box>
      </Card>
      <TransferDialog
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              row={user} /></> 
  );
}
