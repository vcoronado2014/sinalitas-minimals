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
import UserCardProfesor from 'src/sections/@dashboard/user/cards/UserCardProfesor';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { getUsers, deleteUser, putUser } from '../../redux/slices/user';
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
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
import LoadingTable from '../../components/loading-table/LoadingTable';
import useResponsive from '../../hooks/useResponsive';


// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'activo', 'inactivo'];

const ROLE_OPTIONS = [
  'all',
  'Super Administrador',
  'Supervisor',
  'Profesor',
];

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', align: 'left', width: 250, minWidth: 250 },
  /* { id: 'company', label: 'Company', align: 'left' }, */
  { id: 'comunas', label: 'Comunas', align: 'left' },
  { id: 'role', label: 'Rol', align: 'left' },
  { id: 'run', label: 'Usuario', align: 'left' },
  { id: 'phoneNumber', label: 'Teléfono', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'status', label: 'Estado', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserListPage() {
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

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    users,
    count,
    isLoading
  } = useSelector((state) => state.user);

  const isDesktop = useResponsive('up', 'md');

  const [tableData, setTableData] = useState(users);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');


  const dataInPage = users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!count && !!filterName) ||
    (!count && !!filterRole) ||
    (!count && !!filterStatus);


  useEffect(() => {
    dispatch(
      getUsers(
        {
          status: filterStatus,
          name: filterName,
          role: filterRole,
        },
        {
          page: 0,
          size: rowsPerPage,
          direction: order,
          orderBy,
        }
      ))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterChange = (
    property: string,
    value: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setPage(0);
    setState(value);
    dispatch(
      getUsers(
        {
          status: property === 'status' ? value : filterStatus,
          name: property === 'name' ? value : filterName,
          role: property === 'role' ? value : filterRole,
        },
        {
          page: 0,
          size: rowsPerPage,
          direction: order,
          orderBy,
        }
      )
    );
  };

  const handlePaginationChange = (
    property: 'page' | 'size' | 'sort',
    value: Sort | number
  ) => {
    dispatch(
      getUsers(
        {
          status: filterStatus,
          name: filterName,
          role: filterRole,
        },
        {
          page: property === 'page' && typeof value === 'number' ? value : page,
          size: property === 'size' && typeof value === 'number' ? value : rowsPerPage,
          direction: property === 'sort' && typeof value === 'object' ? value.order : order,
          orderBy: property === 'sort' && typeof value === 'object' ? value.orderBy : orderBy,
        }
      )
    );
  };

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event> | null, newValue: string) => {
    handleFilterChange('status', newValue, setFilterStatus)
  };

  const handleFilterName = debounce((event: React.ChangeEvent<HTMLInputElement> | string) => {
    handleFilterChange(
      'name',
      typeof event !== 'string' ? event.target.value : event,
      setFilterName
    )
  }, 300);

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement> | string) => {
    handleFilterChange(
      'role',
      typeof event !== 'string' ? event.target.value : event,
      setFilterRole
    )
  };

  const handlePaginationOnSort = (id: string) => {
    handlePaginationChange('sort', onSort(id))
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    handlePaginationChange('page', onChangePage(null, newPage))
  }

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    handlePaginationChange('size', onChangeRowsPerPage(event))
  }


  const handleDeleteRow = (id: string) => {

  };

  const handleDeleteRows = (selectedRows: string[]) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === count) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  // const handleEditRow = (id: string) => {
  const handleEditRow = (id: string, row: any) => {
    // navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)), {state: row});
  };

  const handleResetFilter = () => {
    handleFilterName('');
    handleFilterRole('all');
    handleFilterStatus(null, 'all');
  };

  return (
    <>
      <Helmet>
        <title> Listado Profesores</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Listado Profesores"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            isDesktop ?
            { name: 'Profesores', href: PATH_DASHBOARD.user.root }
            : { name: 'Profesores', href: PATH_DASHBOARD.user.root },
            { name: 'Listado' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Nuevo Profesor
            </Button>
          }
        />

        {
          isDesktop ? (
            <Card>
              <Tabs
                value={filterStatus}
                onChange={handleFilterStatus}
                sx={{
                  px: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                {STATUS_OPTIONS.map((tab) => (
                  <Tab key={tab} label={tab} value={tab} />
                ))}
              </Tabs>

              <Divider />

              <UserTableToolbar
                isFiltered={isFiltered}
                optionsRole={ROLE_OPTIONS}
                onFilterName={handleFilterName}
                onFilterRole={handleFilterRole}
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
                      tableData.map((row) => row.id)
                    )
                  }
                  action={
                    <Tooltip title="Desactivar">
                      <IconButton color="primary" onClick={handleOpenConfirm}>
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </Tooltip>
                  }
                />

                <Scrollbar>
                  <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={tableData.length}
                      numSelected={selected.length}
                      onSort={handlePaginationOnSort}
                    />

                    <TableBody>
                      {users
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <UserTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            /* onEditRow={() => handleEditRow(row.name)} */
                            onEditRow={() => handleEditRow(row.name, row)}
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
                //
                dense={dense}
              /* onChangeDense={onChangeDense} */
              />
            </Card>
          ) : 
          (
            <><UserTableToolbar
                isFiltered={isFiltered}
                optionsRole={ROLE_OPTIONS}
                onFilterName={handleFilterName}
                onFilterRole={handleFilterRole}
                onResetFilter={handleResetFilter} /><Box gap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}>
                  {users.map((user) => (
                    <UserCardProfesor key={user.id} user={user} />
                  ))}
                </Box></>
          )
        }
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Desactivar"
        content={
          <>
            Esta seguro de desactivar <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
