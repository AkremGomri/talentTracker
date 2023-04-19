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
  CircularProgress,
} from '@mui/material';
// components
import { transformDate } from '../services/date';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, RoleListToolbar } from '../sections/@dashboard/user';
// mock
import RoleModal from '../components/modal/RoleModal';
import { deleteOneRoleById, setRoles, setSelectedRole } from '../redux/features/role';
import AddPermission from '../components/modal/AddPermission';
import request from '../services/request';
import Iconify from '../components/iconify/Iconify';
// import { Field } from '../components/treeView/MyTreeItem';
import MyTreeView from '../components/treeView/MyTreeView';
import MyTreeItem from '../components/treeView/MyTreeItem';

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

export default function FieldsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [canModify, setCanModify] = useState(false);

  // const [data, setData] = useState([
  //   // {
  //   //   "_id": "63465132131",
  //   //   "name": "devOps",
  //   //   "subFields": {
  //   //     "_id": "55462222131",
  //   //     "name": "jenkins"
  //   //   }
  //   // }
  // ]);
  // const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("canModify: ",canModify);
  }, [canModify])
  useEffect(() => {
    const fetchData = async () => {
      // const result = await axios.get('/api/data');
      const result = [
        {
          _id: "65465132131",
          name: "development",
          subFields: [
            {
              _id: "55465132131",
              name: "web",
              skills: [
                {
                  _id: "45465132131",
                  name: "React",
                  elementSkills: [
                    {
                      _id: "35465132131",
                      name: "knows React UseState"
                    },
                    {
                      _id: "32465132131",
                      name: "knows React UseEffect"
                    },
                    {
                      _id: "31465132131",
                      name: "knows React Components"
                    }
                  ]
                },
                {
                  _id: "64684534331",
                  name: "Angular",
                  elementSkills: [
                    {
                      _id: "39465132131",
                      name: "knows Angular services"
                    },
                    {
                      _id: "36965132131",
                      name: "knows Angular modules"
                    },
                    {
                      _id: "38965132131",
                      name: "knows Angular components"
                    }
                  ]
                }
              ]
            },
            {
              _id: "64465132131",
              name: "mobile",
              skills: [
                {
                  _id: "54465132131",
                  name: "Android",
                  elementSkills: [
                    {
                      _id: "44462132131",
                      name: "knows Android intents"
                    },
                    {
                      _id: "44462112131",
                      name: "knows Android Fragments"
                    },
                    {
                      _id: "44462132121",
                      name: "knows Android Activity"
                    }
                  ]
                },
                {
                  _id: "53465132131",
                  name: "Flutter",
                  elementSkills: [
                    {
                      _id: "54265132131",
                      name: "knows Flutter services"
                    },
                    {
                      _id: "54165132131",
                      name: "knows Flutter modules"
                    },
                    {
                      _id: "54265532131",
                      name: "knows Flutter components"
                    }
                  ]
                }
              ]
            }
          ]
        }
        // {
        //   "_id": "63465132131",
        //   "name": "devOps",
        //   "subFields": {
        //     "_id": "55462222131",
        //     "name": "jenkins"
        //   }
        // }
      ];

      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  /*                            */
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);

  const handleExpandClick = () => {
    console.log("handleExpandClick");
    setExpanded(
      (oldExpanded) =>
        // oldExpanded.length === 0 ? data.subFields.flat(Infinity).map( d => d._id ) : [],
        null
    );
  };
  //



  // useEffect(() => {
  //   const fetchData = async () => {
  //     // const result = await axios.get('/api/data');
  //     const result = [
  //       {
  //         _id: "65465132131",
  //         name: "development",
  //         subFields: [
  //           {
  //             _id: "55465132131",
  //             name: "web",
  //             skills: [
  //               {
  //                 _id: "45465132131",
  //                 name: "React",
  //                 elementSkills: [
  //                   {
  //                     _id: "35465132131",
  //                     name: "knows React UseState"
  //                   },
  //                   {
  //                     _id: "32465132131",
  //                     name: "knows React UseEffect"
  //                   },
  //                   {
  //                     _id: "31465132131",
  //                     name: "knows React Components"
  //                   }
  //                 ]
  //               },
  //               {
  //                 _id: "444651321222",
  //                 name: "Angular",
  //                 elementSkills: [
  //                   {
  //                     _id: "39465132131",
  //                     name: "knows Angular services"
  //                   },
  //                   {
  //                     _id: "36965132131",
  //                     name: "knows Angular modules"
  //                   },
  //                   {
  //                     _id: "38965132131",
  //                     name: "knows Angular components"
  //                   }
  //                 ]
  //               }
  //             ]
  //           },
  //           {
  //             _id: "64465132131",
  //             name: "mobile",
  //             skills: [
  //               {
  //                 _id: "54465132131",
  //                 name: "Android",
  //                 elementSkills: [
  //                   {
  //                     _id: "44462132131",
  //                     name: "knows Android intents"
  //                   },
  //                   {
  //                     _id: "44462112131",
  //                     name: "knows Android Fragments"
  //                   },
  //                   {
  //                     _id: "44462132121",
  //                     name: "knows Android Activity"
  //                   }
  //                 ]
  //               },
  //               {
  //                 _id: "53465132131",
  //                 name: "Flutter",
  //                 elementSkills: [
  //                   {
  //                     _id: "54265132131",
  //                     name: "knows Flutter services"
  //                   },
  //                   {
  //                     _id: "54165132131",
  //                     name: "knows Flutter modules"
  //                   },
  //                   {
  //                     _id: "54265532131",
  //                     name: "knows Flutter components"
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         _id: "95495132131",
  //         name: "development",
  //         subFields: [
  //           {
  //             _id: "55495132131",
  //             name: "web",
  //             skills: [
  //               {
  //                 _id: "45495132131",
  //                 name: "React",
  //                 elementSkills: [
  //                   {
  //                     _id: "35495132131",
  //                     name: "knows React UseState"
  //                   },
  //                   {
  //                     _id: "32495132131",
  //                     name: "knows React UseEffect"
  //                   },
  //                   {
  //                     _id: "31495132131",
  //                     name: "knows React Components"
  //                   }
  //                 ]
  //               },
  //               {
  //                 name: "Angular",
  //                 elementSkills: [
  //                   {
  //                     _id: "39495132131",
  //                     name: "knows Angular services"
  //                   },
  //                   {
  //                     _id: "39995132131",
  //                     name: "knows Angular modules"
  //                   },
  //                   {
  //                     _id: "38995132131",
  //                     name: "knows Angular components"
  //                   }
  //                 ]
  //               }
  //             ]
  //           },
  //           {
  //             _id: "94495132131",
  //             name: "mobile",
  //             skills: [
  //               {
  //                 _id: "54495132131",
  //                 name: "Android",
  //                 elementSkills: [
  //                   {
  //                     _id: "44492132131",
  //                     name: "knows Android intents"
  //                   },
  //                   {
  //                     _id: "44492112131",
  //                     name: "knows Android Fragments"
  //                   },
  //                   {
  //                     _id: "44492132121",
  //                     name: "knows Android Activity"
  //                   }
  //                 ]
  //               },
  //               {
  //                 _id: "53495132131",
  //                 name: "Flutter",
  //                 elementSkills: [
  //                   {
  //                     _id: "54295132131",
  //                     name: "knows Flutter services"
  //                   },
  //                   {
  //                     _id: "54195132131",
  //                     name: "knows Flutter modules"
  //                   },
  //                   {
  //                     _id: "54295532131",
  //                     name: "knows Flutter components"
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //       // {
  //       //   "_id": "63465132131",
  //       //   "name": "devOps",
  //       //   "subFields": {
  //       //     "_id": "55462222131",
  //       //     "name": "jenkins"
  //       //   }
  //       // }
  //     ];
  //     console.log(data);

  //     setData(result);
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, []);


  const currentRole = useRef();

  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.all);

  // const [open, setOpen] = useState(null);

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

  const handleOpenEditRoleModal = () => {
    setOpenEditRoleModel(true);
  };

  const handleCloseEditRoleModal = () => {
    setOpenEditRoleModel(false);
  };

  const handleOpenAddRoleModal = () => {
    setOpenAddRoleModel(true);
  };

  const handleCloseAddRoleModal = () => {
    setOpenAddRoleModel(false);
  };

  const deleteRole = async (roleId) => {
    setOpen(false);
      // axios POST request

      try{
        await request.send('DELETE', `/api/admin/role/${roleId}`);
        dispatch(deleteOneRoleById(roleId));
      } catch (error) {
        console.log("error: ", error);
        alert(error.code)
      }
  };

  const [openEditRoleModel, setOpenEditRoleModel] = useState(false);
  const [openAddRoleModal, setOpenAddRoleModel] = useState(false);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.length) : 0;

  const filteredRoles = applySortFilter(roles, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredRoles.length && !!filterName;

  useEffect(() => {
    async function getRoles() {
      const response = await request.get(`/api/admin/roles`);
      let ROLESLIST = response.data.roles;
      ROLESLIST = ROLESLIST.map((role) => ({
          ...role,
          updatedAt: transformDate(role.updatedAt),
        })
      );
      dispatch(setRoles(ROLESLIST))
    }
    getRoles()
  }, [])

  if (loading) {
    return <CircularProgress />;
  }

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
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
            // onClick={handleOpenAddRoleModal}
            onClick={() => setCanModify(!canModify)}
          >
            {canModify ? "modify": "done"}
          </Button>
        </Stack>

        {/* <div>
          {data? data.map((field) => <Field key={field._id} data={field} />): <CircularProgress />}
        </div> */}
        <MyTreeView
          canModify={canModify}
          open={open}
          setExpanded={setExpanded}
          expanded={expanded}
          handleExpandClick={handleExpandClick}
        >
        <Box sx={{ maxWidth: "200px" }}>
          {data.map((el, index) => (
            <MyTreeItem
              canModify={canModify}
              secret="ahh"
              key={`${el._id}-${index}`}
              id={el._id}
              name={el.name}
              expanded={expanded}
              style={{ maxWidth: "200px", backgroundColor: "red" }}
            >
              {el.subFields.map((e, i) => (
                <MyTreeItem
                  canModify={canModify}
                  secret="****"
                  key={`${e._id}-${i}`}
                  id={e._id}
                  name={e.name}
                  expanded={expanded}
                >
                  {e.skills.map((elem, ind) => (
                    <MyTreeItem
                      canModify={canModify}
                      key={`${elem._id}-${ind}`}
                      id={elem._id}
                      name={elem.name}
                      expanded={expanded}
                    >
                      {elem.elementSkills.map((element, inde) => (
                        <MyTreeItem
                          canModify={canModify}
                          secret="sdf"
                          key={`${element._id}-${ind}`}
                          id={element._id}
                          name={element.name}
                          expanded={expanded}
                        />
                      ))}
                    </MyTreeItem>
                  ))}
                </MyTreeItem>
              ))}
            </MyTreeItem>
          ))}
        </Box>
        </MyTreeView>
      </Container>

      <RoleModal open={openEditRoleModel} handleClose={handleCloseEditRoleModal} />
      <AddPermission open={openAddRoleModal} handleClose={handleCloseAddRoleModal} />

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