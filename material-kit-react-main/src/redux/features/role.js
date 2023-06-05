/* eslint-disable no-case-declarations */
/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable spaced-comment */
import { createAction } from '@reduxjs/toolkit'
import { produce } from 'immer';

export const setSelectedRole = createAction(
    'role/selected',
    (role) => ({
        payload: role,
    })
);

export const addOneRole = createAction(
    'role/add',
    (role) => ({
        payload: role,
    })
);

export const setRoles = createAction(
    'roles/add',
    (roles) => ({
        payload: roles,
    })
);

export const addManyRoles = createAction(
    'roles/add',
    (roles) => ({
        payload: roles,
    })
);

export const deleteManyRolesByName = createAction(
    'roles/deleteByName',
    (nameList) => ({
        payload: nameList,
    })
);

export const deleteManyRoles = createAction(
    'roles/delete',
    (roles) => ({
        payload: roles.map((role) => role._id),
    })
);

export const deleteOneRoleById = createAction(
    'role/delete',
    (id) => ({
        payload: id,
    })
);

export const deleteManyRolesByMatch = createAction(
    'roles/deleteByMatch',
    (match) => ({
        payload: match,
    })
);

export default function roleReducer(state = {selectedRole: {}, all: []}, action) {
    // eslint-disable-next-line consistent-return
    return produce(state, draft => {
        switch(action.type) {
            case setSelectedRole.toString():
                draft.selectedRole = action.payload
                break;
                
            case setRoles.toString():
                draft.all = action.payload
                break;
                    
            case addManyRoles.toString():
                const draftIds = draft.all.map((role) => role._id);

                action.payload.forEach((role, index) => {
                    if(draftIds.includes(role._id)) return;
                    draftIds.push(role._id)
                    draft.all.push(role)
                })
                break;

            case deleteManyRolesByName.toString():
                draft.all = state.all.filter((role) => !action.payload.includes(role.name));
                break;

            case deleteOneRoleById.toString():
                draft.all = state.all.filter((role) => role._id !== action.payload);
                break;
                
                /* not used */
            case addOneRole.toString():
                draft.all.push(action.payload)
                break;
            case deleteManyRoles.toString():
                draft.all = state.all.filter((role) => !action.payload.includes(role._id));
                break;
            case deleteManyRolesByMatch.toString():
                draft.all = filterRoles(action.payload, draft.all) // I can make better
                break;

            default:
                return state
        }
    })
}

function filterRoles(match, roles){
    return roles.filter((role) => {
        for(const [key, value] of Object.entries(match)){
          if(Array.isArray(value)){
            for(let i=0; i<value.length; i++){
              if(role[key] === value[i]) return false
            }
          } else {
            if(role[key] === value) return false  
          }
        }
        return true
      })
}