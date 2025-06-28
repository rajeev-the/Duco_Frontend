import React from 'react'
import { Outlet } from 'react-router-dom';
import  Navbar from './Components/Navbar.jsx';

const Layout = () => {
  return (
  <>
  <div  className='h-full w-full  bg-[#0A0A0A] montserrat-light'>
    <Navbar/>
 <div>
<Outlet/>
 </div>
    
  </div>
  
  </>
  )
}

export default Layout