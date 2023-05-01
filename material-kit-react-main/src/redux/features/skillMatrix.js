/* eslint-disable camelcase */
import { createAction } from "@reduxjs/toolkit";
import produce from "immer";

export const setSelected_skill_item_id = createAction(
    'selectedSkillItem/set',
    ({ _id, name, type }) => ({
        payload: {_id, name ,type},
    })
);

export const addFields = createAction(
    'field/add',
    (field) => ({
        payload: field,
    })
);

export const setFields = createAction(
    'fields/set',
    (fields) => ({
        payload: fields,
    })
);

export const deleteItem = createAction(
    'field/delete',
    (item) => ({
        payload: item,
    })
);

export default function FieldReducer(state = {selectedItem: {}}, action) {
    // eslint-disable-next-line consistent-return
    return produce(state, draft => {
        switch(action.type) {
            case setSelected_skill_item_id.toString():
                console.log('action.payload: ', action.payload);
                draft.selectedItem = action.payload
                break;

            case setFields.toString():
                draft.all = action.payload
                break;

            case addFields.toString():
                draft.all.push(...action.payload)
                break;
            
            case deleteItem.toString():
                // eslint-disable-next-line no-case-declarations
                const { _id, type } = action.payload;

                draft.all = draft.all.filter(field => {
                    if(type !== 'field'){
                        field.subFields = field.subFields.filter(subField => {
                            if(type !== 'subField'){
                                subField.skills = subField.skills.filter(skill => {
                                    if(type !== 'skill'){
                                        skill.skillElements = skill.skillElements.filter(skillElement => {
                                            if(type === "skillElement") {
                                                return skillElement._id !== _id;
                                            }
                                            return skillElement;
                                        })
                                        return skill
                                    }
                                    return skill._id !== _id
                                })
                                return subField;
                            }
                            return subField._id !== _id
                        })
                        return field;
                    }
                    return field._id !== _id
                })

                break;

            default:
                return state
        }
    })
}