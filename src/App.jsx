import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './Pages/Home.jsx';
import './App.css';
import Prodcuts from './Pages/Prodcuts.jsx';
import Contact from './Pages/Contact.jsx';
import ProductPage from './Pages/ProductPage.jsx';

import Cart from './Pages/Cart.jsx';
import GetBulk from './Pages/GetBulk.jsx';
import Order from './Pages/Order.jsx';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index path='' element={<Home/>}/>
       <Route index path='/home' element={<Home/>}/>
            <Route  path='/products' element={<Prodcuts/>}/>
              <Route  path='/contact' element={<Contact/>}/>
                <Route  path='/cart' element={<Cart/>}/>
                <Route  path='/products/:id' element={<ProductPage/>}/>
                  <Route  path='/getbulk' element={<GetBulk/>}/>
                     <Route  path='/order' element={<Order/>}/>



      </Route>
      
    </Routes>
    
    </>
  )
}

export default App