import { createAction } from "@reduxjs/toolkit";
import produce from "immer";


export const setMyRole = createAction(
    'myRole/set',
    (role) => ({
        payload: role,
    })
);

export default function myProfileReducer(state = {selectedRole: {}, all: []}, action) {
    // eslint-disable-next-line consistent-return
    return produce(state, draft => {
        switch(action.type) {
            case setMyRole.toString():
                draft.role = action.payload
                break;

            default:
                return state
        }
    })
}