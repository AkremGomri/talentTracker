import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
import { useDispatch } from 'react-redux';
// component
import Iconify from '../../../components/iconify';
import request from '../../../services/request';
import { addManyUsers, deleteManyUsersByName } from '../../../redux/features/user';

// ----------------------------------------------------------------------

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

UserListToolbar.propTypes = {
  selectedUsers: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ selectedUsers, filterName, onFilterName }) {

  const dispatch = useDispatch();

  return (
    <StyledRoot
      sx={{
        ...(selectedUsers.length > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {selectedUsers.length > 0 ? (
        <Typography component="div" variant="subtitle1">
          {selectedUsers.length} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {selectedUsers.length > 0 ? ( // akrem badel lenna
        <Tooltip title="Delete">
          <IconButton onClick={() => deleteAllSelectedUsers()} >
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );

  async function deleteAllSelectedUsers() {
    try{
      console.log("selectedUsers: ", selectedUsers);
      const response = await request.send('delete', '/api/user/many', selectedUsers);
      if(response.result?.deletedCount <=0 ){
        return;
      }
      console.log("marja3nech");
    } catch (error) {
      console.log("error: ", error);
      alert("error deleting roles")
    }
  }
}
