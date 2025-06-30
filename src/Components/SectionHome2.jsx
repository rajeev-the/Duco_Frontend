import React from 'react'
import BoxOfProdcuts from './BoxOfProdcuts'

const SectionHome2 = () => {
  return (
 <section className="mt-10 px-4 md:px-8 lg:px-16">
  <h1 className="text-3xl text-white text-center font-semibold">Shop Now</h1>

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
</section>

  )
}

export default SectionHome2