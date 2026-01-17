import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MainCarousel from '../../components/HomeCarousel/MainCarousel'
import HomeSectionCarousel from '../../components/HomeSectionCarousel/HomeSectionCarousel'
import { fetchCategoriesWithProducts } from '../../State/Products/Action'

const HomePage = () => {
  const dispatch = useDispatch();
  const { categoriesWithProducts = [], categoriesLoading } = useSelector((state) => state.products) || {};

  // Fetch categories that have products on mount
  useEffect(() => {
    dispatch(fetchCategoriesWithProducts());
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainCarousel />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {categoriesLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        ) : categoriesWithProducts.length > 0 ? (
          <div className="space-y-6">
            {categoriesWithProducts.map((category) => (
              <HomeSectionCarousel 
                key={category.id}
                sectionName={category.displayName || category.name} 
                categoryName={category.name}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-lg">Chưa có sản phẩm nào trong cửa hàng</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage