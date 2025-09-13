import React from 'react'
import "./ProductCard.css"
const ProductCard = () => {
  return (
    <div className="productCard w-[15rem] m-3 transition-all cursor-pointer">
      <div className="h-[20rem]">
        <img
          className="h-full w-full object-cover object-left-top"
          src="../../../assets/img/Co-Vietnam.png"
          alt=""
        />
      </div>
      <div className="textPart bg-white p-3">
        <div>
            <p className='font-bold opacity-60'>Universaloutfit</p>
          <p className="">Men Printed Cotton Blend Straight Kurta</p>
        </div>
        <div className='flex items-center space-x-2'>
            <p className='font-semibold'>1000000Đ</p>
            <p className='line-through opacity-50'>1000000000Đ</p>
            <p className='text-green-600 font-semibold'>70$ off</p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard