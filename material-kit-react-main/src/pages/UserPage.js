/* eslint-disable prefer-template */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Card,
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
  Tooltip,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import CreateUserModal from '../components/modal/CreateUserModal';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { deleteOneUserById, addManyUsers, setUsers, setSelectedUser } from '../redux/features/user';

import request from '../services/request';
import SnackBar from '../components/others/SnackBar';
// import USERLIST from '../_mock/user';
import { selectAllUsers } from '../redux/utils/user';
import FileUpload from '../components/inputs/FileUpload';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false, childrenIds: ["name"] },
  { id: 'manager', label: 'Manager', alignRight: false, childrenIds: ["email"] },
  { id: 'isConfirmed', label: 'Verified', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  let x1;
  let x2;
  if((typeof a[orderBy] === 'string' || typeof a[orderBy] === 'number' || typeof a[orderBy] === 'boolean') && (typeof b[orderBy] === 'string' || typeof b[orderBy] === 'number' || typeof b[orderBy] === 'boolean')) {
    x1 = a[orderBy];
    x2 = b[orderBy];
  } else if(Array.isArray(a[orderBy]) && Array.isArray(b[orderBy])) {
    x1 = a[orderBy].length;
    x2 = b[orderBy].length;
  } else if(typeof a[orderBy] === 'object' && typeof b[orderBy] === 'object') {
    const x = TABLE_HEAD.find((item) => item.id === orderBy);
    if(x?.childrenIds) {
      x2 = x.childrenIds.reduce((acc, curr) => a[orderBy]? acc + " " + a[orderBy][curr] : acc, "");
      x1 = x.childrenIds.reduce((acc, curr) => b[orderBy]? acc + " " + b[orderBy][curr] : acc, "") ;
    } 
  }

  if (x2 < x1) {
    return -1;
  }
  if (x2 > x1) {
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
    return filter(array, (_user) => _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {

  const currentUser = useRef();

  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('email');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [ openAddUserModal, setOpenAddUserModal] = useState(false);

  const  [displaySnackBar, setDisplaySnackBar] = useState({
    open: false,
    message: '',
  });

  const handleFileUpload = async (files) => {
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file); // Make sure the file is appended to the FormData object
  
    try {
      const response = await request.post('/api/user/upload-excel', formData,'multipart/form-data', // Set the appropriate content type for file upload
      );

      if (response.status === 'success') {
        setDisplaySnackBar({
          open: true,
          message: 'File uploaded successfully',
        });

        dispatch(addManyUsers(response.data.users));
      }
    } catch (error) {
      // Handle any errors that occur during the upload
      console.error('Error uploading file:', error);
    }
  };
  
  
  const handleOpenMenu = (event, data) => {
    setOpen(event.currentTarget);
    currentUser.current = data._id;
    dispatch(setSelectedUser(data));  
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
      const newSelecteds = users.map((n) => n.email);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
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

  const deleteRole = async (userId) => {
    setOpen(false);
      // axios POST request
      try{
        await request.send('DELETE', `/api/user/${userId}`);
        dispatch(deleteOneUserById(userId));
      } catch (error) {
        console.log("error: ", error);
        alert(error.code)
      }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => {
    async function getUsers() {
      const response = await request.get(`/api/user/all`);
      let USERSLIST = response.data.users;
      USERSLIST = USERSLIST.map((user) => ({
          ...user,
        })
      );
      dispatch(setUsers(USERSLIST))
    }
    getUsers()
  }, []);

  console.log("filteredUsers: ", filteredUsers);

  return (
    <>
      <Helmet>
        <title> Dashboard | Talent Tracker </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Button 
              variant="contained" 
              startIcon={<Iconify icon="eva:plus-fill" />} 
              onClick={() => setOpenAddUserModal(true)}
              sx={{ height: '35px' }}
              >
                New User
            </Button>
            <FileUpload handleFileUpload={handleFileUpload}/>

          </Box>
        </Stack>

        <Card>
          <UserListToolbar selectedUsers={selected} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
                    const { _id: id, email, role, manager, company, avatarUrl, isConfirmed } = user;
                    const selectedUser = selected.indexOf(email) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, email)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={email} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {email}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">still not set</TableCell>

                        <TableCell align="left">{role? role.name : "Not set"}</TableCell>

                      {
                        manager?.email ? <TableCell align="left">{manager.email}</TableCell> : <TableCell align="left">Not set</TableCell>
                      } 
                        <TableCell align="left">
                          {/* <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label> */}
                          <Label color={(!isConfirmed  && 'error') || 'success'}>{!!isConfirmed ? "Yes" : "No"}</Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, user)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
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
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <SnackBar open={displaySnackBar.open} message={displaySnackBar.message} handleOpen={(e, data) => setDisplaySnackBar({...displaySnackBar, open: data})}/>

      </Container>

      <CreateUserModal open={openAddUserModal} handleClose={() => setOpenAddUserModal(false)} openSnackBar={setDisplaySnackBar} />

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
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => deleteRole(currentUser.current)} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}