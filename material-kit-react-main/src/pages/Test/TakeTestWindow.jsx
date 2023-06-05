/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { Box, Input, Rating, Typography, InputLabel, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import request from '../../services/request';

const TakeTestWindow = ({ onClose, data, name="", description="", skills, setSkills}) => {
    const dispatch = useDispatch();

    // const [score, setScore] = useState(0);
    // const [skillElements, setSkillElements] = useState(data?.childrenItems);
    // const [skills, setSkills] = useState(data);
    // const [answears, setanswears] = useState(data?.map(d => d.childrenItems)?.map((item) => null));
    // const [value, setValue] = React.useState(2);

    useEffect(() => {
      setSkills(data);
    }, [data]);

  return (
    <Box sx={{ maxHeight: '450px', overflow: 'auto', borderRadius: "5px 5px 5px", border: "2px solid rgb(175, 203, 247)", boxShadow: "0px 0px 5px ", mb: 2 }} >
      {/* Quiz header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #ccc" }}>
        <Typography variant="h5">
          <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: "rgb(51, 102, 120)" }}>{name}:</span> {description && (
            <Typography variant="body1" component="span" sx={{ color: "gray" }}>
              {description}
            </Typography>
          )}
        </Typography>
      </Box>
      {/* Quiz content */}
      {/* Submit button */}
      {
        data?.flatMap((currentSkill, index) => {
        if(currentSkill?.childrenItems.length) return (
          <Box 
            key={`${currentSkill.name}-${index}`} 
            sx={{ padding: "20px", mt: 2, borderBottom: "1px solid #ccc",}}
          >
            <Typography variant="h6" sx={{ color: "rgb(109, 177, 202)" }}>{currentSkill.name}</Typography>
            {
            currentSkill
              ?.childrenItems && 
              <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start", flexDirection: "row" }}>
                {
                currentSkill.childrenItems.map((item, index) => (
                <Box
                    key={`${item.name} - ${index}`}
                    sx={{
                    "& > legend": { mt: 2 },
                    m: 1,
                    mr: 15,
                    }}
                >
                    {/* <Typography component="legend">Do you think we ?</Typography> */}
                    <InputLabel>Quesion {index + 1}: {item.name} ?</InputLabel>
                    <Rating
                      name="simple-controlled"
                      value={
                        skills? skills.reduce((acc, curr) => {
                          if(curr._id === currentSkill._id) 
                            return curr.childrenItems?.reduce((acc, curr) => {
                              if(curr._id === item._id) return curr.levelISet;
                              return acc;
                            }, 0);
                          return acc
                        } ,0) : 0
                      }
                      onChange={(event, newValue) => {
                        setSkills((prev) => {
                          return prev.map((skill) => {
                              if(skill._id === currentSkill._id) {
                                return {...skill, childrenItems: skill.childrenItems.map((child) => {
                                  if(child._id === item._id) return {...child, levelISet: newValue};
                                  return child;
                                })};
                              }
                              return skill;
                          });
                        });
                    }}
                    />
                </Box>))
                }
              </Box>
            }
          </Box>)
      })
        
      }
      {/* {
        (type !== "Overview") &&
        <Button 
            onClick={handleSubmit}
            sx={{mt: 2 }}
            variant="contained"
        >Submit Quiz</Button>
      } */}
    </Box>
  );
};

export default TakeTestWindow;
