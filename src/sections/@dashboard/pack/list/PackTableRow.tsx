import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  DialogContent,
  Chip,
  Tooltip
} from '@mui/material';
import axios from 'src/utils/axios';

import { CloseIcon } from 'src/theme/overrides/CustomIcons';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useAuthContext } from '../../../../auth/useAuthContext';

// @types
import { IProductoCodigoGrilla } from '../../../../@types/productoCodigoGrilla';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { useSnackbar } from '../../../../components/snackbar';



// ----------------------------------------------------------------------

type Props = {
  row: IProductoCodigoGrilla;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onGuardar: VoidFunction; 
};

export default function PackTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onGuardar,
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
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

  const handleClickOnDelete = async () =>{
    setOpenConfirm(false);
    const url = `/Pack?id=${row.Id}`;
    const response = await axios.delete(url);
    try {
      if (response.statusText === 'OK') {
        enqueueSnackbar('Pack guardado correctamente', { variant: 'success' });
        onGuardar();
        navigate(PATH_DASHBOARD.pack.list);
        // navigate(PATH_DASHBOARD.pack.edit)
    }
    else {
        enqueueSnackbar(response.data, { variant: 'error' });
    }
    }
    catch (error) {
      console.log(error);
      enqueueSnackbar('Hubo un error al eliminar el pack, contacta al administrador', { variant: 'error' });
    }

  }

  const handleClickOnReactive = () =>{
    setOpenConfirmReactive(false);
  }

  const { Id, Alerta, EstaPagado, MostrarAbrir, TieneAgenda, Texto, Codigo, FechaPack } = row;

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
        
        <TableCell align="left">
          <strong>{Codigo}, </strong>
          {Texto.split(",").slice(1).join(",").trim()}
          {
            Alerta !== null && (<Typography color='error'>{Alerta}</Typography>)
          }
        </TableCell>

        <TableCell align="left">
          {
            TieneAgenda ? (
              <Tooltip title="Agendado">
                <Iconify icon="gg:check-o" color='success.light' width={24} />
              </Tooltip>
              
            ):
            (
              <Tooltip title="Sin agendar">
                <Iconify icon="bi:calendar-x" color='error.light' width={24} />
              </Tooltip>
            )
          }
          {
            Alerta !== null && (
                <Tooltip title={Alerta}>
                <Iconify icon="fluent-mdl2:alert-solid" color='error.main' width={24} />
              </Tooltip>
              )
          }
          {
            !MostrarAbrir && (
              <><Tooltip title="Sin ficha alumnos">
                <Iconify icon="pepicons-pop:ticket-off" color='error.light' width={24} />
              </Tooltip>
              <Tooltip title="No ha aceptado condiciones">
                  <Iconify icon="iconoir:privacy-policy" color='error.light' width={24} />
                </Tooltip></>
            )
          }

          
        </TableCell>


        <TableCell align="right">
          {MostrarAbrir && <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>}
        </TableCell>
      </TableRow>

      {
        MostrarAbrir &&
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Abrir
          </MenuItem>
          {
            user?.RolId === 2 &&           
              <MenuItem
                onClick={() => {
                  handleOpenConfirm();
                  handleClosePopover();
                }}
              >
                <Iconify icon="eva:trash-2-outline" />
                Eliminar
              </MenuItem>
          }



        </MenuPopover>
      }

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Eliminar Pack"
        content={<Typography>Está seguro de eliminar el pack {row.Id} ?. Esta acción no se puede deshacer.</Typography>}
        action={
          <Button variant="contained" color="error" onClick={handleClickOnDelete}>
            SI, ELIMINAR PACK
          </Button>
        }
      />

      <ConfirmDialog
        open={openConfirmReactive}
        onClose={handleCloseConfirmReactive}
        title="Reactivar"
        content={<Typography>Está seguro de reactivar a {row.Id}</Typography>}
        action={
          <Button variant="contained" color="error" onClick={handleClickOnReactive}>
            Reactivar
          </Button>
        }
      />
 

    </>
  );
}