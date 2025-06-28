import React,{useState} from 'react'
import { FaSearch, FaShoppingBag } from 'react-icons/fa'
import logo from "../assets/image.png"

const Navbar = () => {
  const[isclick,setIsClick] = useState("Home")
  return (
    <nav className="w-full flex items-center  justify-center gap-[250px]  px-6 py-4 bg-[#0A0A0A] text-white font-semibold">
      {/* Left - Nav Links */}
      <div className="flex items-center gap-6  text-sm">
        {["Home", "Services", "Products", "Contact"].map((item, idx) => (
          <div key={idx} onClick={()=>setIsClick(item)} className="relative group cursor-pointer">
            <span className="uppercase">{item}</span>
            {item === isclick && (
              <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#E5C870]" />
            )}
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
        <div className="flex items-center border-b border-white gap-2 px-2 py-1">
          <FaSearch className="text-white" />
          <input
            type="text"
            placeholder="Search For Products..."
            className="bg-transparent placeholder-white text-white outline-none"
          />
        </div>
        <FaShoppingBag className="text-white text-xl cursor-pointer" />
      </div>

    </nav>
  )
}

export default Navbar