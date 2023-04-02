import React, {useState} from 'react'
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import AddSelectPermission from './AddSelectPermission';
import { actions, permissions } from '../../utils/constants/permissions'

export default function AddPermission({ open, handleClose}) {
    const [permission, setPermission] = useState([]);
    const [permissionName, setPermissionName] = useState("");

    const style = {
        container: {
          borderRadius: '5px',
          overflow : "scroll",
          border: '2px solid #fff',
          backgroundColor: "#fff",
          // opacity: [0.9, 0.8, 0.7],
          color: 'secondary.light',
          padding: 5,
          mx: {
            xs: "8%",
            sm: "10%",
            md: "20%",
            lg: "30%",
          },
          my: {
            xs: "7%",
            sm: "7%",
            md: "7%",
            lg: "7%",
            },
          px: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'center',
          width: {
            xs: "100%", // theme.breakpoints.up('xs')
            sm: "60%", // theme.breakpoints.up('sm')
            md: "60%", // theme.breakpoints.up('md')
            lg: "40%", // theme.breakpoints.up('lg')
            xl: "40%", // theme.breakpoints.up('xl')
          },
          height: 3/4,
          fontWeight: 'bold',
          fontSize: 14,
  
          '&:hover': {
            backgroundColor: '#fff',
            opacity: 1,
          },
        },
        main:{
          width: ["100%", "100%", "100%", "100%", "100%"],
        }
      };

      // eslint-disable-next-line spaced-comment
      function addPermission(data){ //tnajem tzid t7assen
        let test = false;
        const newPermission = permission.map(p => {
          if(p.subject === data.subject) {
            test = true;
            return {...p, ...data}
          };
          return p;
        });
        if(!test){
          setPermission([...newPermission, data])
        } else {
          setPermission([...newPermission])
        }
      }

  return (
    <Modal open={open} onClose={handleClose} >
        <Box sx={style.container} >
          <Box sx={style.main} >
            <Typography variant="h1" gutterBottom sx={{ mb: 6, textAlign: 'center' }}>
                new role
            </Typography>

            <Typography variant="h6" gutterBottom >
              Add the role name:
            </Typography>
          
            <TextField id="Name label" label="Name" sx={{ mb: 3, width: "100%" }} onChange={(e) => setPermissionName(e.target.value)} />

            <Typography variant="h6" gutterBottom>
              Add permissions:
            </Typography>

            {
               Object.values(permissions).map((permission, index) => (
                        <AddSelectPermission key={`${permission} - ${index}`} addPermission={(data) => addPermission(data)} actions={actions} permissions={permissions} />
                     )
                )
            }
          <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleClose}>
            Delete
          </Button>
          <Button variant="contained" endIcon={<SendIcon />} onClick={() => sendRequest(handleClose, permissionName, permission)}>
            Send
          </Button>


          </Box>
        </Box>
    </Modal>
  )
}

async function sendRequest(handleClose, permissionName, donnee){
  const options = {
    url: `${process.env.REACT_APP_API_URL}/api/admin/role`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: {
      name: permissionName,
      permissions: donnee
    }
  };

  console.log("sending: ",{
    name: permissionName,
    permissions: donnee
  });

  try{
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/role`, options.data);
    handleClose();
  } catch (error) {
    console.log("error: ", error);
  }
}
