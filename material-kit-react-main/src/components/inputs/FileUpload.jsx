/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Button, Input, Box, Tooltip } from '@mui/material';

const FileUpload = ({ handleFileUpload }) => {
    const handleInputChange = (event) => {
    handleFileUpload(event.target.files);
  };

  return (
    <Box>
    <Input
        type="file"
        variant="filled"
        onChange={handleInputChange}
        inputProps={{
        accept:
            'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        id: 'file-upload',
        }}
        style={{ display: 'none' }}
    />
    <label htmlFor="file-upload">
        <Tooltip title="Select an Excel file">
        <Button variant="contained" component="span">
            Upload File
        </Button>
        </Tooltip>
    </label>
    </Box>
  );
};

export default FileUpload;
