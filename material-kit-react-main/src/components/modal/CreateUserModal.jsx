import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import localforage from "localforage";
import { Modal, TextField, Select, MenuItem, InputLabel, FormControl, Button, Box, Typography, Stack } from "@mui/material";

/* icons */
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CloseIcon from '@mui/icons-material/Close';

import request from '../../services/request';
import { addOneUser } from '../../redux/features/user';
import SnackBar from "../others/SnackBar";
import { permissions, fields } from "../../utils/constants/permissions";


/* ***** */
export default function CreateUserModal({ open, handleClose, onCreateUser, setDisplaySnackBar }) {
  const [ accessTo, setAccessTo ] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("");
  const [manager, setManager] = useState([]);
  const [manages, setManages] = useState([]);
  const [skills, setSkills] = useState([]);

  const [roleNamesList, setRoleNamesList] = useState([]);

  const [error, setError] = useState({});

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

  const handleCreateUser = () => {
    // Perform validation and create user
    if (email && password && passwordConfirm && role) {
      onCreateUser({
        email,
        password,
        role,
        manager,
        manages,
        skills,
      });
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setRole("");
      setManager([]);
      setManages([]);
      setSkills([]);
      handleClose();
    } else {
      alert("Please fill in all required fields!");
    }
  };

  useEffect(() => {
    async function getRoleNames() {
      const myRole = await localforage.getItem('myRole');
      myRole.permissions?.forEach((permission) => {
        if (permission.subject === permissions.USERS.name && permission.actions.Create.includes(fields.role)) {
          setAccessTo([ ...accessTo, fields.role]);
          console.log();
          console.log("accessTo: ", accessTo);
          request.send('get', '/api/admin/roles/names')
            .then(({ result }) => {
              setRoleNamesList(result);

            });
        }
      });
    }
    if(open){
      console.log("opeeeeeeeeeeeeeeeeeeeeeeeeeeeen");
      getRoleNames();
    }
  }, [open])
  return (
    <Modal open={open} onClose={handleCloseModal}>
        <Box sx={style.container} >
            <Box sx={style.main} >
                <Typography variant="h2" gutterBottom sx={{ mb: 6, textAlign: 'center' }}>
                    Create User
                </Typography>

                <TextField
                    required
                    id="Email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: "100%", my: 1 }}
                />
                { error.email && <div style={{ color: "orange", marginLeft: "20px"}}>{error.email}</div>}

                <TextField
                    required
                    id="Password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ width: "100%", my: 1 }}
                />
                { error.password && <div style={{ color: "orange", marginLeft: "20px"}}>{error.password}</div>}

                <TextField
                    required
                    id="Confirm Password"
                    label="Confirm Password"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    sx={{ width: "100%", my: 1 }}
                />
                { error.passwordConfirm && <div style={{ color: "orange", marginLeft: "20px"}}>{error.passwordConfirm}</div>}

                {
                  accessTo?.includes(fields.role) ? 
                    (<FormControl sx={{ width: "32%", my: 1, mr: 1 }}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            required
                            labelId="role-label"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                          {
                            roleNamesList? roleNamesList.map((roleName) => ( <MenuItem key={roleName} value={roleName}>{roleName}</MenuItem> ) ) : null
                          }
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>) : null
                }
                <FormControl sx={{ width: "32%", my: 1, mr: 1 }}>
                    <InputLabel id="manager-label">Manager</InputLabel>
                    <Select
                        labelId="manager-label"
                        id="manager"
                        multiple
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                    >
                        <MenuItem value="manager1">Manager 1</MenuItem>
                        <MenuItem value="manager2">Manager 2</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ width: "32%", my: 1 }}>
                    <InputLabel id="manages-label">Manages</InputLabel>
                    <Select
                        labelId="manages-label"
                        id="manages"
                        multiple
                        value={manages}
                        onChange={(e) => setManages(e.target.value)}
                    >
                        <MenuItem value="employee1">Employee 1</MenuItem>
                        <MenuItem value="employee2">Employee 2</MenuItem>
                    </Select>
                </FormControl>
                {/* <FormControl style={{ marginBottom: "16px" }}>
                <InputLabel id="skills-label">Skills</InputLabel>
                <Select
                    label */}
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

      if(!email){
          setError({email: "email is required"});
          return;
        }

        if(!password){
          setError({password: "password is required"});
          return;
        }

        if(!passwordConfirm){
          setError({passwordConfirm: "confirm password is required"});
          return;
        }
    
        // if(!permission[0]?.subject || !Object.values(permission[0].actions).filter(a => a.length !== 0).length){
        //   setError({permissionListEmpty: "at least one permission is required"});
        //   return;
        // }
    
        const data = {
          email,
          password,
          passwordConfirm,
          role,
          manager,
          manages,
          skills,
        }
      
        try{
          const response = await request.post('/api/user/signUp', data);
          const user = response.data;

          setDisplaySnackBar({
            open: true, 
            message: response
          });

          console.log("rr: ",response);
          // role.updatedAt = transformDate(role.updatedAt);      
          dispatch(addOneUser(data));
          handleCloseModal();

          
        } catch (error) {
          const { message: msgError }= error.response.data;
          // console.log("error: ", error);
          // console.log("msgError: ", msgError);
          if(error.code.includes("ERR_NETWORK")){
            alert("network error")
          }else if(msgError.includes("unique")){
            setError({email: "user email already exists"})
            alert("user email already exists")
          } else if(msgError.includes("validation failed")){
            const err = msgError.split(":")[2]
            if(err.includes("email")){
              setError({email: "email is invalid"})
              alert(err);
            } else if(err.includes("password")){
              setError({password: "password is invalid"})
              alert(err);
            } else if(err.includes("passwordConfirm")){
              setError({passwordConfirm: "passwords do not match"})
              alert(err);
            }
          } else {
            alert("error adding email")
          }
        }
        console.log("finished request");
      }
      
    
      async function handleCloseModal(){
        setError({});
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setRole("");
        setManager([]);
        setManages([]);
        setSkills([]);
        handleClose();
      }
  }; 


