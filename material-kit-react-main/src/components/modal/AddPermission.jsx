import React, {useState} from 'react'
import { Modal, Box, Typography, TextField, Button, Alert, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useDispatch } from 'react-redux';
import { transformDate } from '../../services/date';
import { addOneRole } from '../../redux/features/role';
import AddSelectPermission from './AddSelectPermission';
import { actions, permissions } from '../../utils/constants/permissions'
import request from '../../services/request';

export default function AddPermission({ open, handleClose}) {
    const [permission, setPermission] = useState([]);
    const [permissionName, setPermissionName] = useState("");

    const [error, setError] = useState('');

    const dispatch = useDispatch();

    const style = {
        container: {
          borderRadius: '5px',
          overflow : "scroll",
          border: '2px solid #fff',
          backgroundColor: "#fff",
          // opacity: [0.9, 0.8, 0.7],
          // color: 'secondary.dark',
          padding: 5,
          mx: {
            xs: "8%",
            sm: "10%",
            md: "20%",
            lg: "30%",
          },
          my: {
            xs: "5%",
            sm: "5%",
            md: "5%",
            lg: "5%",
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
          height: 4/5,
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
    <Modal open={open} onClose={handleCloseModal} >
        <Box sx={style.container} >
          <Box sx={style.main} >
            <Typography variant="h2" gutterBottom sx={{ mb: 6, textAlign: 'center' }}>
                new role
            </Typography>

            <Typography variant="h6" gutterBottom >
              Add the role name:
            </Typography>
          

            <TextField id="Name label" label="Name" sx={{ width: "100%" }} onChange={(e) => setPermissionName(e.target.value)} />
            { error.permissionName && <div style={{ color: "orange", marginLeft: "20px"}}>{error.permissionName}</div>}

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Add permissions:
            </Typography>

            {
               Object.values(permissions).map((permission, index) => (
                  <AddSelectPermission key={`${permission} - ${index}`} addPermission={(data) => addPermission(data)} actions={actions} permissions={permissions} />
                  )
                )
            }

          { error.permissionListEmpty && <div style={{ color: "orange", marginLeft: "20px"}}>{error.permissionListEmpty}</div>}

            <Stack spacing={2} sx={{ width: "100%", mt: 4 }}>
              <Button variant="contained" startIcon={<ControlPointIcon />} onClick={() => sendRequest()}>
                Add
              </Button>
              <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCloseModal}>
                Cancel
              </Button>
            </Stack>

          </Box>
        </Box>
    </Modal>
  )

  async function sendRequest(){
    if(!permissionName){
      setError({permissionName: "name is required"});
      return;
    }

    if(!permission[0]?.subject || !Object.values(permission[0].actions).filter(a => a.length !== 0).length){
      setError({permissionListEmpty: "at least one permission is required"});
      return;
    }

    const data = {
      name: permissionName,
      permissions: permission
    }
  
    try{
      const response = await request.post('/api/admin/role', data);
      const role = response.data;
      role.updatedAt = transformDate(role.updatedAt);      
      dispatch(addOneRole(role));
      handleCloseModal();
    } catch (error) {
      console.log("error: ", error);
      if(error.code.includes("ERR_NETWORK")){
        alert("network error")
      }else if(error.response.data.message.includes("unique")){
        setError({permissionName: "role name already exists"})
        alert("role name already exists")
      } else {
        alert("error adding role")
      }
    }
  }

  async function handleCloseModal(){
    setError({});
    setPermission([]);
    setPermissionName("");
    handleClose();
  }
}

