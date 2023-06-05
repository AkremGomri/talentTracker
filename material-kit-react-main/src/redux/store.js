import { configureStore } from '@reduxjs/toolkit'

import roleReducer from './features/role';
import myProfileReducer from './features/myProfile';
import userReducer from './features/user';
import FieldReducer from './features/skillMatrix';
// import languageReducer from './reducers/language';
 
export default configureStore({
    reducer: {
        // language: languageReducer
        roles: roleReducer,
        users: userReducer,
        me: myProfileReducer,
        Field: FieldReducer,
    },
})