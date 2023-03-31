import { configureStore } from '@reduxjs/toolkit'

import roleReducer from './features/role';
// import languageReducer from './reducers/language';
 
export default configureStore({
    reducer: {
        // language: languageReducer
        roles: roleReducer
    },
})