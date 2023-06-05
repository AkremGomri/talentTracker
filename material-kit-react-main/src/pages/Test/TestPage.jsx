/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
/* eslint-disable prefer-template */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
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
} from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CreateTestModal from '../../components/modal/CreateTestModal';
// sections
// eslint-disable-next-line import/no-useless-path-segments
import { TestListHead, TestListToolbar } from '../../pages/Test/';
// mock

import request from '../../services/request';
import SnackBar from '../../components/others/SnackBar';
// import USERLIST from '../../_mock/user';
import { selectAllUsers } from '../../redux/utils/user';
import MyDialog from '../../components/dialog/MyDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'creator', label: 'Creator', alignRight: false, childrenIds: ["fullName"]},
  { id: 'AssignedToUsers', label: 'Assigned to Users', alignRight: false },
  { id: 'skills', label: 'Number OF Skills', alignRight: false },
  { id: 'number of questions', label: 'Number Of Questions', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  let x1;
  let x2;
  if(orderBy === 'number of questions') { 
    x1 = a.skills.reduce((acc, curr) => acc + curr.childrenItems.length, 0);
    x2 = b.skills.reduce((acc, curr) => acc + curr.childrenItems.length, 0);
  }
  if((typeof a[orderBy] === 'string' || typeof a[orderBy] === 'number') && (typeof b[orderBy] === 'string' || typeof b[orderBy] === 'number')) {
    x1 = a[orderBy];
    x2 = b[orderBy];
  } else if(Array.isArray(a[orderBy]) && Array.isArray(b[orderBy])) {
    x1 = a[orderBy].length;
    x2 = b[orderBy].length;
  } else if(typeof a[orderBy] === 'object' && typeof b[orderBy] === 'object') {
    const x = TABLE_HEAD.find((item) => item.id === orderBy);
    if(x?.childrenIds) {
      x2 = x.childrenIds.reduce((acc, curr) => acc + " " + a[orderBy][curr], "");
      x1 = x.childrenIds.reduce((acc, curr) => acc + " " + b[orderBy][curr], "");
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {

  const currentUser = useRef();

  const [tests, setTests] = useState([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('email');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [ openAddUserModal, setOpenAddUserModal] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const  [displaySnackBar, setDisplaySnackBar] = useState({
    open: false,
    message: '',
  });

  const handleOpenMenu = (event, data) => {
    setOpen(event.currentTarget);
    currentUser.current = data._id;
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
      const newSelecteds = tests.map((n) => n.name);
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

  const handleConfirm = () => {
    // Do something on confirmation
    deleteTest(currentUser.current)
    setOpenDeleteDialog(false);
  };

  const deleteTests = async (names) => {
    setOpen(false);
      // axios POST request
      try{
        await request.send('DELETE', `/api/test/Many`, names);
        setTests(tests.filter(test => !names.includes(test.name))); 
      } catch (error) {
        console.log("error: ", error);
        alert(error.code)
      }
  };

  const deleteTest = async (userId) => {
    setOpen(false);
      // axios POST request
      try{
        await request.send('DELETE', `/api/test/${userId}`);
        setTests(tests.filter(test => test._id !== currentUser.current)); 
      } catch (error) {
        console.log("error: ", error);
        alert(error.code)
      }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tests.length) : 0;

  const filteredTests = applySortFilter(tests, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredTests.length && !!filterName;

  useEffect(() => {
    async function getUsers() {
      const { tests } = await request.get(`/api/test/`);
      setTests(tests)
    }
    getUsers()
  }, []);

  return (
    <>
      <Helmet>
        <title> Akrem GOMRI | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Tests
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenAddUserModal(true)}>
            New Test
          </Button>
        </Stack>

        <Card>
          <TestListToolbar selectedTests={selected} filterName={filterName} onFilterName={handleFilterByName} deleteTests={deleteTests} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TestListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tests.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredTests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((test) => {
                    const { _id: id, name, creator, AssignedToUsers, skills, manager, company, avatarUrl, isVerified } = test;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell align="left">{name}</TableCell>
     
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={creator?.fullName} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                            {creator?.fullName? `${creator.fullName}` : "Not set"}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left" sx={{pl: 9}}>{AssignedToUsers? AssignedToUsers.reduce((acc) => acc+1, 0) : "Not set"}</TableCell>

                        <TableCell align="left" sx={{pl: 9}}>{skills? skills.reduce((acc) => acc+1, 0) : "Not set"}</TableCell>

                        <TableCell align="left" sx={{pl: 9}}>{skills? skills.reduce((skillAcc, skill) => skillAcc + (skill.childrenItems? skill.childrenItems.reduce((acc, question)=> acc + 1, 0) : 0), 0) : "Not set"}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, test)}>
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
            count={tests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <SnackBar open={displaySnackBar.open} message={displaySnackBar.message} handleOpen={(e, data) => setDisplaySnackBar({...displaySnackBar, open: data})}/>

      </Container>

      <CreateTestModal open={openAddUserModal} handleClose={() => setOpenAddUserModal(false)} openSnackBar={setDisplaySnackBar} restrictedNames={tests.map(test => test.name)} setTests={setTests} />

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
        {/* <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Edit
          </MenuItem> */}

        <MenuItem onClick={() => setOpenDeleteDialog(true)} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
      </Popover>

      <MyDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        action={handleConfirm}
        message={`are you sure you want to delete "${tests.reduce((acc, test) => { if(test._id === currentUser.current) return acc + test.name; else return acc } , "")}" ?`}
      />
    </>
  );
}