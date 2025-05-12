import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import { HashRouter as Router, Route, Routes } from "react-router-dom";
const App= () =>{
  return(
    <>
     <Sidebar/>
     <Main />
    </>
  )
}

export default App
