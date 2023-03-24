import { configureStore } from '@reduxjs/toolkit'
import languageReducer from './reducers/language';
 
export default configureStore({
    reducer: {
        language: languageReducer
    },
})