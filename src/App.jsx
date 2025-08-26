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
import ProductsUpdate from './Admin/ProductsUpdate.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import CurrentLocation from './Pages/CurrentLocation.jsx';
import { PriceProvider } from './ContextAPI/PriceContext.jsx';
import PaymentPage from './Pages/PaymentPage.jsx';
import RefundReturnPolicy from './Pages/RefundReturnPolicy.jsx'
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx"
import ShippingPolicy from "./Pages/ShippingPolicy.jsx"
import
TermsConditions from "./Pages/TermsConditions"
import OrderProcessing  from "./Components/OrderProcessing.jsx"
import OrderSection from "./Admin/OderSection.jsx"
import SizeChange from './Pages/SizeChange.jsx';
import AnalyticsDashboard from './Admin/AnalyticsDashboard.jsx';
import ProductRouter from './Pages/ProductRouter.jsx';
import UserInfo from './Admin/UserInfo.jsx';
import Banner from './Admin/Components/Banner.jsx';
import OrderBulk from './Admin/OrderBulk.jsx';


const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // or "dark"
      />
    <Routes>

      
      <Route path='/' element={  <PriceProvider>  <CartProvider> <UserProvider> <Layout /> </UserProvider>  </CartProvider> </PriceProvider> }>
 
      <Route index path='' element={<Home/>}/>
       <Route index path='/home' element={<Home/>}/>
            <Route  path='/men' element={<Prodcuts/>}/>
              <Route  path='/women' element={<Prodcuts/>}/>
                <Route  path='/kid' element={<Prodcuts/>}/>
                  <Route  path='/corporate' element={<Prodcuts/>}/>
              <Route  path='/contact' element={<Contact/>}/>
                <Route  path='/cart' element={<Cart/>}/>
                <Route  path='/products/:id' element={<ProductRouter/>}/>
                  <Route  path='/getbulk' element={<GetBulk/>}/>
                     <Route  path='/order' element={<Order/>}/>
                      <Route  path='/design/:proid/:color' element={<TShirtDesigner/>}/>
                        <Route  path='/profile' element={<ProfilePanel/>}/>
                         <Route  path='/payment' element={<PaymentPage/>}/>
                          <Route path="/order-processing" element={<OrderProcessing />} />
                          <Route  path='/products/subcategory/:id/:catogory_name' element={<SaerchingPage/>}/>
                           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/refund-return-policy" element={<RefundReturnPolicy />} />
                            <Route path="/shipping-policy" element={<ShippingPolicy />} />
                            <Route path="/terms-and-conditions" element={<TermsConditions />} />
                             <Route path="/get_size/:id" element={<SizeChange />} />





      </Route>
      

   
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Adminhome />} />
        <Route path="products" element={<ProdcutsCreated />} />
        <Route path="category" element={<Category/>} />
        <Route path='moneyset' element={<MoneySet/>} />
        <Route path='edit/:id' element={<ProductsUpdate/>}/>
          <Route path='/admin/order' element={<OrderSection/>}/>
            <Route path='/admin/bulkorder' element={<OrderBulk/>}/>
           <Route path='/admin/sales' element={<AnalyticsDashboard/>}/>
              <Route path='/admin/users' element={<UserInfo/>}/>
               <Route path='/admin/bannersetup' element={<Banner/>}/>
                      

      </Route>
 
      
    </Routes>
    
    </>
  )
}

export default App