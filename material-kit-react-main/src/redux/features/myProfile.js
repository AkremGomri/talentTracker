import { createAction } from "@reduxjs/toolkit";
import produce from "immer";


export const setMyRole = createAction(
    'myRole/set',
    (role) => ({
        payload: role,
    })
);

export const setMyProfile = createAction(
    'myProfile/set',
    (data) => ({
        payload: data
    })
)

export const setMySkills = createAction(
    'mySkills/set',
    (data) => ({
        payload: data
    })
)

export default function myProfileReducer(state = {selectedRole: {}, all: []}, action) {
    // eslint-disable-next-line consistent-return
    return produce(state, draft => {
        switch(action.type) {
            case setMyRole.toString():
                draft.role = action.payload;
                break;

            case setMyProfile.toString():
                draft.myProfile = action.payload;
                break;

            case setMySkills.toString():
                draft.myProfile.skills = action.payload;
                break;

            default:
                return state
        }
    })
}