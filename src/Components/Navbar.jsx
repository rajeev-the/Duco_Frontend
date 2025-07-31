import React,{useState} from 'react'
import { FaSearch, FaShoppingBag, FaBars, FaTimes   } from "react-icons/fa";
import { RiAccountCircle2Fill } from "react-icons/ri";
import logo from "../assets/image.png"
import { Link , useNavigate } from 'react-router-dom';
import ProductMegaMenu from './ProductMegaMenuXX';

const Navbar = ({setIsOpenLog ,user}) => {
  const[isclick,setIsClick] = useState("Home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [mobileMegaOpen, setMobileMegaOpen] = useState(false);



  return (
    <>
    <nav className="w-full flex sm:items-center  sm:justify-center sm:gap-[250px] gap-[180px]   items-center justify-evenly   sm:px-6 py-4 bg-[#0A0A0A] text-white font-semibold">
      {/* Left - Nav Links */}
 <div className="hidden md:flex items-center gap-6 text-sm">
  {["Home", "Products", "Order", "Contact"].map((item, idx) => (
    item === "Products" ? (
      <div
        key={idx}
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsClick("Products")}
        onMouseLeave={() => setIsClick("Home")}
      >
        <Link to="/products">
          <span className="uppercase">{item}</span>
        </Link>

        {isclick === "Products" && (
          <>
            <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#E5C870]" />
            <div className="absolute top-full  mt-1.5 z-50">
              <ProductMegaMenu />
            </div>
          </>
        )}
      </div>
    ) : (
      <div
        key={idx}
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsClick(item)}
        onMouseLeave={() => setIsClick("Home")}
      >
        <Link to={`/${item.toLowerCase()}`}>
          <span className="uppercase">{item}</span>
        </Link>
        {item === isclick && (
          <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#E5C870]" />
        )}
      </div>
    )
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
      <div className="flex items-center justify-center gap-4">
  {/* Shopping Cart Icon */}
    <FaShoppingBag onClick={()=> navigate('/cart')} className="text-white text-xl cursor-pointer" />

{
  !user ? (
    <div
  onClick={() => setIsOpenLog(true)}
  className="text-white text-sm cursor-pointer border hidden   md:flex border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-sm"
>
  Login
</div>
  ):(
     <RiAccountCircle2Fill  onClick={()=> navigate("/profile")}  className="text-white text-3xl hidden   md:flex  cursor-pointer" />

  )
}


     
      


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

    
   <div className="md:hidden  mt-2  relative   flex items-center gap-2 px-2 py-1">
  <FaSearch className="text-white" />
  <input
    type="text"
    placeholder="Search For Products..."
    className="bg-transparent placeholder-white text-white outline-none w-full"
  />
  {
    !user ? (
       <div
  onClick={() => setIsOpenLog(true)}
  className="text-white text-sm cursor-pointer border border-white px-2 py-1 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-sm"
>
  Login
</div>

    ):(
       <RiAccountCircle2Fill  onClick={()=> navigate("/profile")} className="text-white text-3xl cursor-pointer" />

    )
  }
  
   <div className="absolute left-3 -bottom-1 h-[2px] w-1/2 bg-[white]" />
   
</div>
 {mobileMenuOpen && (
        <div className="md:hidden px-3 flex  mt-4 gap-4 text-center  text-white text-sm">
          {["Home", "Products", "Order", "Contact"].map((item, idx) => (
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



    </>

  )
}

export default Navbar