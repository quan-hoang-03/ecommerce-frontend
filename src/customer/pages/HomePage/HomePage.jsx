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
    <div>
      <MainCarousel />
      <div className="space-y-10 py-20 flex flex-col justify-center lg:px-10 px-5">
        {categoriesLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : categoriesWithProducts.length > 0 ? (
          categoriesWithProducts.map((category) => (
            <HomeSectionCarousel 
              key={category.id}
              sectionName={category.displayName || category.name} 
              categoryName={category.name}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">Chưa có sản phẩm nào trong cửa hàng</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage