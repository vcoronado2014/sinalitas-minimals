import React, { useEffect, useState } from 'react';
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
    Chip,
    Alert,
  } from '@mui/material';

  import { Link as RouterLink, useNavigate } from 'react-router-dom';
  

  import { useSnackbar } from 'src/components/snackbar';

import { useDispatch, useSelector } from 'src/redux/store';
import { IProductoCodigoGrilla } from 'src/@types/productoCodigoGrilla';
import { IClientePackGeneral } from 'src/@types/clientePack';
import { ICuposProfesor } from 'src/@types/profesorCupo';
import { IUserAccountGeneral } from 'src/@types/user';
// import navigate from 'src/utils/Navigate';
import Iconify from 'src/components/iconify';
import { putComunasProfesor } from 'src/redux/slices/user';
import { isSameDay, isSameMonth, getYear, isBefore, compareAsc } from 'date-fns';
// locales
import { putPack } from 'src/redux/slices/productoCodigo';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { paramCase } from 'change-case';
import useResponsive from '../../../../hooks/useResponsive';
import { useLocales } from '../../../../locales';
import { fDate } from '../../../../utils/formatTime';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// import React from 'react';
import axios from '../../../../utils/axios';






export interface DialogProps {
    /* productoGrillaDialog?: IProductoCodigoGrilla; */
    clientePackDialog?: IClientePackGeneral;
    onClose: () => void;
    onGuardar: () => void;
    selectedCupo?: ICuposProfesor[];
    profId: string;
};



function not(a: ICuposProfesor[], b: ICuposProfesor[]) {
    return a.filter((value) => b.every((itemB) => itemB.Id !== value.Id));
}


function intersection(a: ICuposProfesor[], b: ICuposProfesor[]) {
    return a.filter((value) => b.some((itemB) => itemB.Id === value.Id));
}


function union(a: ICuposProfesor[], b: ICuposProfesor[]) {
    return [...a, ...not(b, a)];
}

