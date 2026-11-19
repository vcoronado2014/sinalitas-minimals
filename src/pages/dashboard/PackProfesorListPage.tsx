import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Box,
} from '@mui/material';
import ClientCard from 'src/sections/@dashboard/client/cards/ClientCard';
import { PackTableRow, PackTableToolbar } from 'src/sections/@dashboard/pack/list/';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { comunas } from 'src/_mock/assets';
import { getProductoCodigos } from '../../redux/slices/productoCodigo';
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  Sort,
} from '../../components/table';
// sections

import LoadingTable from '../../components/loading-table/LoadingTable';
import useResponsive from '../../hooks/useResponsive';

const TABLE_HEAD = [
/*     { id: 'Alerta', label: 'Alerta', align: 'left' },
    { id: 'EstaPagado', label: 'Pagado', align: 'left' },
    { id: 'TieneAgenda', label: 'Agenda', align: 'left' }, */
    { id: 'Texto', label: 'Texto', align: 'left', width: '80%' },
    { id: 'TieneAgenda', label: 'Agenda', align: 'left' },
    { id: '' },
  ];

export default function PackProfesorListPage() {
    const { user } = useAuthContext();

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
      } = useTable();

    const { themeStretch } = useSettingsContext();

    const isDesktop = useResponsive('up', 'md');

    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    const {
        productoCodigos,
        count,
        isLoading
    } = useSelector((state) => state.productoCodigos);

    const [tableData, setTableData] = useState(productoCodigos);    
    
    const dataInPage = productoCodigos?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const [filterTexto, setFilterTexto] = useState('');

    const denseHeight = dense ? 52 : 72;
    const isFiltered = filterTexto !== '';

    const isNotFound = (!count && !!filterTexto);

    useEffect(() => {
        const paginationOptions = {
            page: 0,
            size: rowsPerPage,
            direction:  order,
            orderBy,
          };
        dispatch(
          getProductoCodigos(
            {
              Texto: filterTexto
            },
            paginationOptions,"", "0", user?.id.toString()
          ))
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dispatch])

      const handleFilterChange = (
        property: string,
        value: string,
        setState: React.Dispatch<React.SetStateAction<string>>
      ) => {
        setPage(0);
        setState(value);
        dispatch(
          getProductoCodigos(
            {
              Texto: property === 'Texto' ? value : filterTexto
            },
            {
              page: 0,
              size: rowsPerPage,
              direction: order,
              orderBy,
            },"", "0", user?.id.toString()
          )
        );
      };

      const handlePaginationChange = (
        property: 'page' | 'size' | 'sort',
        value: Sort | number
      ) => {
        dispatch(
          getProductoCodigos(
            {
              Texto: filterTexto
            },
            {
              page: property === 'page' && typeof value === 'number' ? value : page,
              size: property === 'size' && typeof value === 'number' ? value : rowsPerPage,
              direction: property === 'sort' && typeof value === 'object' ? value.order : order,
              orderBy: property === 'sort' && typeof value === 'object' ? value.orderBy : orderBy,
            }, "", "0", user?.id.toString()
          )
        );
      };

      const handleChangePage = (event: unknown, newPage: number) => {
        handlePaginationChange('page', onChangePage(null, newPage))
      }   
      
      const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        handlePaginationChange('size', onChangeRowsPerPage(event))
      }

      const handlePaginationOnSort = (id: string) => {
        handlePaginationChange('sort', onSort(id))
      }

      const handleDeleteRow = (id: string) => {
        console.log('id ', id);
        // setOpenConfirm(false);
      };

      const handleEditRow = (id: string, row: any) => {
        // navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
        navigate(PATH_DASHBOARD.pack.edit(paramCase(id)), {state: row});
      };

      const handleFilterTexto = debounce((event: React.ChangeEvent<HTMLInputElement> | string) => {
        handleFilterChange(
          'Texto',
          typeof event !== 'string' ? event.target.value : event,
          setFilterTexto
        )
      }, 300);

      const handleResetFilter = () => {
        handleFilterTexto('');
      };

    return (
        <>
        <Helmet>
            <title> Mis Packs</title>
        </Helmet>

        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Packs"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'Packs', href: PATH_DASHBOARD.agenda.packsProfesor },
                    { name: 'Listado' },
                ]}
            />

                <>
                    <Card>
                        <PackTableToolbar
                            isFiltered={isFiltered}
                            onFilterTexto={handleFilterTexto}
                            onResetFilter={handleResetFilter}
                        />
                        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                checked,
                                tableData.map((row) => row.Id.toString())
                                )
                            }
                        />

                            <Scrollbar>
                                <Table size={dense ? 'small' : 'medium'}>
                                <TableHeadCustom
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={tableData.length}
                                numSelected={selected.length}
                                onSort={handlePaginationOnSort}
                                />

                                    <TableBody>
                                        {productoCodigos
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => (
                                                <PackTableRow
                                                    key={row.Id}
                                                    row={row}
                                                    selected={selected.includes(row.Id.toString())}
                                                    onSelectRow={() => onSelectRow(row.Id.toString())}
                                                    onDeleteRow={() => handleDeleteRow(row.Id.toString())}
                                                    onEditRow={() => handleEditRow(row.Id.toString(), row)}
                                                    onGuardar={()=>{}}
                                                />
                                            ))}
                                        
                                        <LoadingTable isLoading={isLoading} />
                                        <TableEmptyRows
                                            height={denseHeight}
                                            emptyRows={emptyRows(page, rowsPerPage, count)}
                                        />

                                        <TableNoData isNotFound={isNotFound} />
                                    </TableBody>
                                </Table>
                            </Scrollbar>

                        </TableContainer>

                        <TablePaginationCustom
                            count={count}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeSize}
                            dense={dense}
                        />
                    </Card>
                </>

            </Container>
            </>
    )

}