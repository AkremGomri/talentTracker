/* eslint-disable arrow-body-style */
/* eslint-disable no-unreachable */
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
import { SpaRounded } from "@mui/icons-material";
/* icons */
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CloseIcon from '@mui/icons-material/Close';

import request from '../../services/request';
import { addOneUser, setUsers } from '../../redux/features/user';
import SnackBar from "../others/SnackBar";
import { permissions, fields, actions } from "../../utils/constants/permissions";
import EnhancedTable from "../table/table";
import { selectAllUsers } from "../../redux/utils/user";
import TakeTestWindow from '../../pages/Test/TakeTestWindow';
import MyDialog from "../dialog/MyDialog";

/* ***** */
export default function TakeTestModal({ open,  handleCloseModal, selectedTest={}, initialSkills=[], type="take test", action=null }) {
  console.log("selectedTest: ",selectedTest);
  const [ currentPage, setCurrentPage ] = useState('page-1');

  const [ testsSkills, setTestsSkills] = useState([]);
  const [skills, setSkills] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
  };

  const handleSubFieldChange = (event) => {
  };

  const handleSkillsChange = (event) => {

  };


    return (
      <>
        <Modal open={open} onClose={() => {handleCloseModal(); setCurrentPage('page-1')}}>
        {
          currentPage === 'page-1'? (
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
              <Box sx={{
                ...style.main,
                mt: -4
              }}>
              {
                type==="validation" &&
                (
                  <Box>
                    <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
                      Validating
                    </Typography>
    
                  </Box>
                  )
              }
              <Typography variant="h3" sx={{ color: "rgb(142, 181, 242)" }}> User email: <span style={{ color: "rgb(59, 62, 67)" }}>{selectedTest?.AssignedToUsers[0]?.user?.email}</span></Typography>
              {selectedTest?.skills?.length && (
                <TakeTestWindow
                    name={selectedTest?.name}
                    description={selectedTest?.description}
                    data={selectedTest?.skills}
                    skills={skills}
                    setSkills={setSkills}
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
                bottom: "3%",
                left: "40%",
               }}>
              <Button 
                  variant= 'outlined'
                  sx={{ width: '45%',}}
                  onClick={handlePrevBtn}
                >
                  Cancel
                </Button>
                <Button 
                  variant='contained'
                  sx={{ width: '45%',  }}
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Submit
                </Button>
              </Stack>
            </Box>
          ) : null
        }
      </Modal>
      <MyDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        action={handleConfirm}
        type="submit"
        message={`Do you confirm submitting the test ?`}
      />
      </>
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
        return sendRequest();
        switch (currentPage) {
          case 'page-1':
            return;
          case 'page-2':

            return setCurrentPage('page-3');
          case 'page-3':
            return sendRequest();
          default:
            return;
        }
      }

      async function handleConfirm(){
        await sendRequest();
        setOpenDeleteDialog(false);
      }
    
    async function sendRequest(){
      //   setTestsSkills(prev => {
      //     let result = [...prev];
      //     console.log("result: ",result);
      //     skills.forEach(elem1 => {
      //     if(!result.some(elem2 => elem2._id === elem1._id)) result.push(elem1)
      //     else result = result.map(elem2 => {
      //       if(elem2._id === elem1._id) return elem1;
      //       return elem2;
      //     })
      //   });
      //   return result;
      // })
      const finalSkills = skills.map(skill => {
        if(type==="validation") return {
          ...skill,
          levelMyManagerSet: skill.childrenItems.reduce((acc, elem) => elem.levelISet ? acc + elem.levelISet : acc, 0) / skill.childrenItems.length,
        }
        return {
          ...skill,
          levelISet: skill.childrenItems.reduce((acc, elem) => elem.levelISet ? acc + elem.levelISet : acc, 0) / skill.childrenItems.length,
        }
      })
      const data = {
        test: selectedTest,
        answears: finalSkills,
      }
      
      try{
        let response;
        if(type === "validation") response = await request.post('/api/test/validateTest',data)
        else if (type === "take test") response = await request.post('/api/test/passTest',data);
        if (response){
          console.log("result: ",response.result);
          action(prev => prev.map(elem => {
            if(elem._id === response.result._id ) 
              if(response.result.type === "toBeValidated" ) 
                if(elem.AssignedToUsers[0].user._id === response.result.AssignedToUsers[0].user._id) return response.result
                else return elem;
              else return response.result; // type == "take test" which is not get back from the server
            return elem;
          }))
          // if(type === "validation") {
          //   const { message: msg } = response;
          //   alert(msg);
          // }
          }
        } catch (error) {
          const { message: msgError }= error?.response?.data;
          if(msgError) {
            alert(msgError);
          } 
          console.log("error: ",error);
        }
        setSkills([]);
        setTestsSkills([]);
        setCurrentPage('page-1');
        handleCloseModal();
      }
  }; 


