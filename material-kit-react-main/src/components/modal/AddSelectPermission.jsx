import { useState } from "react";
import { produce } from 'immer'
import { 
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Checkbox,
    ListItemText,
    OutlinedInput
} from "@mui/material";
import { NestedMenuItem } from "mui-nested-menu";

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;

// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250
//     }
//   }
// };

const styles = {
  display: "flex",
  flexDirection: "row"
}

export default function AddSelectPermissionModal({ actions, permissions, addPermission }) {
  const [open, setOpen] = useState(false);

  const [ permissionSelected, selectPermission ] = useState('');
  const [ actionTypesSelected, setActionTypesSelected ] = useState([]);
  const [ result, setResult ] = useState({
    name: '',
    actions: {
        ...Object.values(actions).reduce((acc, current) => ({...acc, [current]: []}), {})
    }
  });

  const handleClick = (event) => {
    return setOpen(Boolean(event.currentTarget));
  };
  const handleClose = () => {
    setOpen(true);
  };

  const handleChangePermissionName = (event) => {
    const {
      target: { value }
    } = event;
    selectPermission(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangePermissionType = (event, action) => {
    let newActionTypesSelected;
    let newResult;
    if(actionTypesSelected.includes(action)){
      newActionTypesSelected = actionTypesSelected.filter(actionType => actionType !== action);
      newResult = {
        subject: permissionSelected.name,
        actions: 
          {
            ...result.actions,
            [action]: []
          }
      }
      setResult(newResult);
      
    } else {
      newActionTypesSelected = actionTypesSelected.filter(actionType => actionType !== action);
      newResult = {
        subject: permissionSelected.name,
        actions: 
          {
            ...result.actions,
            [action]: permissionSelected.fields
          }
      }
      setResult(newResult);

      newActionTypesSelected = [...actionTypesSelected, action];
    }
    setActionTypesSelected(newActionTypesSelected)
    addPermission(newResult)       
  }

  const handleChangeNestedSelect = (event, action, field) => {
    let newResult;
    if(!result.actions[action].includes(field)){
        newResult = {
            subject: permissionSelected.name,
            actions: 
              {
                ...result.actions,
                [action]: [...result.actions[action],field]
              }
          }
        setResult(newResult)
      if(!actionTypesSelected?.includes(action)){
        setActionTypesSelected([...actionTypesSelected, action])
      }
    } else {
      const newActions = result.actions[action].filter(f => f !== field);
      newResult = {
        subject: permissionSelected.name,
        actions: 
          {
            ...result.actions,
            [action]: [...newActions]
          }
      }

      setResult(newResult)

      if(newActions.length === 0){        
        setActionTypesSelected(actionTypesSelected.filter(act => act !== action))
      }
    }
    
    addPermission(newResult)
  }

  return (
    <div>
      <FormControl sx={{ mx: 1, width: ["30%", "30%", "30%"], mt: 2 }}>
        <InputLabel id="permission-name-label">access to</InputLabel>
        <Select
          labelId="permission-name-label"
          id="permission-selection"
          value={permissionSelected}
          onChange={handleChangePermissionName}
          input={<OutlinedInput label="access to" />}
          name="permissionSelection"
        >
          <MenuItem value='' key='None' sx={{ display: 'none' }}>None</MenuItem>

          {Object.values(permissions).map((perm, index) => (
            <MenuItem value={perm} key={index}>
              {perm.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {
        permissionSelected?.name && 
        <FormControl sx={{ mx: 2, width: ["60%", "60%", "60%"], mt: 2  }}>
          <InputLabel id="action-type-label">permission type</InputLabel>
          <Select
            labelId="action-type-label"
            id="action-type"
            multiple
            // open={open}
            onOpen={handleClick}
            onClose={handleClose}
            value={actionTypesSelected}
            onChange={null}
            input={
              <OutlinedInput
                // sx={{ width: ["70%", "70%", "70%"] }}
                label="permission type"
              />
            }
            renderValue={(selected) => selected.join(", ")}
            // MenuProps={MenuProps}
            name="actionsSelection"
          >
            <MenuItem value='' key='None' sx={{ display: 'none' }}>None</MenuItem>

            {Object.values(actions).map((action) => (
              <NestedMenuItem
                // {actionTypesSelected.includes(action) && sx={{background: "red"}} }
                sx= { actionTypesSelected.includes(action) && {background: "#EDF4FB"} }
                label={action}
                key={action}
                onClick={
                  (e) => {handleChangePermissionType(e, action)}            
                }
                parentMenuOpen={open}
              >
                  {
                    permissionSelected.fields.map((field, elem) => (
                      <MenuItem value={action} key={`${action} - ${field} - ${elem}`}
                        // style={{ display: 'flex', flexDirection: 'column', paddingLeft: "5px", width: 250, alignContent: "flexStart"}}
                        data-value={action}
                        onClick={(e) => handleChangeNestedSelect(e, action, field)}
                  >
                          <Checkbox key={`${field} - ${elem}`} checked={result.actions[action]?.includes(field) } />
                          <ListItemText key={field} primary={field} />
                          </MenuItem>
                    ))
                  }
              </NestedMenuItem>
            ))}
          </Select>
        </FormControl>
      }
    </div>
  );
}
