/* eslint-disable no-unused-expressions */
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';


// components
import ToolBar from '../components/toolBar';
import { transformDate } from '../services/date';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, RoleListToolbar } from '../sections/@dashboard/user';
// mock
import RoleModal from '../components/modal/RoleModal';
import AddPermission from '../components/modal/AddPermission';
import request from '../services/request';
import Iconify from '../components/iconify/Iconify';
// import { Field } from '../components/treeView/MyTreeItem';
import MyTreeView from '../components/treeView/MyTreeView';
import MyTreeItem from '../components/treeView/MyTreeItem';
import { setFields, deleteItem } from '../redux/features/skillMatrix';
import AddCategory from '../components/modal/AddCategory';
import { selectAllFields, selectSelectedItem } from '../redux/utils/skillMatrix';
import AddSkillItem from '../components/modal/AddSkillItem';

export default function FieldsPage() {
  // const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const fields = useSelector(selectAllFields);

  const [loading, setLoading] = useState(true);
  const [canModify, setCanModify] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);

  const allTreeItems = [];

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await request.get('/api/fields');
      data.map((field) => {
        field.subFields && field.subFields.map((subField) => {
            subField.skills.length && subField.skills.map((skill) => {
            skill.skillElements && skill.skillElements.map((skillElement) => {
              skillElement.type = "skillElement";
              return skillElement;
            });
            skill.type = "skill";
            return skill;
          });
          subField.type = "subField";
          return subField;
        });
        field.type = "field";
        return field;
      });
      dispatch(setFields(data))
      setLoading(false);
    };

    fetchData();
  }, []);

  
  const handleExpandClick = () => {
    console.log("handleExpandClick");
    console.log("allTreeItems: ",allTreeItems);
    setExpanded(
      (oldExpanded) =>
        oldExpanded.length === 0 ? allTreeItems : [],
        null
    );
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

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
            Skill Matrix
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
        <Card >
   
        <ToolBar open={open}
          expanded={expanded} 
          handleExpandClick={handleExpandClick} 
          
          />
   
        <MyTreeView
          // onNodeSelect={handleNodeSelect}
          canModify={canModify}
          open={open}
          setExpanded={setExpanded}
          expanded={expanded}
          // handleExpandClick={handleExpandClick}
        >
        <Box sx={{ maxWidth: "200px" }}>
          { fields && fields.map((el, index) => {
            allTreeItems.push(`${el._id}-${el.name}-${el.type}-${index}`)
            return (
            <MyTreeItem
              canModify={canModify}
              secret="ahh"
              key={`${el._id}-${index}`}
              id={`${el._id}-${el.name}-${el.type}-${index}`}
              name={el.name}          
              expanded={expanded}
            >
              {el.subFields && el.subFields.map((e, i) => {
                allTreeItems.push(`${e._id}-${e.name}-${e.type}-${index}-${i}`)
                return (
                  <MyTreeItem
                    canModify={canModify}
                    secret="****"
                    key={`${e._id}-${i}`}
                    id={`${e._id}-${e.name}-${e.type}-${index}-${i}`}
                    name={e.name}
                    expanded={expanded}
                    >
                    {e.skills && e.skills.map((elem, ind) => {
                      allTreeItems.push(`${elem._id}-${elem.name}-${elem.type}-${index}-${i}-${ind}`)
                      return (
                        <MyTreeItem
                          canModify={canModify}
                          key={`${elem._id}-${ind}`}
                          id={`${elem._id}-${elem.name}-${elem.type}-${index}-${i}-${ind}`}
                          name={elem.name}
                          expanded={expanded}
                        >
                          {elem.skillElements && elem.skillElements.map((element, inde) => {
                            allTreeItems.push(`${element._id}-${element.name}-${element.type}-${index}-${i}-${ind}-${inde}`)
                            return (
                            <MyTreeItem
                              canModify={canModify}
                              secret="sdf"
                              key={`${element._id}-${inde}`}
                              id={`${element._id}-${el.element}-${element.type}-${index}-${i}-${ind}-${inde}`}
                              name={element.name}
                              expanded={expanded}
                            />
                            )}
                          )}
                        </MyTreeItem>
                      )}
                    )}
                  </MyTreeItem>
                )}
              )}
            </MyTreeItem>
          )}
          )}
        </Box>
        </MyTreeView>
        </Card>
      </Container>

      {/* <RoleModal open={openEditRoleModel} handleClose={handleCloseEditRoleModal} />
      <AddPermission open={openAddRoleModal} handleClose={handleCloseAddFieldModal} /> */}

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
        <MenuItem onClick={null}>
          <Iconify  icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={
          null
          // () => deleteSelectedItem(currentRole.current)
          } sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>


        
    </>
  );
}