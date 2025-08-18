import React from 'react'
import {Link } from  'react-router-dom'
import {
  Youtube,
  Facebook,

} from "lucide-react";
import logo from "../assets/image.png"



const Footer = () => {
  return (
 <footer className="w-full text-black mt-20  px-4">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-2 bg-black  w-full  ">
        {/* Left - Contact Info */}
        <div className="bg-white p-6 rounded-2xl flex-[1] min-w-[250px]">
          <img src={logo} alt="DUCO ART" className="w-32 mb-4" />
          <p className="mb-1">Phone : xxxxxxxxxx</p>
          <p>Email : ducoart@12.com</p>
        </div>

        {/* Right - Navigation */}
        <div className="bg-white p-6 rounded-2xl flex-[3]">
          <div className="grid grid-cols-1  sm:px-[100px] sm:grid-cols-3 gap-1">
            {/* Shop */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Shop</h3>
              <ul className="space-y-1  text-sm">
                <li>New</li>
                <li>Women</li>
                <li>Men</li>
                <li>Kid</li>
              </ul>
            </div>

            {/* Our Store */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Our Store</h3>
              <ul className="space-y-1 text-sm">
                <li>About</li>
                <li><Link to="/order" className="hover:text-[#E5C870]">My Order</Link></li>
                <li><Link to="/contact" className="hover:text-[#E5C870]">Contact Us</Link></li>
                <li>FAQ</li>
                <li>
  <a href="mailto:ducoart@12.com" className="hover:text-[#E5C870]">
    Help and support
  </a>
</li>

                
              </ul>
            </div>

            {/* Terms */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Term & Conditions</h3>
              <ul className="space-y-1 text-sm mb-8">
          <li><Link to="/privacy-policy" className="hover:text-[#E5C870]">Privacy Policy</Link></li>
          <li><Link to="/refund-return-policy" className="hover:text-[#E5C870]">Refund & Return Policy</Link></li>
          <li><Link to="/shipping-policy" className="hover:text-[#E5C870]">Shipping Policy</Link></li>
          <li><Link to="/terms-and-conditions" className="hover:text-[#E5C870]">Terms and Conditions</Link></li>
        </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row gap-2  mt-2   min-w-[250px]">
        {/* Social Icons */}
        <div className="bg-white px-[22px] rounded-2xl flex items-center gap-6 justify-center md:justify-start flex-1 ">
          <Youtube className="w-6 h-6" />
          <Facebook className="w-6 h-6" />
       
            
         
        </div>

        {/* Footer Text */}
        <div className="bg-[#E5C870] text-center p-4 rounded-2xl flex-[3]">
          <p className="text-black font-medium text-sm">
            © 2035 by T Shop. Powered and secured
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer