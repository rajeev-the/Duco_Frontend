import React,{useState} from 'react'
import OrderCart from '../Components/OrderCart'
import {  FaShoppingBag } from "react-icons/fa";
import BoxOfProdcuts from '../Components/BoxOfProdcuts';



import watchphoto from '../assets/gloomy-young-black-model-clean-white-unlabeled-cotton-t-shirt-removebg-preview.png'


const sampleProduct = {
  id: "1",
  name: "Noise Icon '2.1' Display with Bluetooth Calling",
  image: watchphoto,
};

const Order = () => {
  const [orderStatus, setOrderStatus] = useState(true);

  return (
  <div className='w-full h-full p-10'>
     
     <div className='mb-7  '> 
       <FaShoppingBag  size={40}  className="text-white text-xl cursor-pointer" /> 
      
     </div>
      
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                  <OrderCart/>
                
            
                   </div>


                   <section className="mt-5">
  <div>
    <h3 className="text-start font-bold text-white text-2xl">Related Products</h3>

    <div className="mt-5 overflow-x-auto  scrollbar-none [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-4 w-max">
     
      <BoxOfProdcuts />
    <BoxOfProdcuts />
     
      </div>
    </div>
  </div>
</section> 


                 

  </div>
  )
}

export default Order