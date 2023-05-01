import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function SnackBar({ message, open, handleOpen }) {

  // useEffect(() => {
  //   console.log("message: ", message);
  //   console.log("open: ", open);
  // }, [message, open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    handleOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <div>{message}</div>
    </Snackbar>
  );
}