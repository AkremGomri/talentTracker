/* eslint-disable no-case-declarations */
/* eslint-disable no-useless-return */
/* eslint-disable operator-assignment */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import localforage from "localforage";
import { Modal, TextField, Select, MenuItem, InputLabel, FormControl, Button, Box, Typography, Stack, FormLabel, FormGroup, FormControlLabel, Checkbox, ListItemText, FormHelperText } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
/* icons */
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CloseIcon from '@mui/icons-material/Close';

import request from '../../services/request';
import { addOneUser, setUsers } from '../../redux/features/user';
import SnackBar from "../others/SnackBar";
import { permissions, fields, actions } from "../../utils/constants/permissions";
import EnhancedTable from "../table/table";
import { selectAllUsers } from "../../redux/utils/user";
import OverViewWindow from '../../pages/Test/OverViewWindow';

/* ***** */
export default function CreateTestModal({ open, handleClose, onCreateUser, setDisplaySnackBar, restrictedNames, setTests }) {
  const [ accessTo, setAccessTo ] = useState([]);

  const [assignedToUsers, setAssignedToUsers] = useState([]);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [fields, setFields] = useState([]);
  const [skills, setSkills] = useState([]);

  const [startDate, setStartDate] = useState([]);
  const [duration, setDuration] = useState([]);

  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedSubFields, setSelectedSubFields] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [currentPage, setCurrentPage] = useState('page-1');

  const nb = useRef({ nbFields: 1, nbSubFields: 1, nbSkills: 1 });

  const [roleNamesList, setRoleNamesList] = useState([]);

  const [error, setError] = useState({});

  const dispatch = useDispatch();

  const users = useSelector(selectAllUsers);

  useEffect(() => {
    const getFields = async () => {
        const { data } = await request.get('/api/fields');
        setFields(data);
    }
    getFields();
  }, []);

  const style = {
    container: {
      borderRadius: '5px',
      border: '7px solid #fff',
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
      height: 4.2/5,
      fontWeight: 'bold',
      fontSize: 14,

      '&:hover': {
        backgroundColor: '#fff',
        opacity: 1,
      },
    },
    main:{
      
      height: '100%',
      backgroundColor: "#fff",
      width: ["100%", "100%", "100%", "100%", "100%"],
    }
  };

  const handleFieldChange = (event) => {
    setError({ ...error, selectedFields: null });
    const selectedOptions = event.target.value;

    if (selectedOptions.includes('select all')) {
      if (selectedFields.length === fields.length) {
        setSelectedFields([]);
      } else {
        setSelectedFields(fields.map((field) => field.name));
      }
    } else {
      setSelectedFields(selectedOptions);
    }
    // setSelectedSubFields(
    //   fields
    //     .filter((field) => newSelectedFields.includes(field.name))
    //     .flatMap((field) => field.childrenItems)
    //     .map((subField) => subField.name)
    // );
    // setSelectedSkills(
    //   fields
    //     .filter((field) => newSelectedFields.includes(field.name))
    //     .flatMap((field) => field.childrenItems)
    //     .flatMap((subField) => subField.childrenItems)
    //     .map((skill) => skill.name)
    // );
  };

  const handleSubFieldChange = (event) => {
    // const newSelectedSubFields = event.target.value;

    // setSelectedSubFields(newSelectedSubFields);
    setError({ ...error, selectedSubFields: null });

    const selectedOptions = event.target.value;
    if (selectedOptions.includes('select all')) {
      if (selectedOptions.length <= nb.current.nbSubFields) {
        nb.current.nbSubFields = 1;
        setSelectedSubFields([]);
      } else {
        setSelectedSubFields(fields
          .filter(field => selectedFields.includes(field.name))
          .flatMap((field) => field.childrenItems)
          .map((subField) => subField.name)
        );
      }
    } else {
      setSelectedSubFields(selectedOptions);
    }
    // setSelectedSkills(
    //   fields
    //     .filter((field) => selectedFields.includes(field.name))
    //     .flatMap((field) => field.childrenItems)
    //     .filter((subField) => newSelectedSubFields.includes(subField.name))
    //     .flatMap((subField) => subField.childrenItems)
    //     .map((skill) => skill.name)
    // );
  };

  const handleSkillsChange = (event) => {
    setError({ ...error, selectedSkills: null });
    setSelectedSkills(event.target.value);
  };

  const usersData = users.map((user) => ({
      _id: user._id,
      email: user.email,
      designation: user.designation,
      jobTitle: user.jobTitle?.name,
      role: user.role?.name,
  }));

  const dataHeadCells = [
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
    },
    {
      id: 'designation',
      numeric: false,
      disablePadding: false,
      label: 'Designation',
    },
    {
      id: 'jobTitle',
      numeric: false,
      disablePadding: false,
      label: 'Job Title',
    },
    {
      id: 'role',
      numeric: false,
      disablePadding: false,
      label: 'Role',
    }
  ]

    return (
      <Modal open={open} onClose={() => {handleCloseModal(); setCurrentPage('page-1')}}>
        {
          currentPage === 'page-1'? (
          <Box sx={style.container} >
              <Box sx={style.main} >
                  <Typography variant="h2" gutterBottom sx={{ mb: 6, textAlign: 'center' }}>
                      Create Test
                  </Typography>
  
                  <TextField
                      id="Test name"
                      label="Test name"
                      value={name}
                      onChange={(e) => {
                        setError({ ...error, name: null });
                        setName(e.target.value);
                        if(restrictedNames.includes(e.target.value)) return setError({ ...error, name: 'This name is not allowed' });
                      }}
                      variant="filled"
                      sx={{ width: "100%", my: 1 }}
                      required
                      error={!!error.name}
                      helperText={error.name}
                  />
  
                  <TextField
                      variant="filled"
                      id="Description"
                      label="Description"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      sx={{ width: "100%", my: 1 }}
                  />
  
                  <Stack direction="row" sx={{ mt: 2 }}>
                    {/* Field Select */}
                    <FormControl style={{ width: 'calc(100% / 3)'}} error={!!error.selectedFields}>
                      <InputLabel id="Field-label">Field</InputLabel>
                      <Select
                        value={selectedFields}
                        onChange={handleFieldChange}
                        label="Field"
                        variant="filled"
                        renderValue={(selected) => selected.join(', ')}
                        multiple
                      >
                        <MenuItem key="select all" value="select all">
                          <Checkbox checked={selectedFields.length === fields.length}/>
                          <ListItemText primary={"select all"} />
                        </MenuItem>
                      {fields?.map((field) => (
                          <MenuItem key={field.name} value={field.name}>
                            <Checkbox checked={selectedFields?.includes(field.name)}/>
                            <ListItemText primary={field.name} />
                          </MenuItem>
                      ))}
                      </Select>
                      <FormHelperText> {error.selectedFields} </FormHelperText>
                    </FormControl>
  
                    {/* SubField Select */}
                    {(
                        <FormControl style={{ width: 'calc(100% / 3)', marginLeft: "7px" }} error={ !!error.selectedSubFields }>
                          <InputLabel id="SubField-label">SubField</InputLabel>
                          <Select
                              value={selectedSubFields}
                              onChange={handleSubFieldChange}
                              variant="filled"
                              label="SubField"
                              renderValue={(selected) => selected.join(', ')}
                              multiple
                          >
                              <MenuItem key="select all" value="select all">
                                <Checkbox checked={selectedFields.length && selectedSubFields.length === nb.current.nbSubFields}/>
                                <ListItemText primary={"select all"} />
                              </MenuItem>
                              {selectedFields?.length > 0 &&
                                fields
                                .filter((field) => selectedFields.includes(field.name))
                                .flatMap((selectedF) => selectedF.childrenItems)
                                .filter(
                                  (subField, index, self) =>
                                    self.findIndex((s) => s.name === subField.name) === index
                                )
                                .map((subField) => {
                                  nb.current.nbSubFields += 1; 
                                  return (<MenuItem key={subField.name} value={subField.name}>
                                    <Checkbox checked={selectedSubFields?.includes(subField.name)} />
                                    <ListItemText primary={subField.name} />
                                  </MenuItem>)
                                  }
                              )}
                          </Select>
                          <FormHelperText>{error.selectedSubFields}</FormHelperText>
                        </FormControl>
                    )}
  
                    {/* Skills Select */}
                    {(
                        <FormControl style={{ width: 'calc(100% / 3)', marginLeft: "7px" }} error={ !!error.selectedSkills }>
                          <InputLabel>Skills</InputLabel>
                          <Select
                              variant="filled"
                              value={selectedSkills}
                              onChange={handleSkillsChange}
                              multiple
                              renderValue={(selected) => selected.map(s => s.name).join(', ')}
                              label="Skills"
                          >
                              {
                                fields.map((field, index) => {
                                  if(!selectedFields.includes(field.name)) return;
                                  return field.childrenItems.map((subField, index) => {
                                    if(!selectedSubFields.includes(subField.name)) return;
                                    return subField.childrenItems
                                  })
                                }).flat(Infinity).filter(
                                  (skill, index, self) =>
                                    ( self.findIndex((s) => s?.name === skill?.name) === index)
                                )
                                .map((skill, index) => {
                                  if(skill) return (
                                  <MenuItem key={skill?.name} value={skill}>
                                      <Checkbox checked={selectedSkills?.some(selectedSkill => selectedSkill._id === skill?._id)}/>
                                      <ListItemText primary={skill?.name} />
                                  </MenuItem>
                                  )
                                })
                              }
                          </Select>
                          <FormHelperText>{error.selectedSkills}</FormHelperText>
                        </FormControl>
                    )}
                  </Stack>

                  <Stack direction="row" sx={{ mt: 2 }}>
                    {/* starting date */}
                    <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value)}
                    error={!!error.startDate}
                    helperText={error.startDate}
                    variant="filled"
                    sx={{ width: "59%", my: 1, marginRight: '10px' }}
                    required
                  />

                  <TextField
                    id="duration"
                    label="Duration (in days)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    error={!!error.duration}
                    helperText={error.duration}
                    variant="filled"
                    sx={{ width: "59%", my: 1 }}
                    required
                  />
                  </Stack>
          </Box>
          <Stack spacing={2} sx={{ width: "100%", mt: 4, marginBottom: 'auto' }}>
            {/* <Button variant="contained" startIcon={<ControlPointIcon />} onClick={() => sendRequest()}>
                Add
            </Button>
            <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCloseModal}>
                Cancel
            </Button> */}

            <Button 
              variant={(name && selectedSkills.length)? 'contained' : 'outlined'}
              endIcon={<ArrowForwardIcon />}
              sx={{ width: '30%',  marginLeft: 'auto'}}
              onClick={handleNextBtn}
            >
              Next
            </Button>
          </Stack>
          </Box>  
          ) : currentPage === 'page-2'?
          (
            <Box sx={
              {
              ...style.container, 
              width: { sm: "100%", lg: 1000}, 
              height: { sm: "100%", md: "90%"}, 
              my: { xs: "0%", sm: "0%", md: "2%", lg: "2", }, 
              alignItems: 'center', mx: {xs: "0%", sm: "0%", md: "0%", lg: "15%", xl:"20%"},
              position: "absolute",
              }
            }>
              <Box sx={style.main}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 6, textAlign: 'right', order: '1' }}>
                      page 2
                  </Typography>
                  <FormControl>
                    <InputLabel>select</InputLabel>
                    <Select
                      sx={{ width: '200px' }}
                      label="select"
                      renderValue={(selected) => selected.join(', ')}
                    >
                      <MenuItem key="selectAll" value="selectAll">
                        <Checkbox checked=""/>
                        <ListItemText primary="selectAll" />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                  <EnhancedTable data={usersData} dataHeadCells={dataHeadCells} setSelectedData={setAssignedToUsers} selectedData={assignedToUsers} />
              </Box>
              <Stack 
                spacing={1} 
                sx={{ 
                  width: "40%", 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: "flex-end", 
                  justifyContent: "space-between", 
                  mt: 5,
                  position: "absolute",
                  bottom: "7%",
                  left: "40%",
                }}>
                <Button 
                  variant='outlined'
                  startIcon={<ArrowBackIcon />}
                  sx={{ width: '45%',}}
                  onClick={handlePrevBtn}
                >
                  Previous
                </Button>
                <Button 
                  variant={(name && selectedSkills.length)? 'contained' : 'outlined'}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ width: '45%',  }}
                  onClick={handleNextBtn}
                >
                  Next
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box sx={
              {
                ...style.container, 
                width: { sm: "100%", lg: 1250}, 
                height: { sm: "100%", md: "90%"}, 
                my: { xs: "0%", sm: "0%", md: "2%", lg: "2", }, 
                alignItems: 'center', mx: {xs: "0%", sm: "0%", md: "0%", lg: "15%", xl:"10%"},
                position: "relative"
              }
            }>
              <Box sx={style.main}>
              <Typography variant="h3" sx={{ color: "rgb(142, 181, 242)" }}> Overview</Typography>
              {selectedSkills.length && (
                <OverViewWindow
                    name={name}
                    description={description}
                    assignedToUsers={assignedToUsers}
                    data={selectedSkills}
                />
                )}
              </Box>
              <Stack spacing={1} sx={{ 
                width: "25%", 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: "flex-end", 
                justifyContent: "space-between", 
                position: "absolute",
                bottom: "7%",
                left: "40%",
               }}>
              <Button 
                  variant= 'outlined'
                  startIcon={<ArrowBackIcon />}
                  sx={{ width: '45%',}}
                  onClick={handlePrevBtn}
                >
                  Previous
                </Button>
                <Button 
                  variant='contained'
                  endIcon={<ArrowForwardIcon />}
                  sx={{ width: '45%',  }}
                  onClick={handleNextBtn}
                >
                  Submit
                </Button>
              </Stack>
            </Box>
          )
        }
      </Modal>
      )


      function handlePrevBtn(){
        switch (currentPage) {
          case 'page-1':
            return handleCloseModal();
          case 'page-2':
            return setCurrentPage('page-1');
          case 'page-3':
            return setCurrentPage('page-2');
          default:
            return;
        }
      }

      function handleNextBtn (){
        switch (currentPage) {
          case 'page-1':
            let isError = false;;
            if(!name) {
                isError = true;
                setError(prevError => ({...prevError, name: "name is required"}));
            }
            if(restrictedNames.includes(name)) {
                isError = true;
                setError(prevError => ({...prevError, name: "name is used before"}));
            }
            if (!selectedSkills.length) {
              isError = true;
              setError(prevError => ({...prevError, selectedSkills: "select some skills"}))
            }
            if (!selectedSubFields.length) {
              isError = true;
              setError(prevError => ({...prevError, selectedSubFields: "select some subFields"}))
            }
            if (!selectedFields.length) {
              isError = true;
              setError(prevError => ({...prevError, selectedFields: "select some fields"}))
            };
            if (!startDate.length) {
              isError = true;
              setError(prevError => ({...prevError, startDate: "select a starting date"}))
            };
            if (!duration.length) {
              isError = true;
              setError(prevError => ({...prevError, duration: "select a starting date"}))
            };
            if(isError) return;
            if(!users.length) request.get('/api/user/all').then(({ data }) => {
              dispatch(setUsers(data.users));
              setError({});
              return setCurrentPage('page-2');
            }).catch(err => alert("please reload the page !"));
            else{
              setError({});
              return setCurrentPage('page-2');
            }
            return;
          case 'page-2':
            if(!assignedToUsers.length) return setError({assignedToUsers: "at least one user should be assigned to this test"});
            return setCurrentPage('page-3');
          case 'page-3':
            return sendRequest();
          default:
            return;
        }
      }
    
      async function sendRequest(){
        console.log("selectedSkills: ",selectedSkills);
        const data = {
          name,
          description,
          skills: selectedSkills.map(skill => skill._id),
          startDate,
          duration,
          AssignedToUsers: assignedToUsers.map(id => ({
            user: id, 
            status: "pending",
            verifiedStatus: "pending"
          })),
        }

        try{
          const response = await request.post('/api/test/', data);
          // if(!response.data) throw new Error(response);
          const { test } = response;
          const fullName = await localforage.getItem('fullName');
          test.creator= {fullName};

          setTests(prevTests => [...prevTests, test]);

          setSelectedFields([]);
          setSelectedSubFields([]);
          setSelectedSkills([]);
          setAssignedToUsers([]);
          setName("");
          setDescription("");
          setCurrentPage('page-1');
          handleCloseModal();

        } catch (error) {
          console.log("error: ",error);
          const { message: msgError }= error?.response?.data;

          if(error.code.includes("ERR_NETWORK")){
            alert("network error")
          }else if(msgError.includes("unique")){
            setError({name: "user name already exists"})
            alert("user name already exists")
          } else if(msgError.includes("validation failed")){
            const err = msgError.split(":")[2]
            if(err.includes("name")){
              setError({name: "name is invalid"})
              alert(err);
            } else if(err.includes("description")){
              setError({description: "description is invalid"})
              alert(err);
            } else if(err.includes("passwordConfirm")){
              setError({passwordConfirm: "passwords do not match"})
              alert(err);
            }
          } else {
            alert("error adding name")
          }
        }
      }
      
    
      async function handleCloseModal(){
        setError({});
        setName("");
        setDescription("");
        setSkills([]);
        setStartDate([]);
        setDuration([]);
        handleClose();
      }
  }; 


