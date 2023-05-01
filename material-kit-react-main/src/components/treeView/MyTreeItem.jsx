/* eslint-disable prefer-template */
import React, { useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelPresentationRoundedIcon from "@mui/icons-material/CancelPresentationRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import axios from "axios";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const MyTreeItem = ({ id, name, expanded, handleToggle, secret, canModify, children }) => {
  useEffect(() => {
    // console.log(canModify, ": ", expanded);
  }, [expanded]);

  if (!children) {
    return (
      <Box sx={{ position: "relative", my: ["10px"] }}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <TreeItem
            icon={<StarIcon sx={{ color: "yellow" }} />}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            nodeId={id}
            label={<Typography variant="caption">{name}</Typography>}
          />
          {canModify && 
          <>
            <IconButton
              sx={{ position: "absolute", right: "-40px", mt: "5px" }}
              onClick={async () => {
                console.log("remove cercle: ", id, " name: ", name);
                try {
                  const result = await axios.delete("" + id, {
                    data: { name },
                    headers: { Authorization: "***" }
                  });
                  console.log("result:", result);
                } catch (e) {
                  console.log("error: ", e);
                }
              }}
            >
              <RemoveCircleRoundedIcon
                sx={{ position: "absolute", color: "red" }}
              />
            </IconButton>

            <IconButton
              sx={{ position: "absolute", right: "-50px", mt: "5px" }}
              onClick={() =>
                console.log("settings cercle: ", id, " name: ", name)
              }
            >
              <SettingsRoundedIcon
                sx={{ position: "absolute", right: "-25px", color: "blue" }}
              />
            </IconButton>
          </>}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", my: ["10px"] }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <TreeItem
          nodeId={id}
          label={<Typography variant="h6">{name}</Typography>}
          expanded={expanded}
          // onLabelClick={handleToggle}
        >
          {children}
          {canModify && <IconButton
            onClick={() => console.log("remove cercle: ", id, " name: ", name)}
            sx={{
              width: "100%",
              height: "20px",
              backgroundColor: "rgb(215, 233, 234)",
              borderRadius: 1,
              mb: "10px"
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>}
        </TreeItem>
        {canModify && 
          <>
            <IconButton
              sx={{ position: "absolute", right: "-40px", mt: "5px" }}
              onClick={async () => {
                console.log("remove cercle: ", id, " name: ", name);
                try {
                  const result = await axios.delete("" + id, {
                    data: { name },
                    headers: { Authorization: "***" }
                  });
                  console.log("result:", result);
                } catch (e) {
                  console.log("error: ", e);
                }
              }}
            >
              <RemoveCircleRoundedIcon
                sx={{ position: "absolute", color: "red" }}
              />
            </IconButton>
            <IconButton
              sx={{ position: "absolute", right: "-50px", mt: "5px" }}
              onClick={() => console.log("settings cercle: ", id, " name: ", name)}
            >
              <SettingsRoundedIcon
                sx={{ position: "absolute", right: "-25px", color: "blue" }}
              />
            </IconButton>
          </>
        }
      </Box>
    </Box>
  );
};

export default MyTreeItem;
