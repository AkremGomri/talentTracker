/* eslint-disable camelcase */
import React, { useState } from "react";
import { Typography, Button, IconButton, Box } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";


import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SvgIcon from "@mui/material/SvgIcon";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import { useDispatch } from "react-redux";
import { setSelected_skill_item_id } from '../../redux/features/skillMatrix';

const MyTreeView = ({
  setExpanded,
  expanded,
  open,
  canModify,
  children
}) => {

  const dispatch = useDispatch();

  const handleToggle = (event, nodeIds) => {
    if(expanded.length < nodeIds.length && nodeIds[0]){
      dispatch( setSelected_skill_item_id({
            _id: nodeIds[0].split("-")[0],
            name: nodeIds[0].split("-")[1],
            type: nodeIds[0].split("-")[2],
          })
        );
      } else dispatch( setSelected_skill_item_id({}) );
      setExpanded(nodeIds);
  };

  return (
    // eslint-disable-next-line react/no-unknown-property
    <Box>
      <TreeView
        defaultExpanded={["1"]}
        defaultCollapseIcon={<FolderOpenIcon />}
        defaultExpandIcon={<FolderIcon />}
        sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        // defaultCollapseIcon={<ExpandMore />}
        // defaultExpandIcon={<ChevronRight />}
        expanded={expanded}
        onNodeToggle={handleToggle}
      >
        {children}
        {canModify && <IconButton
          onClick={() => console.log("remove cercle")}
          sx={{
            width: "200px",
            height: "20px",
            backgroundColor: "rgb(215, 233, 234)",
            borderRadius: 1,
            mb: "10px"
          }}
        >
          <AddCircleOutlineIcon />
        </IconButton>}
      </TreeView>
    </Box>
  );
};

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

export default MyTreeView;
