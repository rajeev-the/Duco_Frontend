import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './Pages/Home.jsx';
import './App.css';
import Prodcuts from './Pages/Prodcuts.jsx';
import Contact from './Pages/Contact.jsx';
import ProductPage from './Pages/ProductPage.jsx';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index path='Home' element={<Home/>}/>
            <Route  path='/products' element={<Prodcuts/>}/>
              <Route  path='/contact' element={<Contact/>}/>
                <Route  path='/products/:id' element={<ProductPage/>}/>


      </Route>
      
    </Routes>
    
    </>
  )
}

export default App