import { Modal, Typography, Table, TableBody, TableRow, TableCell, Checkbox, FormControl, FormLabel, FormGroup, FormControlLabel, FormHelperText, TabScrollButton } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import { selectRoleToModify } from '../../redux/utils/role';

export default function RoleModal({ open, handleClose}) {
    const style = {
      container: {
        borderRadius: '5px',
        overflow : "scroll",
        border: '2px solid #fff',
        backgroundColor: "#fff",
        opacity: [0.9, 0.8, 0.7],
        color: 'secondary.light',
        padding: 5,
        mx: {
          xs: "8%",
          sm: "10%",
          md: "10%",
          lg: "20%",
        },
        my: {
          xs: "7%",
          sm: "7%",
          md: "7%",
          lg: "7%",
          },
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        width: {
          xs: "80%", // theme.breakpoints.up('xs')
          sm: "80%", // theme.breakpoints.up('sm')
          md: "80%", // theme.breakpoints.up('md')
          lg: "60%", // theme.breakpoints.up('lg')
          xl: "80%", // theme.breakpoints.up('xl')
        },
        height: 3/4,
        fontWeight: 'bold',
        fontSize: 14,

        '&:hover': {
          backgroundColor: '#fff',
          opacity: 1,
        },
      },
    };

    const selectedRole = useSelector(selectRoleToModify);

      const [state, setState] = useState({
        gilad: true,
        jason: false,
        antoine: false,
        
      });
    
      const handleChange = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
        });
      };
    
      const { gilad, jason, antoine } = state;
      const error = [gilad, jason, antoine].filter((v) => v).length !== 2;
  return (
    <Modal open={open} onClose={handleClose} >
        <Box sx={style.container} >
          <Typography variant="h2" gutterBottom>
            {selectedRole?.name}
          </Typography>
          {
            selectedRole?.permissions?.length >0 ?
              <>
                <FormControl sx={{ m: 3, display: "block" }} component="fieldset" variant="standard">
                      {
                        selectedRole.permissions.map((permission, index) => (
                          <Box key={index}>
                          {
                            permission.subject && 
                            <>
                              <FormLabel component="legend" key={`${permission.subject} - ${index}`}>{permission.subject}: </FormLabel>
                              {/* <FormGroup row sx={{ mt: 3 }}>
                                {
                                  permission.actions.map((action, index) => (
                                    <>
                                    <FormControlLabel key={`${permission.subject} - ${action} - ${index}`}
                                      sx={{ mr: 3, display: "block" }}
                                      control={
                                        <Checkbox checked={!action} onChange={handleChange} name={action} />
                                      }
                                      label={action}
                                      />
                                    </>
                                      ))
                                }
                              </FormGroup> */}
                              <FormHelperText sx={{ mb: 3, ml: 3 }}>Be careful</FormHelperText>
                            </>
                          }                     
                          </Box>
                        ))  
                      }
                </FormControl>
              </>
              :                
            <Typography variant="h1" gutterBottom>
              No permissions found !
            </Typography>
          }
        </Box>
  </Modal>
  )
}
