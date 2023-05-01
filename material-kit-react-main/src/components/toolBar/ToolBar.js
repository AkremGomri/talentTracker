/* eslint-disable no-unreachable */
import PropTypes from 'prop-types';
// @mui
import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// component
import Iconify from '../iconify';
import MyDialog from '../dialog/MyDialog';
import { selectSelectedItem } from '../../redux/utils/skillMatrix';
import { deleteItem } from '../../redux/features/skillMatrix';
import request from '../../services/request';
import AddCategory from '../modal/AddCategory';
import AddSkillItem from '../modal/AddSkillItem';
// import request from '../../../services/request';
// import { addManyUsers, deleteManyUsersByName } from '../../../redux/features/user';

// ----------------------------------------------------------------------

const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.primary,
    backgroundColor: theme.palette.text.secondary,
    textTransform: 'capitalize',
    '&:hover': {
        backgroundColor: alpha(theme.palette.text.secondary, theme.palette.action.hoverOpacity),
    },
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
}));


const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

ToolBar.propTypes = {
  selectedUsers: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  handleExpandClick: PropTypes.func,
  handleOpenAddCategory: PropTypes.func,
  expanded: PropTypes.array,
};

export default function ToolBar(props) {
  const { selectedUsers, filterName, onFilterName, handleExpandClick, expanded } = props;
  const dispatch = useDispatch();

  const selectedItem = useSelector(selectSelectedItem);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddSkillItem, setOpenAddSkillItem] = useState(false);

  const handleConfirm = () => {
    // Do something on confirmation
    deleteSelectedItem(selectedItem);
    setOpenDeleteDialog(false);
  };

  const handleOpenAddCategory = (data=null) => {
    if (typeof data === "boolean") setOpenAddCategory(data);
    else setOpenAddCategory(!openAddCategory);
  };

  return (
    <StyledRoot sx={{ bgcolor: "#F4F6F8" }}>

        {/* <StyledSearch
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        /> */}

        <StyledButton onClick={handleExpandClick} >
            <Iconify icon="ic:baseline-add" />  {expanded.length ? "Close all" : "Open all"}
        </StyledButton>

        <StyledButton onClick={() => handleOpenAddCategory(true)}>
            <Iconify icon="ic:baseline-add" /> add Category
        </StyledButton>

        <StyledButton >
            <Iconify icon="ic:baseline-add" /> add item
        </StyledButton>

        <StyledButton >
            <Iconify icon="ic:baseline-add" /> view item
        </StyledButton>

        <StyledButton >
            <Iconify icon="ic:baseline-add" /> edit item
        </StyledButton>

        <StyledButton sx={{ bgColor: "red" }} onClick={() => setOpenDeleteDialog(true)} >
            <Iconify icon="ic:baseline-add" /> delete item
        </StyledButton>

        <StyledButton >
            <Iconify icon="ic:baseline-add" /> import items
        </StyledButton>

          
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" /> 
          </IconButton>
        </Tooltip>

        <MyDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} action={handleConfirm} message={`are you sure you want to delete this ${selectedItem.type} : ${selectedItem.name} ?`}/>
        <AddCategory open={openAddCategory} setOpen={setOpenAddCategory} />
        <AddSkillItem open={openAddSkillItem} setOpen={setOpenAddSkillItem} />
    </StyledRoot>
  );

  
  async function deleteSelectedItem (item) {    
    try{
        if(item.type === 'field') await request.send('DELETE', `/api/fields/${item._id}`);
        else if(item.type === 'subField') await request.send('DELETE', `/api/subFields/${item._id}`)
        else if(item.type === 'skill') await request.send('DELETE', `/api/skills/${item._id}`)
        // else if(item.type === 'skill') await request.send('DELETE', `/api/skills/${item._id}`);
        dispatch(deleteItem(item));
      } catch (error) {
        console.log("error: ", error);
        alert(error.code)
      }
    };

    async function deleteAllSelectedUsers() {
      try{
        //   const response = await request.send('delete', '/api/user/many', selectedUsers);
        //   if(response.result?.deletedCount <=0 ){
          //     return;
          //   }
          //   console.log("selectedUsers ouii: ",selectedUsers);
    //   dispatch(deleteManyUsersByName(selectedUsers));
    console.log("marja3nech");
  } catch (error) {
    console.log("error: ", error);
    alert("error deleting roles")
    }
  }
}