export default function PackTransferCuposClientes(props: DialogProps) {
    const isDesktop = useResponsive('up', 'md');

    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { translate } = useLocales();
    
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { clientePackDialog, selectedCupo = [], onClose, onGuardar, profId } = props;

    // const [checked, setChecked] = useState<string[]>([]);
    const [checked, setChecked] = useState<ICuposProfesor[]>([]);

    const [left, setLeft] = useState<ICuposProfesor[]>([]);

    const [leftNew, setLeftNew] = useState<[string, any[]][]>([]);

    const [right, setRight] = useState<ICuposProfesor[]>([]);

    const leftChecked = intersection(checked, left);

    const rightChecked = intersection(checked, right);

    const [countSelected, setCountSelected] = useState(0);


    const handleToggle = (dataItem: ICuposProfesor) => () => {
        const currentIndex = checked.indexOf(dataItem);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
            newChecked.push(dataItem);
        } else {
            newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
    };

    // const numberOfChecked = (items: string[]) => intersection(checked, items).length;

    const numberOfChecked = (items: ICuposProfesor[]) => intersection(checked, items).length;


    const handleToggleAll = (items: ICuposProfesor[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        const tope = clientePackDialog?.ProductoCodigo.CantidadClases || 0;
        const itemsSeleccionados = right.length + leftChecked.length;
        if (itemsSeleccionados > tope){
            enqueueSnackbar('No puede agregar más clases que las programadas', { variant: 'default', autoHideDuration: 7000 })
            return;
        }

        const newRight = right.concat(leftChecked).sort((a, b) => compareAsc(new Date(a.FechaHoraInicio), new Date(b.FechaHoraInicio)));
        // setRight(right.concat(leftChecked));
        setRight(newRight);

        const newLeft = not(left, leftChecked).sort((a, b) => compareAsc(new Date(a.FechaHoraInicio), new Date(b.FechaHoraInicio)));

        setLeft(newLeft);

        setChecked(not(checked, leftChecked));

    };

    const handleCheckedLeft = () => {

        const newLeft = left.concat(rightChecked).sort((a, b) => compareAsc(new Date(a.FechaHoraInicio), new Date(b.FechaHoraInicio)));

        // setLeft(left.concat(rightChecked));
        setLeft(newLeft);

        const newRight = not(right, rightChecked).sort((a, b) => compareAsc(new Date(a.FechaHoraInicio), new Date(b.FechaHoraInicio)));

        // setRight(not(right, rightChecked));
        setRight(newRight);

        setChecked(not(checked, rightChecked));
    };
    
    const saveCupos = async () => {
        const tope = clientePackDialog?.ProductoCodigo.CantidadClases || 0;
        const itemsSeleccionados = right.length + leftChecked.length;
        if (itemsSeleccionados !== tope){
            enqueueSnackbar('No puedes guardar hasta que completes las clases programadas', { variant: 'default', autoHideDuration: 7000 });
            return;
        }
        
        const arrCupos = right.map(cupo => cupo.Id).join(',');
        const nombreCliente = `${clientePackDialog?.Cliente.Nombres} ${clientePackDialog?.Cliente.PrimerApellido} ${clientePackDialog?.Cliente.SegundoApellido}`;
        // const profId = user?.id.toString();
        const pcoId = clientePackDialog?.ProductoCodigo.Id.toString();
        const clientId = clientePackDialog?.Cliente.Id.toString();

        const entidadGuardar = {
            "ClieId": clientId,
            "PcoId": pcoId || '',
            "ProfId": profId,
            "ArrCupos": arrCupos,
            "NombreCliente": nombreCliente
        }

        const responsePost = await axios.put('/GuardarCupos', entidadGuardar);
        onClose();
        onGuardar();
        enqueueSnackbar('Guardado con éxito!');

    }

    useEffect(() => {
        // Obtener solo las fechas y horas de inicio
        // const fechasInicio = selectedCupo.CuposProfesor.map((item:any) => item.FechaHoraInicio);
        // ordenamos
        selectedCupo.sort((a, b) => compareAsc(new Date(a.FechaHoraInicio), new Date(b.FechaHoraInicio)));
        const newSelected = selectedCupo.filter((p:ICuposProfesor)=>p.PcoId === 0)
        // setLeft(selectedCupo);
        setLeft(newSelected);

        const groupedItems: { [date: string]: any[] } = selectedCupo.reduce((acc:any, item) => {
            const date = new Date(item.FechaHoraInicio);
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            
            if (!acc[formattedDate]) {
              acc[formattedDate] = [];
            }
            
            acc[formattedDate].push(item);
            return acc;
          }, {});

          const sortedDates = Object.entries(groupedItems)
            .sort(([dateA], [dateB]) => {
                const [dayA, monthA, yearA] = dateA.split('-').map(Number);
                const [dayB, monthB, yearB] = dateB.split('-').map(Number);
                
                const dateObjA = new Date(yearA, monthA - 1, dayA);
                const dateObjB = new Date(yearB, monthB - 1, dayB);
                
                return dateObjA.getTime() - dateObjB.getTime();
            });

        setLeftNew(sortedDates);

      }, [selectedCupo]);



    const customList = (title: React.ReactNode, items: ICuposProfesor[], checkedDisbaled?: boolean) => {
        // let prevDate: Date | null = null;
        let prevDate: string | null = null;

        return (
        <>
        <Card sx={{ borderRadius: 1.5,  }}>
                <CardHeader
                    avatar={<Checkbox
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        onClick={handleToggleAll(items)}
                        disabled={checkedDisbaled || items.length === 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        inputProps={{ 'aria-label': 'all items selected' }} />}
                    title={title}
                    subheader={`${numberOfChecked(items)}/${items.length} cupos`}
                    sx={{ p: 0 }} />

                <Divider />

                <List
                    dense
                    component="div"
                    role="list"
                    sx={{
                        width: '100%',
                        height: isDesktop ? 450 : 220,
                        overflow: 'auto',
                    }}
                >

                    {items.map((value: ICuposProfesor, index: number) => {
                        const labelId = `transfer-list-all-item-${value.Id}-label`;
                        const currentDate = fDate(value.FechaHoraInicio, 'yyyy-MM-dd');

                        const currentDayWeek = fDate(value.FechaHoraInicio, 'EEEE');

                        // Comprobar si es la primera iteración o si la fecha es diferente a la anterior
                        const isFirstItem = index === 0;
                        const isDifferentDate = prevDate !== null && prevDate !== currentDate;

                        // Actualizar prevDate para la siguiente iteración
                        prevDate = currentDate;


                        return (
                            <React.Fragment key={value.Id}>

                                {!isFirstItem && isDifferentDate && <Divider />}
                                <ListItemButton
                                    key={value.Id}
                                    role="listitem"
                                    onClick={handleToggle(value)}
                                    sx={{ p: 0, width: '100%' }}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            disableRipple
                                            checked={checked.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            inputProps={{ 'aria-labelledby': labelId }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={
                                            <Typography variant='subtitle1' color={currentDayWeek === 'sábado' || currentDayWeek === 'domingo' ? 'warning.main' : 'main'}>
                                                {
                                                    isDesktop ?
                                                        `${fDate(value.FechaHoraInicio, 'EEEE \' \' dd \'de\' MMMM \'del\' yyyy')}` :
                                                        `${fDate(value.FechaHoraInicio, 'dd \'de\' MMMM \'del\' yyyy')}`
                                                }
                                            </Typography>
                                            
                                        }
                                        secondary={<Chip
                                            icon={<Iconify icon="solar:calendar-bold" />}
                                            label={`${fDate(value.FechaHoraInicio, '\'De\' HH:mm')} a ${fDate(value.FechaHoraTermino, 'HH:mm')}`} sx={{ mb: 1, pl: 0, mr: 0 }} />}
                                        sx={{ p: 0, width: '100%' }} />
                                </ListItemButton>
                            </React.Fragment>
                        );
                    })}
                </List>
        </Card>
        </>
        )
    };

      return (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid container item xs={12}>
                <Alert sx={{width: '100%'}} 
                    severity={right.length === clientePackDialog?.ProductoCodigo.CantidadClases ? 'success' : 'error'}>
                    <Typography variant='body2' sx={{ pt: 0 }}>
                    {`${right.length} de ${clientePackDialog?.ProductoCodigo.CantidadClases} clases agregadas`}
                    </Typography>
                </Alert>
            </Grid>

          <Grid item  xs={12} md={5}>{customList('Disponibles', left, true)}</Grid>
    
          <Grid item  xs={12} md={2}>
            <Grid container direction="column" alignItems="center" sx={{ p: 0 }}>
              <Button
                color="primary"
                variant="contained"
                size="small"
                disabled={leftChecked.length === 0}
                onClick={handleCheckedRight}
                aria-label="move selected right"
                sx={{ my: 1 }}
              >
                <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
              </Button>
    
              <Button
                color="primary"
                variant="contained"
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
    
          <Grid item  xs={12} md={5}>{customList('Asignados', right)}</Grid>

          <Divider />

              <Grid item xs={12} sx={{ marginBottom: 2 }}>
                  <Button
                    onClick={saveCupos}
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