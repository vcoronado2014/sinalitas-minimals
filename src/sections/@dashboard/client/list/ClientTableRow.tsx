import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  useMediaQuery,
  useTheme,
  DialogContentText,
  DialogContent
} from '@mui/material';

import { CloseIcon } from 'src/theme/overrides/CustomIcons';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { putClient } from '../../../../redux/slices/client';

// @types
import { IClientAccountGeneral } from '../../../../@types/client';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { useSnackbar } from '../../../../components/snackbar';


// ----------------------------------------------------------------------

type Props = {
  row: IClientAccountGeneral;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onCreatePack: VoidFunction;
};

export default function ClientTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onCreatePack,
}: Props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // dialog
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleClickOnDelete = () =>{
    setOpenConfirm(false);
    dispatch(putClient(row, true, true));
    enqueueSnackbar('Desactivado con éxito!');
  }

  const handleClickOnReactive = () =>{
    setOpenConfirmReactive(false);
    dispatch(putClient(row, true, false));
    enqueueSnackbar('Activado con éxito!');
  }

  const { name, avatarUrl, company, status, run, phoneNumber, email, address, state, city } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openConfirmReactive, setOpenConfirmReactive] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [loguedUser, setLoguedUser] = useState<string | null>(sessionStorage.getItem('USER_NAME') ? sessionStorage.getItem('USER_NAME') : '');


  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleOpenConfirmReactive = () => {
    setOpenConfirmReactive(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  
  const handleCloseConfirmReactive = () => {
    setOpenConfirmReactive(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />

            <Typography variant="subtitle2" noWrap={false}>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {city}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {phoneNumber}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'lowercase' }}>
          {email}
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === 'inactivo' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {
          loguedUser !== run && 
          (
            status === 'activo' ? (
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
            ) :
              (
                <MenuItem
                  onClick={() => {
                    handleOpenConfirmReactive();
                    handleClosePopover();
                  }}
                  sx={{ color: 'success' }}
                >
                  <Iconify icon="iconamoon:file-check-fill" />
                  Reactivar
                </MenuItem>
              )
          )
        }

        <MenuItem
          onClick={() => {
            onEditRow();
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Desactivar"
        content={<Typography>Está seguro de desactivar a {row.names}</Typography>}
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
        content={<Typography>Está seguro de reactivar a {row.names}</Typography>}
        action={
          <Button variant="contained" color="error" onClick={handleClickOnReactive}>
            Reactivar
          </Button>
        }
      />
 

    </>
  );
}