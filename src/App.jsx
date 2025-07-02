import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './Pages/Home.jsx';
import './App.css';
import Prodcuts from './Pages/Prodcuts.jsx';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index element={<Home/>}/>
            <Route  path='/products' element={<Prodcuts/>}/>


      </Route>
      
    </Routes>
    
    </>
  )
}

export default App