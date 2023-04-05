import { configureStore } from '@reduxjs/toolkit'

import roleReducer from './features/role';
import myProfileReducer from './features/myProfile';
// import languageReducer from './reducers/language';
 
export default configureStore({
    reducer: {
        // language: languageReducer
        roles: roleReducer,
        myProfile: myProfileReducer,
    },
})