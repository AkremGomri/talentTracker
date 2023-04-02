import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Card,
  Modal,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
} from '@mui/material';
// components
import axios from 'axios';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, RoleListToolbar } from '../sections/@dashboard/user';
// mock
import roles from '../_mock/user';
import RoleModal from '../components/modal/RoleModal';
import { addManyRoles, deleteOneRoleById, setSelectedRole } from '../redux/features/role';
import AddPermission from '../components/modal/AddPermission';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'nbUsers', label: 'Number Of Users', alignRight: false },
  { id: 'lastUpdated', label: 'Last Updated', alignRight: false },
  { id: 'permissions', label: 'Permissions', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function PermissionsPage() {

  const currentRole = useRef();

  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.all);

  // const [ roles, setRoles ] = useState([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event, data) => {
    setOpen(event.currentTarget);
    currentRole.current = data._id;
    dispatch(setSelectedRole(data));
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = roles.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    console.log("name: ",name);
    console.log("selected: ",selected);
    let newSelected = [];
    if (selectedIndex === -1) {
      console.log("lenna wa7di == -1");
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      console.log("lenna wa7di == 0");
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      console.log("lenna wa7di == selected.length - 1");
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      console.log("lenna wa7di > 0");
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    console.log("selected: ",selected);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenEditRoleModal = () => {
    setOpenEditRoleModel(true);
  };

  const handleCloseEditRoleModal = () => {
    setOpenEditRoleModel(false);
  };

  const handleOpenAddRoleModal = () => {
    console.log("handleOpenAddRoleModal", openAddRoleModel);
    setOpenAddRoleModel(true);
  };

  const handleCloseAddRoleModal = () => {
    setOpenAddRoleModel(false);
  };

  const deleteRole = (roleId) => {
    setOpen(false);
    dispatch(deleteOneRoleById(roleId));
    // setRoles(roles.filter((role) => role._id !== roleId));
  };

  const [openEditRoleModel, setOpenEditRoleModel] = useState(false);
  const [openAddRoleModel, setOpenAddRoleModel] = useState(false);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.length) : 0;

  const filteredRoles = applySortFilter(roles, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredRoles.length && !!filterName;

  useEffect(() => {
    async function getRoles() {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/roles`);
      let ROLESLIST = response.data.data.roles;
      ROLESLIST = ROLESLIST.map((role) => ({
          ...role,
          updatedAt: transformDate(role.updatedAt),
        })
      );
      dispatch(addManyRoles(ROLESLIST))
      // setRoles(ROLESLIST);
    }
    getRoles()
  }, [])

  return (
    <>
      <Helmet>
        <title> Akrem GOMRI | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Permissions
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAddRoleModal}>
            New Permission
          </Button>
        </Stack>

        <Card>
          <RoleListToolbar selectedRoles={selected} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={roles.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role) => {
                    const { _id: id, name, permissions, updatedAt, nbUsers } = role;
                    const selectedRole = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedRole}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedRole} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={null} /> */}
                            <Typography variant="subtitle2" noWrap sx={{ ml: 2 }}>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          <Typography variant="subtitle2" noWrap sx={{ pl: 2 }}>
                            {nbUsers}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">
                          <Typography variant="subtitle2" noWrap sx={{ pl: 2 }}>
                            {updatedAt}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, role)}>
                            <Iconify icon={'eva:more-vertical-fill'}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={roles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <RoleModal open={openEditRoleModel} handleClose={handleCloseEditRoleModal} />
      <AddPermission open={openAddRoleModel} handleClose={handleCloseAddRoleModal} />

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenEditRoleModal}>
          <Iconify  icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => deleteRole(currentRole.current)} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

function transformDate(d) {
  const date = new Date(d);
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return date.toLocaleString('en-GB', options);
}

transformDate("2023-03-29T17:36:08.597Z")