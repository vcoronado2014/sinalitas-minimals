import { useState } from 'react';
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
    Card,
    List,
    Grid,
    Divider,
    CardHeader,
    ListItemText,
    ListItemIcon,
    ListItemButton,
  } from '@mui/material';

  import { useSnackbar } from 'src/components/snackbar';

import { useDispatch, useSelector } from 'src/redux/store';
import { IUserAccountGeneral } from 'src/@types/user';
import Iconify from 'src/components/iconify';
import { putComunasProfesor } from 'src/redux/slices/user';

export interface TransferDialogProps {
    row?: IUserAccountGeneral;
    onClose: () => void;
}

function not(a: string[], b: string[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: string[], b: string[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: string[], b: string[]) {
    return [...a, ...not(b, a)];
}

export default function UserTransferComunas(props: TransferDialogProps) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { row, onClose } = props;

    const [checked, setChecked] = useState<string[]>([]);
    const [left, setLeft] = useState<string[]>(row?.comunasNoAsociadas || []);

    const [right, setRight] = useState<string[]>(row?.comunasAsociadas || []);

    const leftChecked = intersection(checked, left);

    const rightChecked = intersection(checked, right);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);

        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: string[]) => intersection(checked, items).length;

    const handleToggleAll = (items: string[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };
    
    const saveComunas = () => {
      if (right && right.length > 0) {
        dispatch(putComunasProfesor(row?.id, right));
        onClose();
        enqueueSnackbar('Comunas actualizadas con éxito');
      }
      else{
        enqueueSnackbar(
          'Debes seleccionar al menos una comuna',
          {
            autoHideDuration: 6000,
            color:'error'
          }
          );
      }
    }
    

    const customList = (title: React.ReactNode, items: string[]) => (
        <Card sx={{ borderRadius: 1.5 }}>
          <CardHeader
            avatar={
              <Checkbox
                checked={numberOfChecked(items) === items.length && items.length !== 0}
                onClick={handleToggleAll(items)}
                disabled={items.length === 0}
                indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                inputProps={{ 'aria-label': 'all items selected' }}
              />
            }
            title={title}
            subheader={`${numberOfChecked(items)}/${items.length} selected`}
            sx={{ p: 0 }}
          />
    
          <Divider />
    
          <List
            dense
            component="div"
            role="list"
            sx={{
              width: '100%',
              height: 220,
              overflow: 'auto',
            }}
          >
            {items.map((value: string) => {
              const labelId = `transfer-list-all-item-${value}-label`;
              return (
                <ListItemButton 
                    key={value} 
                    role="listitem" 
                    onClick={handleToggle(value)}
                    sx={{ p: 0, width: '100%' }}
                    >
                  <ListItemIcon>
                    <Checkbox
                      disableRipple
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value}`} sx={{ p: 0, width: '100%' }} />
                </ListItemButton>
              );
            })}
          </List>
        </Card>
      );

      return (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item  xs={12} md={5}>{customList('Disponibles', left)}</Grid>
    
          <Grid item  xs={12} md={2}>
            <Grid container direction="column" alignItems="center" sx={{ p: 0 }}>
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                disabled={leftChecked.length === 0}
                onClick={handleCheckedRight}
                aria-label="move selected right"
                sx={{ my: 1 }}
              >
                <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
              </Button>
    
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                disabled={rightChecked.length === 0}
                onClick={handleCheckedLeft}
                aria-label="move selected left"
                sx={{ my: 1 }}
              >
                <Iconify icon="eva:arrow-ios-back-fill" width={18} />
              </Button>
            </Grid>
          </Grid>
    
          <Grid item  xs={12} md={5}>{customList('Asignadas', right)}</Grid>

          <Divider />

              <Grid item xs={12} sx={{ marginBottom: 2 }}>
                  <Button
                    onClick={saveComunas}
                      sx={{ float: 'right' }}
                      variant="contained"
                      startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                      Guardar
                  </Button>
              </Grid>

        </Grid>

      );

}