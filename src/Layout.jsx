import React from 'react'
import { Outlet } from 'react-router-dom';
import  Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';

const Layout = () => {
  return (
  <>
  <div  className='h-full w-full  bg-[#0A0A0A] montserrat-light'>
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E5C870] to-transparent"></div>
    <Navbar/>
 <div>
<Outlet/>
 </div>

 <Footer/>
    
  </div>
  
  </>
  )
}

export default Layout