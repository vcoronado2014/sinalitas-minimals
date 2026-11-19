import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, Alert, SelectChangeEvent, TableContainer, Table, TableBody, TableRow, TableCell, Divider, ListItem, ListItemAvatar, ListItemText, Chip, Avatar, List } from '@mui/material';
// import { role, sexo, comunas, regiones } from 'src/_mock/assets';
import { useDispatch, useSelector } from 'src/redux/store';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import { getProducts, putProductoCodigo } from 'src/redux/slices/products';
import { getAlumnosCliente } from 'src/redux/slices/fichaAlumnos';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { IProducts } from '../../../@types/products';
import { IAlumnos } from '../../../@types/clientePack';

import Iconify from '../../../components/iconify';
// components
import Label from '../../../components/label';
import FichaAlumno from './form/FichaAlumno';

import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFCuit,
  RHFRun,
  RHFAutocomplete,
} from '../../../components/hook-form';



interface FormValuesProps extends IProducts {

}
type Props = {
    isEdit?: boolean;
    idCliente: string;
    
};

export default function PackNewEditForm({isEdit = true, idCliente}: Props) {
    const NUMERO_CLASES = [4,5,6,7,8,9,10,11,12,13]
    const dispatch = useDispatch();

    const {
        products,
        ultimoId,
        isLoading
      } = useSelector((state) => state.products);

      const {
        alumnosFicha,
      } = useSelector((state) => state.alumnosFicha);      

    const [selectedValue, setSelectedValue] = useState<IProducts | null>(null);
    const [cantAlumnos, setCantAlumnos] = useState<number[]>([1,2,3,4,5,6]);

    const [cantAlumnosAgregar, setCantAlumnosAgregar] = useState(0);

    // ***** alumnos agregados ********
    const [alumnosAgregados, setAlumnosAgregados] = useState<IAlumnos[]>([]);
    // ********************************

    // ***** alumnos agregados ********
    const [isEditForm, setIsEditForm] = useState(false);
    const [alumnoEditando, setAlumnoEditando] = useState<IAlumnos | undefined>();
    // ********************************


    const { enqueueSnackbar } = useSnackbar();

    const NewUserSchema = Yup.object().shape({
        TopeClases: Yup.string().required('N° de clases is required'),
        // Descuento: Yup.number().min(0).required('Mínimo 0'),
        // Descripcion: Yup.string().required('Descripcion is required'),
        // Precio: Yup.string().required('Precio is required'),
        // CantidadAlumnos: Yup.string().required('CantidadAlumnos is required'),
        // TopeClases: Yup.string().required('TopeClases is required'),
        // ValorClase: Yup.string().required('ValorClase is required'),
      });
    
      const defaultValues = useMemo(
        () => ({
            Nombre: '',
            Descripcion: '',
            Precio: 0,
            CantidadAlumnos: 1,
            TopeClases: 4,
            ValorClase: 0,
            Descuento: "0",
            TotalPack: "0",
            CodigoCliente: ultimoId.toString(),
            IdCliente: idCliente.toString(),
            ProId: '0',
            CantidadClases: "4",
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      );
    
      const methods = useForm<FormValuesProps>({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
      });
    
      const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
      } = methods;
    
      const values = watch();

      useEffect(() => {
        dispatch(
          getProducts())
          dispatch(
            getAlumnosCliente(idCliente.toString()))
      }, [dispatch, idCliente])

      const onSubmit = async (data: FormValuesProps) => {
        try {
          dispatch(putProductoCodigo(data));
          reset();  
          enqueueSnackbar(!isEdit ? 'Creado con éxito!' : 'Actualizado con éxito!');
        } catch (error) {
          console.error(error);
        }
      };

      const changeDescuento = (event:any)=>{
        if (event.target.value && selectedValue){
            const total = (selectedValue.Precio  - parseInt(event.target.value, 10));
            reset({
                Nombre: selectedValue?.Nombre, 
                Descripcion: selectedValue?.Descripcion, 
                TopeClases: selectedValue?.TopeClases, 
                CantidadAlumnos: selectedValue?.CantidadAlumnos,
                Precio: selectedValue?.Precio,
                Descuento: event.target.value,
                CodigoCliente:`${ultimoId.toString()}-${selectedValue?.Nombre}`,  
                TotalPack: total.toString(),
                IdCliente: idCliente.toString(),
                ProId: selectedValue?.Id.toString(),
                CantidadClases: selectedValue?.TopeClases.toString(),
            })
        }
      }

      const handleChange = (event: any)=>{
        reset();
        setAlumnosAgregados([]);
        setCantAlumnosAgregar(parseInt(event.target.value, 10));
        const select = products.filter(p=>p.Id.toString() === event.target.value).length === 1 ? products.filter(p=>p.Id.toString() === event.target.value)[0] : null;
        if (select){
            // const alumnos = Array.from({ length: +select.CantidadAlumnos }, (_, i) => i + 1);
            const alumnos = [1,2,3,4,5,6]

            setCantAlumnos(alumnos);
            setSelectedValue(select);
            // setCantAlumnosAgregar(select?.CantidadAlumnos)
            // setCantAlumnosAgregar(event.target.value)
            reset({
                Nombre: select?.Nombre, 
                Descripcion: select?.Descripcion, 
                TopeClases: select?.TopeClases, 
                // CantidadAlumnos: select?.CantidadAlumnos,
                CantidadAlumnos: event.target.value,
                Precio: select?.Precio,
                Descuento: "0",
                TotalPack: select.Precio.toString(),
                CodigoCliente: `${ultimoId.toString()}-${select?.Nombre}`,
                IdCliente: idCliente.toString(),
                ProId: select?.Id.toString(),
                // CantidadClases: select.CantidadClases.toString(),
                CantidadClases: select.TopeClases.toString(),
            });
        }
        else{
            reset(defaultValues);
        }
      }

      const handleChangeCantAlumnos = (event: any)=>{
         setCantAlumnosAgregar(parseInt(event.target.value, 10));
         // setAlumnosAgregados([]);
      }

      const handleGuardarPack = (data: FormValuesProps) =>{
        console.log('guardar pack completo ******', data)
      }



      return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={1}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                              <Alert severity="info">
                                Selecciona el pack a crear, llena los datos y ya puedes guardarlo.
                              </Alert>

                            <RHFSelect native name="products" label="Seleccione pack" placeholder="Seleccione pack" onChange={handleChange}>
                                <option value="" />
                                {products.map((product) => (
                                    <option
                                        key={product.Id}
                                        value={product.Id}
                                    >
                                        {product.Nombre}
                                    </option>
                                ))}
                            </RHFSelect>                            

                        </Box>
                    

                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(2, 1fr)',
                                sm: 'repeat(6, 1fr)',
                            }}
                            sx={{pt: 3}}
                        >

                        <RHFSelect native name="TopeClases" label="N° de clases" placeholder="N° de clases">
                            <option value="" />
                            {NUMERO_CLASES.map((cant) => (
                                <option
                                    key={cant}
                                    value={cant}
                                >
                                    {cant}
                                </option>
                            ))}
                        </RHFSelect>

                        <RHFSelect native name="CantidadAlumnos" value={cantAlumnosAgregar} 
                        label="N° de alumnos" placeholder="N° de alumnos" onChange={handleChangeCantAlumnos}>
                            {/* <option value="" /> */}
                            {cantAlumnos.map((cant) => (
                                <option
                                    key={cant}
                                    value={cant}
                                >
                                    {cant}
                                </option>
                            ))}
                        </RHFSelect>

                        <RHFTextField name="Precio" label="Precio Pack" type='number' />

                        <RHFTextField name="Descuento" label="Descuento" type='number' defaultValue="0" onChange={changeDescuento} />

                        <RHFTextField name="TotalPack" label="Total Pack" type='number' disabled />

                        <RHFTextField name="CodigoCliente" label="Cod. Cliente" disabled />

                        </Box>
                    </Card>

                </Grid>

                <Grid item xs={12}>
                    <FichaAlumno cantAlumnosAgregar={cantAlumnosAgregar} alumnosFicha={alumnosFicha} 
                    limpiarAlumnos={setAlumnosAgregados}  dataForm={
                        {
                            Id: selectedValue?.Id || '0',
                            Nombre: selectedValue?.Nombre || '',
                            Descripcion: selectedValue?.Descripcion || '',
                            Precio: watch('Precio'),
                            // CantidadAlumnos: watch('CantidadAlumnos'),
                            CantidadAlumnos: cantAlumnosAgregar,
                            Eliminado: selectedValue?.Eliminado || 0,
                            Activo: selectedValue?.Activo || 1,
                            TopeClases: selectedValue?.TopeClases || 0,
                            ValorClase: selectedValue?.ValorClase || 0,
                            Descuento: watch('Descuento'),
                            TotalPack: watch('TotalPack'),
                            CodigoCliente: watch('CodigoCliente'),
                            IdCliente: idCliente.toString() || '0',
                            ProId: watch('ProId'),
                            CantidadClases: watch('TopeClases').toString(),
                            ClieId: idCliente.toString() || '0',
                            PorcentajeDescuento: watch('Descuento'),
                        }
                    }
                    /> 
                </Grid>

{/*                 <Grid item xs={12}>
                      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                          <LoadingButton type="submit" variant="contained" loading={isSubmitting} 
                          >
                              Guardar cambios
                          </LoadingButton>
                      </Stack>
                </Grid> */}   
            </Grid>
        </FormProvider>
      )
}