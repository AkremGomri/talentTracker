import { configureStore } from '@reduxjs/toolkit'

import roleReducer from './features/role';
import myProfileReducer from './features/myProfile';
import userReducer from './features/user';
// import languageReducer from './reducers/language';
 
export default configureStore({
    reducer: {
        // language: languageReducer
        roles: roleReducer,
        users: userReducer,
        myProfile: myProfileReducer,
    },
})