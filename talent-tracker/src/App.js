import logo from './logo.svg';
import './App.css';
import Router from './Router';
import React, { createContext } from 'react'
import { BrowserRouter } from 'react-router-dom';

export const UserContext = React.createContext();

function App() {
  return (
    <UserContext.Provider value="Reed">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
