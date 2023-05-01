/* eslint-disable no-case-declarations */
/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable spaced-comment */
import { createAction } from '@reduxjs/toolkit'
import { produce } from 'immer';

export const setSelectedUser = createAction(
    'user/selected',
    (user) => ({
        payload: user,
    })
);

export const addOneUser = createAction(
    'user/add',
    (user) => ({
        payload: user,
    })
);

export const setUsers = createAction(
    'users/add',
    (users) => ({
        payload: users,
    })
);

export const addManyUsers = createAction(
    'users/add',
    (users) => ({
        payload: users,
    })
);

export const deleteManyUsersByName = createAction(
    'users/deleteByName',
    (nameList) => ({
        payload: nameList,
    })
);

export const deleteManyUsers = createAction(
    'users/delete',
    (users) => ({
        payload: users.map((user) => user._id),
    })
);

export const deleteOneUserById = createAction(
    'user/delete',
    (id) => ({
        payload: id,
    })
);

export const deleteManyUsersByMatch = createAction(
    'users/deleteByMatch',
    (match) => ({
        payload: match,
    })
);

export default function userReducer(state = {selectedUser: {}, all: []}, action) {
    // eslint-disable-next-line consistent-return
    return produce(state, draft => {
        switch(action.type) {
            case setSelectedUser.toString():
                draft.selectedUser = action.payload
                break;
                
            case setUsers.toString():
                draft.all = action.payload
                break;
                    
            case addManyUsers.toString():
                // console.log('addManyUsers: ', action.payload);
                const draftIds = draft.all.map((user) => user._id);

                action.payload.forEach((user, index) => {
                    if(draftIds.includes(user._id)) return;
                    draftIds.push(user._id)
                    draft.all.push(user)
                })
                break;

            case deleteManyUsersByName.toString():
                console.log("hhhh: ",action.payload);
                console.log("eyeyyeyeyeyye: ", state.all.filter((user) => !action.payload.includes(user.email)));
                console.log("state: ", state.all);
                console.log("draft: ", draft.all);
                draft.all = state.all.filter((user) => !action.payload.includes(user.email));
                break;

            case deleteOneUserById.toString():
                draft.all = state.all.filter((user) => user._id !== action.payload);
                break;
                
                /* not used */
            case addOneUser.toString():
                draft.all.push(action.payload)
                break;
            case deleteManyUsers.toString():
                draft.all = state.all.filter((user) => !action.payload.includes(user._id));
                break;
            case deleteManyUsersByMatch.toString():
                draft.all = filterUsers(action.payload, draft.all) // I can make better
                break;

            default:
                return state
        }
    })
}

function filterUsers(match, users){
    return users.filter((user) => {
        for(const [key, value] of Object.entries(match)){
          if(Array.isArray(value)){
            for(let i=0; i<value.length; i++){
              if(user[key] === value[i]) return false
            }
          } else {
            if(user[key] === value) return false  
          }
        }
        return true
      })
}