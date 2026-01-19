import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HomeSectionCard from '../HomeSectionCard/HomeSectionCard';
import { findProductsByCategoryName } from '../../State/Products/Action';


const HomeSectionCarousel = ({ data, sectionName, categoryName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get products from Redux store (reducer is named 'products' in store.js)
  const { productsByCategory = {}, categoryLoading = {} } = useSelector((state) => state.products) || {};
  
  // Fetch products when categoryName is provided
  useEffect(() => {
    if (categoryName && !productsByCategory[categoryName]) {
      dispatch(findProductsByCategoryName(categoryName));
    }
  }, [categoryName, dispatch, productsByCategory]);
  
  // Use API data if categoryName is provided, otherwise use static data
  const productsData = categoryName 
    ? (productsByCategory[categoryName] || []) 
    : (data || []);
  
  const isLoading = categoryName ? categoryLoading[categoryName] : false;

  // Map API product structure to match what HomeSectionCard expects
  const mapProductData = (product) => {
    // If data comes from API (has discountPrice), map it
    if (product.discountPrice !== undefined) {
      return {
        ...product,
        discountedPrice: product.discountPrice, // API uses discountPrice, card uses discountedPrice
      };
    }
    return product;
  };

  // Don't render if no products and not loading
  if (!isLoading && productsData.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-6 rounded-full"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
            }}
          />
          <h2 className="text-lg font-bold text-gray-800">{sectionName}</h2>
        </div>
        {categoryName && (
          <button
            onClick={() => navigate(`/category/${categoryName}`)}
            className="flex items-center gap-0.5 text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors cursor-pointer"
          >
            Xem tất cả
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
      
      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {productsData.slice(0, 10).map((item, index) => (
            <div key={item.id || index}>
              <HomeSectionCard product={mapProductData(item)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeSectionCarousel