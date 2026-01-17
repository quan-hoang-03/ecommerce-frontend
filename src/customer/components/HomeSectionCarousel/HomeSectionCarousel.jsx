import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AliceCarousel from "react-alice-carousel";
import HomeSectionCard from '../HomeSectionCard/HomeSectionCard';
import "./style.css"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { findProductsByCategoryName } from '../../State/Products/Action';


const HomeSectionCarousel = ({ data, sectionName, categoryName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const dispatch = useDispatch();
  
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
  
  const responsive = {
    0: { items: 1 },
    568: { items: 3 },
    1024: { items: 5.5 },
  };

  const slidePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.slidePrev();
    }
  };

  const slideNext = () => {
    if (carouselRef.current) {
      carouselRef.current.slideNext();
    }
  };

  const syncActiveIndex = ({ item }) => {
    setActiveIndex(item);
  };

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

  const items = productsData
    .slice(0, 10)
    .map((item, index) => (
      <div key={item.id || index} className="px-2 py-3">
        <HomeSectionCard product={mapProductData(item)} />
      </div>
    ));
  
  // Tính toán số items hiển thị dựa trên responsive
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 5.5;
      if (window.innerWidth >= 568) return 3;
      return 1;
    }
    return 5.5;
  };

  const itemsToShow = getItemsToShow();
  const maxIndex = Math.max(0, items.length - Math.ceil(itemsToShow));
  const canSlideNext = activeIndex < maxIndex;
  const canSlidePrev = activeIndex > 0;

  // Don't render if no products and not loading
  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <div className="mb-16 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div 
            className="w-1.5 h-10 rounded-full"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          />
          <div>
            <h2 
              className='text-2xl font-bold'
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {sectionName}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">Khám phá sản phẩm nổi bật</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            className="hidden md:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <div className="flex gap-2">
            <button
              onClick={slidePrev}
              disabled={!canSlidePrev}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                canSlidePrev 
                  ? 'bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 shadow-lg hover:shadow-xl border border-gray-100' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
              }`}
              aria-label="previous"
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: 24 }} />
            </button>
            <button
              onClick={slideNext}
              disabled={!canSlideNext}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                canSlideNext 
                  ? 'bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 shadow-lg hover:shadow-xl border border-gray-100' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
              }`}
              aria-label="next"
            >
              <KeyboardArrowLeftIcon sx={{ transform: "rotate(180deg)", fontSize: 24 }} />
            </button>
          </div>
        </div>
      </div>
      {/* Carousel Container */}
      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-[20rem]">
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin"
              />
              <span className="text-sm text-gray-400">Đang tải sản phẩm...</span>
            </div>
          </div>
        ) : (
          <AliceCarousel
            ref={carouselRef}
            items={items}
            disableButtonsControls
            responsive={responsive}
            disableDotsControls
            onSlideChange={syncActiveIndex}
            activeIndex={activeIndex}
            mouseTracking
            animationDuration={600}
            controlsStrategy="responsive"
            paddingLeft={0}
            paddingRight={0}
          />
        )}
      </div>
    </div>
  );
};

export default HomeSectionCarousel