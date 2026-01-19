import React from 'react'
import MainCarousel from '../../components/HomeCarousel/MainCarousel'
import TopDiscountProducts from '../../components/TopDiscountProducts/TopDiscountProducts'
import TopPriceProducts from '../../components/TopPriceProducts/TopPriceProducts'
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid'

const HomePage = () => {

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainCarousel />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Discount Products Section - Flash Sale */}
        <TopDiscountProducts />
        
        {/* Top Price Products Section - Sản phẩm bán chạy */}
        <TopPriceProducts />
        
        {/* Category Grid Section */}
        <CategoryGrid />
      </div>
    </div>
  );
}

export default HomePage