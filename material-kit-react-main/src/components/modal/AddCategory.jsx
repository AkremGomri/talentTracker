import React, {useEffect, useMemo, useState} from 'react'
import { Modal, Box, Typography, TextField, Button, Alert, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useDispatch } from 'react-redux';
// import { transformDate } from '../../services/date';
import { addField } from '../../redux/features/skillMatrix';
import AddSelectPermission from './AddSelectPermission';
import { actions, permissions } from '../../utils/constants/permissions'
import request from '../../services/request';
import MyDialog from '../dialog/MyDialog';

export default function AddCategory({ open, setOpen}) {
    const [category, setCategory] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDiscription, setCategoryDiscription] = useState("");

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
      // function AddCategory(data){ //tnajem tzid t7assen
      //   let test = false;
      //   const newCategory = category.map(p => {
      //     if(p.subject === data.subject) {
      //       test = true;
      //       return {...p, ...data}
      //     };
      //     return p;
      //   });
      //   if(!test){
      //     setCategory([...newCategory, data])
      //   } else {
      //     setCategory([...newCategory])
      //   }
      // }

      let requestStatus = 'None';

  return (
    <>
    <Modal open={open} onClose={handleCloseModal} >
        <Box sx={style.container} >
          <Box sx={style.main} >
            <Typography variant="h2" gutterBottom sx={{ mb: 6, textAlign: 'center' }}>
                add category
            </Typography>

            <Typography variant="h6" gutterBottom >
              Add the category name: 
            </Typography>

            <TextField required id="Name label" label="Name" sx={{ width: "100%" }} onChange={(e) => setCategoryName(e.target.value)} />
            { error.type === 'categoryName' && <Box style={{ color: "orange", marginLeft: "20px"}}>{error.message}</Box>}

            <Typography variant="h6" gutterBottom sx={{ mt: "20px" }} >
              Add the category description:
            </Typography>
          

            <TextField id="Discription label" label="Discription" sx={{ width: "100%" }} onChange={(e) => setCategoryDiscription(e.target.value)} />
            {/* { error.categoryDiscription && <Box style={{ color: "orange", marginLeft: "20px"}}>{error.categoryDiscription}</Box>} */}


 

            {/* {
               Object.values(categorys).map((category, index) => (
                  <AddSelectCategory key={`${category} - ${index}`} AddCategory={(data) => AddCategory(data)} actions={actions} categorys={categorys} />
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
    requestStatus = 'Loading';
    if(!categoryName){
      setError({
        message: "name is required !",
        type: "categoryName"
      })
      return;
    }

    const data = {
      name: categoryName,
      categorys: category
    }
  
    try{
      const response = await request.post('/api/fields/', data);
      const category = response.data[0];
      requestStatus = 'Success';
      dispatch(addField(category));
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
          type: "categoryName"
        })
        setOpenDialogError(true)
      } else {
        setError({
          message: "could not add the field",
          type: "Unknown"
        })
        setOpenDialogError(true)
      }
    }
  }

  async function handleCloseModal(){
    setError({});
    setCategory([]);
    setCategoryName("");
    if(requestStatus === 'Loading'){
      requestStatus = 'None';
    }else if (requestStatus === 'Success'){
      requestStatus = 'None';
    }
    setOpen(false);
  }
}

