import React from 'react'
import firstImg from "../assets/gloomy-young-black-model-clean-white-unlabeled-cotton-t-shirt-removebg-preview.png"

const BoxOfProdcuts = () => {
    const colors = ["#FF0000", "#FF8A00", "#4A4AFF", "#FFFFFF", "#000000"];
  return (
    <div className=' flex  flex-col items-center justify-center     '>
            <div className=' flex  bg-[#E5C870]  justify-evenly px-[20px] gap-[60px]   rounded-2xl items-center  '>
                 <div className=" flex flex-col gap-3 z-10  mt-[20px] mb-[80px]">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full border border-black"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
        <img src={firstImg} alt="Product" className=' h-[250px]  mt-[80px]   object-contain' />
           
            </div>


        <div className='bg-[#E5C870] text-black   ml-[180px]   text-lg px-1  py-0.5 text-center  rounded-lg   font-bold mt-2'>
            $300-400
        </div>
    </div>

  )
}

export default BoxOfProdcuts