import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import ErrorBoundary from './Error';

export default function MyDialog(props) {
    const { open, setOpen, message, action=null, title='Confirmation' } = props;
    console.log("open: ", open);
    useEffect(() => {
        console.log("open: ", open);
        console.log("message: ", message);
    }, [open, message])
  return (
    <ErrorBoundary>
    <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{ title }</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          { action? 
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={action} color="error">
                Delete
            </Button> 
          </> : <Button onClick={() => setOpen(false)}>
            Ok
          </Button>
          }
        </DialogActions>
    </Dialog>
    </ErrorBoundary>
  )
}
