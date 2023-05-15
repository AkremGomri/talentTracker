/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
import React, {useEffect, useMemo, useState} from 'react'
import { Modal, Box, Typography, TextField, Button, Alert, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useDispatch } from 'react-redux';
// import { transformDate } from '../../services/date';
import { addField, addSkill, addSubField } from '../../redux/features/skillMatrix';
import request from '../../services/request';
import MyDialog from '../dialog/MyDialog';

export default function AddItem({ open, setOpen, selected}) {
    const [skillItem, setSkillItem] = useState([]);
    const [itemName, setItemName] = useState("");
    const [itemDiscription, setItemDiscription] = useState("");

    const [error, setError] = useState('');
    const [openDialogError, setOpenDialogError] = useState(JSON.stringify(error) === '{}');
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
      // function AddItem(data){ //tnajem tzid t7assen
      //   let test = false;
      //   const newCategory = skillItem.map(p => {
      //     if(p.subject === data.subject) {
      //       test = true;
      //       return {...p, ...data}
      //     };
      //     return p;
      //   });
      //   if(!test){
      //     setSkillItem([...newCategory, data])
      //   } else {
      //     setSkillItem([...newCategory])
      //   }
      // }

  return (
    <>
    <Modal open={open} onClose={handleCloseModal} >
        <Box sx={style.container} >
          <Box sx={style.main} >
            <Typography variant="h2" gutterBottom sx={{ mb: 6, textAlign: 'center' }}>
                add item
            </Typography>

            <Typography variant="h6" gutterBottom >
              Add the item name:
            </Typography>

            <TextField required id="Name label" label="Name" sx={{ width: "100%" }} onChange={(e) => setItemName(e.target.value)} />
            { error.type === 'itemName' && <Box style={{ color: "orange", marginLeft: "20px"}}>{error.message}</Box>}

            <Typography variant="h6" gutterBottom sx={{ mt: "20px" }} >
              Add the item description:
            </Typography>
          

            <TextField required id="Discription label" label="Discription" sx={{ width: "100%" }} onChange={(e) => setItemDiscription(e.target.value)} />
            {/* { error.itemDiscription && <Box style={{ color: "orange", marginLeft: "20px"}}>{error.itemDiscription}</Box>} */}


 

            {/* {
               Object.values(categorys).map((skillItem, index) => (
                  <AddSelectCategory key={`${skillItem} - ${index}`} AddCategory={(data) => AddCategory(data)} actions={actions} categorys={categorys} />
                  )
                )
            } */}

          {/* { error.categoryListEmpty && <Box style={{ color: "orange", marginLeft: "20px"}}>{error.categoryListEmpty}</Box>} */}

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
    <MyDialog open={openDialogError} setOpen={setOpenDialogError} message={error.message} title={'Error'}/>
    </>
  )

  async function sendRequest(){
    if(!itemName){
      setError({
        message: "please enter the item name",
        type: "itemName"
      })
      return;
    }

    // if(!itemDiscription){
    //   setError({itemDiscription: "at least one description is required"});
    //   return;
    // }

    const data = {
      name: itemName,
      description: itemDiscription,
      // childrenItems: ,
      parentItem: selected._id,
      categorys: skillItem
    }
  
    try{
      let response;
      let skillItem;
      console.log("selected.type: ",selected.type);
      switch(selected.type){
        // case "skills":
        //   response = await request.post('/api/skills/', data);
        //   skillItem = response.data;
        //   dispatch(addSkills(skillItem));
        //   break;
        
        case "field":
          console.log("data: ",data);
          response = await request.post('/api/subFields/', data);
          skillItem = response.data[0];
          dispatch(addSubField(skillItem));
          break;
        
        case "subField":
          response = await request.post('/api/skills/', data);
          skillItem = response.data[0];
          console.log("skillItem: ",skillItem);
          dispatch(addSkill(skillItem));
          break;
        case "skill":

        break;
        default:
          break;
      }
      // const response = await request.post('/api/fields/', data);
      // const skillItem = response.data;

      // dispatch(addFields(skillItem));
      handleCloseModal();
    } catch (error) {
      if(error?.code?.includes("ERR_NETWORK")){
        setError({
          message: "Check your network",
          type: "network error"
        })
        setOpenDialogError(true)
      }else if(error?.response?.data?.message?.includes("duplicate key error")){
        setError({
          message: "Field name already exists",
          type: "itemName"
        })
        setOpenDialogError(true)
      } else {
        setError({
          message: "could not add the item",
          type: "Unknown"
        })
        setOpenDialogError(true)
      }
    }
  }

  async function handleCloseModal(){
    setError({});
    setSkillItem([]);
    setItemName("");
    setOpen(false);
  }
}

