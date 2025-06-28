import React from 'react'
import heroImg from '../assets/20250624_0035_Vibrant Court Relaxation_remix_01jyf2tnt9es2vn3cs02bzdyzz.png'; // Adjust the path as necessary
import firstImg from "../assets/gloomy-young-black-model-clean-white-unlabeled-cotton-t-shirt-removebg-preview.png"
import secondImg from "../assets/pleased-young-handsome-guy-wearing-black-t-shirt-points-up-putting-hand-hip-isolated-white-wall-removebg-preview.png"


const SectionHome1 = () => {

  return (
    <>
 <section className="relative mt-8 flex justify-center ">
  <div className="max-w-screen-xl flex w-full md:grid-cols-3 gap-6 px-4 md:px-8">
    
    {/* Left big image */} 
    <div className="relative h-[75%] w-[70%] rounded-2xl flex flex-col overflow-hidden">
      {/* Image */}
      <img
        src={heroImg}
        alt="Main Visual"
        className="w-full h-full object-cover rounded-2xl"
      />

      {/* Text Overlay */}
      <div className="absolute top-10 left-10 z-10 text-white">
        <p className="text-6xl font-semibold leading-13">
          Color Of <br /> Summer <br /> Outfit
        </p>
        <button className="mt-4 px-6 py-1 bg-[#E5C870] text-black rounded-full shadow-lg">
          Shop the Look →
        </button>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 rounded-2xl z-0" />
    </div>

    {/* Right stacked cards */}
    <div className="flex flex-col gap-2">
      {/* Card 1 */}
      <div className="bg-[#3a3a3a] text-[#E5C870] p-6 rounded-2xl relative flex flex-col h-[250px] w-[400px]">
        <p className="text-4xl font-semibold leading-8 mt-[50px] z-10 relative">Naturally<br />Styled</p>
        <img
          src={secondImg}
          alt="Styled Model"
          className="object-contain absolute bottom-0 right-4 rounded-md mt-auto max-h-[240px]"
        />
      </div>

      {/* Card 2 */}
      <div className="bg-[#e2c565] text-black p-6 rounded-2xl relative h-[335px] overflow-hidden">
        <h2 className="text-5xl  font-semibold leading-11 mt-[70px] z-10 relative">
          Casual <br /> Comfort
        </h2>
        <img
          src={firstImg}
          alt="Casual Comfort"
          className="absolute bottom-0 right-4 w-[160px] object-contain"
        />
      </div>
    </div>
  </div>

  {/* Scroll Down Button (fixed to bottom center of section) */}
  <div className=" absolute bottom-[155px] right-[80px] transform -translate-x-1/2">
    <button className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-xl text-black font-semibold   transition duration-300">
      Scroll Down
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4  font-bold"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>
</section>




</>
  )
}

export default SectionHome1