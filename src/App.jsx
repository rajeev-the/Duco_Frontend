import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './Pages/Home.jsx';
import './App.css';
import Prodcuts from './Pages/Prodcuts.jsx';
import Contact from './Pages/Contact.jsx';
import ProductPage from './Pages/ProductPage.jsx';
import Adminhome from "./Admin/Home.jsx"
import Cart from './Pages/Cart.jsx';
import GetBulk from './Pages/GetBulk.jsx';
import Order from './Pages/Order.jsx';
import ProdcutsCreated from './Admin/ProdcutsCreated.jsx';
import AdminLayout from './Admin/AdminLayout .jsx';
import Category from './Admin/Category.jsx';
import { CartProvider } from './ContextAPI/CartContext.jsx';
import TShirtDesigner from './Pages/TShirtDesigner.jsx';
import MoneySet from './Admin/MoneySet.jsx';
import { UserProvider } from './ContextAPI/UserContext.jsx';
import ProfilePanel from './Pages/ProfilePanel.jsx';
import SaerchingPage from './Pages/SaerchingPage.jsx';


const App = () => {
  return (
    <>
    <Routes>

      
      <Route path='/' element={ <CartProvider> <UserProvider> <Layout /> </UserProvider>  </CartProvider>}>
 
      <Route index path='' element={<Home/>}/>
       <Route index path='/home' element={<Home/>}/>
            <Route  path='/products' element={<Prodcuts/>}/>
              <Route  path='/contact' element={<Contact/>}/>
                <Route  path='/cart' element={<Cart/>}/>
                <Route  path='/products/:id' element={<ProductPage/>}/>
                  <Route  path='/getbulk' element={<GetBulk/>}/>
                     <Route  path='/order' element={<Order/>}/>
                      <Route  path='/design/:proid' element={<TShirtDesigner/>}/>
                        <Route  path='/profile' element={<ProfilePanel/>}/>
                          <Route  path='/products/subcategory/:id/:catogory_name' element={<SaerchingPage/>}/>




      </Route>
      

   
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Adminhome />} />
        <Route path="products" element={<ProdcutsCreated />} />
        <Route path="category" element={<Category/>} />
        <Route path='moneyset' element={<MoneySet/>} />

      </Route>
 
      
    </Routes>
    
    </>
  )
}

export default App