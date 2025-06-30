import React from 'react'
import BoxOfProdcuts from './BoxOfProdcuts'
import { ChevronRight } from 'lucide-react';

const SectionHome2 = () => {
  return (
<section className="mt-[100px] sm:mt-10 px-4 md:px-8 lg:px-16">
  <h1 className="text-3xl text-white text-center font-semibold">Shop Now</h1>

  {/* Product Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
    <BoxOfProdcuts />
    <BoxOfProdcuts />
    <BoxOfProdcuts />
    <BoxOfProdcuts />
    <BoxOfProdcuts />
    <BoxOfProdcuts />
    <BoxOfProdcuts />
    <BoxOfProdcuts />
  </div>

  {/* Button Wrapper */}
  <div className="mt-6 flex justify-end">
    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl shadow-sm border font-semibold hover:bg-gray-100 transition">
      Explore All
      <ChevronRight size={20} />
    </button>
  </div>
</section>


  )
}

export default SectionHome2