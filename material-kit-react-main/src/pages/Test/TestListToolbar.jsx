/* eslint-disable prefer-template */
/* eslint-disable no-else-return */
import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Alert } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
// component
import { deleteManyRolesByName } from '../../redux/features/role';
import Iconify from '../../components/iconify';
import request from '../../services/request';
import MyDialog from '../../components/dialog/MyDialog';

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

TestListToolbar.propTypes = {
  selectedTests: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  deleteTests: PropTypes.func,
};

export default function TestListToolbar({ selectedTests, filterName, onFilterName, deleteTests }) {

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <StyledRoot
      sx={{
        ...(selectedTests.length > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {selectedTests.length > 0 ? (
        <Typography component="div" variant="subtitle1">
          {selectedTests.length} selected
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

      {selectedTests.length > 0 ? ( // akrem badel lenna
        <Tooltip title="Delete">
          <IconButton onClick={() => setOpenDeleteDialog(true)}>
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

      <MyDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        action={deleteAllSelectedTests}
        message={`are you sure you want to delete: ${selectedTests.reduce((acc, test) => `${acc} "${test}",` , "")} ?`}
      />
    </StyledRoot>
  );

  async function deleteAllSelectedTests() {
    try{
      deleteTests(selectedTests);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.log("error: ", error);
      alert("error deleting roles")
    }
  }
}
