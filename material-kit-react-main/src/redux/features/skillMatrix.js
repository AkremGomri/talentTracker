/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
import { createAction } from "@reduxjs/toolkit";
import produce from "immer";

export const setSelected_skill_item_id = createAction(
    'selectedSkillItem/set',
    ({ _id, name, type }) => ({
        payload: {_id, name ,type},
    })
);

export const addField = createAction(
    'field/add',
    (field) => ({
        payload: {
            ...field,
            type: "field"
        },
    })
);

export const addSubField = createAction(
    'subField/add',
    (subField) => ({
        payload: {
            ...subField,
            type: "subField"
        },
    })
);

export const addSkill = createAction(
    'skill/add',
    (skill) => ({
        payload: {
            ...skill,
            type: "skill"
        },
    })
);

export const updateSkill = createAction(
    'skill/update',
    (skill) => ({
        payload: {
            ...skill,
            type: "skill"
        },
    })
);

export const addSkillElement = createAction(
    'skillElement/add',
    (skillElement) => ({
        payload: {
            ...skillElement,
            type: "skillElement"
        },
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
                draft.selectedItem = action.payload
                break;

            case setFields.toString():
                draft.all = action.payload
                break;

            case addField.toString():
                draft.all = [...draft.all, action.payload]
                break;

            case addSubField.toString():
                draft.all = draft.all.map(field => {
                    if(field._id === action.payload.parentItem){
                        field.childrenItems.push(action.payload);
                    }
                    return field
                    
                });
                break;

            case addSkill.toString():
                draft.all = draft.all.map(field => {
                    if (field._id === action.payload.parentItem) {
                        field.childrenItems = [...field.childrenItems, action.payload];
                    } else if (field.childrenItems) {
                        field.childrenItems = field.childrenItems.map(subField => {
                            if (subField._id === action.payload.parentItem) {
                                subField.childrenItems = [...subField.childrenItems, action.payload];
                            }
                            return subField;
                        });
                    }
                    return field;
                });
                break;

            case updateSkill.toString():
                draft.all = draft.all.map(field => {
                    if (field.childrenItems) {
                        field.childrenItems = field.childrenItems.map(subField => {
                            if (subField._id === action.payload.parentItem) {
                                subField.childrenItems = subField.childrenItems.map(skill => {
                                    if (skill._id === action.payload._id) {
                                        return action.payload;
                                    }
                                    return skill;
                                });
                            }
                            return subField;
                        });
                    }
                    return field;
                });
                break;

            // case addSkillElement.toString():
            //     console.log('action.payload: ', action.payload);
            //     draft.all = draft.all.map(field => {
            //         if (field.childrenItems) {
            //             field.childrenItems = field.childrenItems.map(subField => {
            //                 if(subField.childrenItems){
            //                     subField.childrenItems = subField.childrenItems.map(skill => {
            //                         if(skill._id === action.payload.parentItem){
            //                             console.log("welyeeey: ",skill);
            //                             skill.childrenItems = [...skill.childrenItems, action.payload];
            //                         }
            //                         return skill;
            //                     })
            //                 }
            //                 return subField;
            //             });
            //         }
            //         return field;
            //     });
            //     break;
            
                case deleteItem.toString():
                // eslint-disable-next-line no-case-declarations
                const { _id, type } = action.payload;

                draft.all = draft.all.filter(field => {
                    if(type !== 'field'){
                        field.childrenItems = field.childrenItems.filter(subField => {
                            if(type !== 'subField'){
                                subField.childrenItems = subField.childrenItems.filter(skill => {
                                    if(type !== 'skill'){
                                        skill.childrenItems = skill.childrenItems.filter(skillElement => {
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