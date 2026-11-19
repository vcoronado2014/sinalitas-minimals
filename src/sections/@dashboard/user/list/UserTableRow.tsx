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
import { getUsers, deleteUser, putUser } from '../../../../redux/slices/user';

// @types
import { IUserAccountGeneral } from '../../../../@types/user';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { useSnackbar } from '../../../../components/snackbar';
import { UserTransferComunas } from '../transfer';


// ----------------------------------------------------------------------

type Props = {
  row: IUserAccountGeneral;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
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

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
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
    dispatch(putUser(row, true, true));
    enqueueSnackbar('Desactivado con éxito!');
  }

  const handleClickOnReactive = () =>{
    setOpenConfirmReactive(false);
    dispatch(putUser(row, true, false));
    enqueueSnackbar('Activado con éxito!');
  }

  const { name, avatarUrl, company, role, isVerified, status, comunasAsociadas, textoComunas, run, phoneNumber, email } = row;

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
{/*         <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />

            <Typography variant="subtitle2" noWrap={false}>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Button size='small' onClick={handleClickOpen}  startIcon={<Iconify icon="eva:edit-fill" />} sx={{fontSize: 10, width: '100%' }}>
            {textoComunas}
          </Button>
        </TableCell>


        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {role}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {run}
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
            handleClickOpen();
            handleClosePopover();
          }}
        >
          <Iconify icon="zondicons:globe" />
          Comunas
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Editar
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

      <TransferDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        row={row}
      />  

    </>
  );
}
