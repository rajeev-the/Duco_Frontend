import React,{useState} from 'react'
import { FaSearch, FaShoppingBag, FaBars, FaTimes   } from "react-icons/fa";
import { RiAccountCircle2Fill } from "react-icons/ri";
import logo from "../assets/image.png"
import { Link , useNavigate } from 'react-router-dom';
import ProductMegaMenu from './ProductMegaMenuXX';
import MobileSidebar from './MobileSidebar';
 const menuItems = [
    { name: "Home", link: "/" ,isbold:false},
    { name: "Men", link: "/men", hasMegaMenu: true ,isbold:true},
    { name: "Women", link: "/women", hasMegaMenu: true ,isbold:true},
    { name: "Kid", link: "/kid", hasMegaMenu: true ,isbold:true},
    { name: "Corporate", link: "/corporate" ,hasMegaMenu: true,isbold:true}
  ];

  const menuItemss = [
  { name: "Home", link: "/" },
  { name: "Men",   megaCategory: "Men" },    // dropdown fetched from API
  { name: "Women", megaCategory: "Women" },  // dropdown fetched from API
  { name: "Kids",  megaCategory: "Kids" },
  { name: "Corporate",  megaCategory: "Corporate T-shirt" },
     // dropdown fetched from API

];

const Navbar = ({setIsOpenLog ,user}) => {
  const[isclick,setIsClick] = useState("Home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [mobileMegaOpen, setMobileMegaOpen] = useState(false);



  return (
   <>
      <nav className="w-full flex sm:items-center sm:justify-center sm:gap-[250px] gap-[180px] items-center justify-evenly sm:px-6 py-4 bg-[#0A0A0A] text-white font-semibold">
        
        {/* Left Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsClick(item.name)}
              onMouseLeave={() => setIsClick("Home")}
            >
              <Link to={item.link}>
                <span className={`${item.isbold ? "font-bold "  : "   font-extralight " } uppercase `} >{item.name}</span>
              </Link>

              {item.name === isclick && (
                <div className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#E5C870]" />
              )}

              {/* MegaMenu on hover */}
              {item.hasMegaMenu && isclick === item.name && (
                <div className="absolute top-full  left-[-20px] mt-1 z-50">
                  <ProductMegaMenu category={item.name} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center Logo */}
        <div className="flex-shrink-0">
          <img src={logo} alt="DUCO ART Logo" className="h-6 object-contain" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center border-b border-white gap-2 px-2 py-1">
            <FaSearch className="text-white" />
            <input
              type="text"
              placeholder="Search For Products..."
              className="bg-transparent placeholder-white text-white outline-none"
            />
          </div>

          {/* Cart & Login/Profile */}
          <div className="flex items-center justify-center gap-4">
            <FaShoppingBag
              onClick={() => navigate("/cart")}
              className="text-white text-xl cursor-pointer"
            />
            {!user ? (
              <div
                onClick={() => setIsOpenLog(true)}
                className="text-white text-sm cursor-pointer border hidden md:flex border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-sm"
              >
                Login
              </div>
            ) : (
              <RiAccountCircle2Fill
                onClick={() => navigate("/profile")}
                className="text-white text-3xl hidden md:flex cursor-pointer"
              />
            )}

            {/* Mobile Toggle */}
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

      {/* Mobile Search */}
      <div className="md:hidden mt-2 relative flex items-center gap-2 px-2 py-1">
        <FaSearch className="text-white" />
        <input
          type="text"
          placeholder="Search For Products..."
          className="bg-transparent placeholder-white text-white outline-none w-full"
        />
        {!user ? (
          <div
            onClick={() => setIsOpenLog(true)}
            className="text-white text-sm cursor-pointer border border-white px-2 py-1 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-sm"
          >
            Login
          </div>
        ) : (
          <RiAccountCircle2Fill
            onClick={() => navigate("/profile")}
            className="text-white text-3xl cursor-pointer"
          />
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
       <MobileSidebar menuItems={menuItemss} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>
      )}
    </>

  )
}

export default Navbar