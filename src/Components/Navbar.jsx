import React,{useState} from 'react'
import { FaSearch, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/image.png"
import { Link } from 'react-router-dom';

const Navbar = () => {
  const[isclick,setIsClick] = useState("Home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
    <nav className="w-full flex sm:items-center  sm:justify-center sm:gap-[250px] gap-[200px]   items-center justify-evenly   sm:px-6 py-4 bg-[#0A0A0A] text-white font-semibold">
      {/* Left - Nav Links */}
    
<div className="hidden md:flex items-center gap-6 text-sm">
  {["Home", "Services", "Products", "Contact"].map((item, idx) => (
    <div
      key={idx}
      onClick={() => setIsClick(item)}
      className="relative group cursor-pointer"
    >
      <Link to={`/${item.toLowerCase()}`}>
        <span className="uppercase">{item}</span>
        {item === isclick && (
          <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#E5C870]" />
        )}
      </Link>
    </div>
  ))}
</div>


      {/* Center - Logo */}
      <div className="flex-shrink-0">
        <img
          src={logo}
          alt="DUCO ART Logo"
          className="h-6 object-contain"
        />
      </div>

      {/* Right - Search and Cart */}
      <div className="flex items-center gap-4">
        <div className="  hidden   md:flex items-center border-b border-white gap-2 px-2 py-1">
          <FaSearch className="text-white" />
          <input
            type="text"
            placeholder="Search For Products..."
            className="bg-transparent placeholder-white text-white outline-none"
          />
        </div>
      <div className="flex items-center justify-center gap-6">
  {/* Shopping Cart Icon */}
  <FaShoppingBag className="text-white text-xl cursor-pointer" />

  {/* Mobile Menu Toggle - Only visible on mobile */}
  <div className="md:hidden flex items-center justify-center">
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="flex items-center justify-center"
    >
      {mobileMenuOpen ? (
        <FaTimes className="text-white text-xl" />
      ) : (
        <FaBars className="text-white text-xl" />
      )}
    </button>
  </div>
</div>


       
      </div>
      
       

    </nav>

     {mobileMenuOpen && (
        <div className="md:hidden px-3 flex  gap-4 text-center  text-white text-sm">
          {["Home", "Services", "Products", "Contact"].map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setIsClick(item);
                setMobileMenuOpen(false);
              }}
              className="relative group cursor-pointer"
            >
               <Link to={`/${item.toLowerCase()}`}>
              <span className="uppercase">{item}</span>
              {item === isclick && (
                <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#E5C870]" />
              )}
              </Link>
              
            </div>
          ))}
        </div>
      )}
   <div className="md:hidden  mt-2  relative   flex items-center gap-2 px-2 py-1">
  <FaSearch className="text-white" />
  <input
    type="text"
    placeholder="Search For Products..."
    className="bg-transparent placeholder-white text-white outline-none w-full"
  />
   <div className="absolute left-3 -bottom-1 h-[2px] w-1/2 bg-[white]" />
</div>


    </>

  )
}

export default Navbar