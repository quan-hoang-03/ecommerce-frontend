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
    0: { items: 2 },
    480: { items: 2.5 },
    640: { items: 3 },
    768: { items: 4 },
    1024: { items: 5 },
    1280: { items: 5 },
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
      <div key={item.id || index} className="px-1.5 py-1">
        <HomeSectionCard product={mapProductData(item)} />
      </div>
    ));
  
  // Tính toán số items hiển thị dựa trên responsive
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 5;
      if (window.innerWidth >= 768) return 4;
      if (window.innerWidth >= 640) return 3;
      if (window.innerWidth >= 480) return 2.5;
      return 2;
    }
    return 5;
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
    <div className="mb-10 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div 
            className="w-1 h-6 rounded-full"
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}
          />
          <h2 className='text-lg font-bold text-gray-800'>
            {sectionName}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="#" 
            className="hidden sm:flex items-center gap-0.5 text-xs font-medium text-pink-500 hover:text-pink-600 transition-colors"
          >
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <div className="flex gap-1">
            <button
              onClick={slidePrev}
              disabled={!canSlidePrev}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                canSlidePrev 
                  ? 'bg-white hover:bg-pink-50 text-gray-600 hover:text-pink-500 shadow border border-gray-100' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="previous"
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: 20 }} />
            </button>
            <button
              onClick={slideNext}
              disabled={!canSlideNext}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                canSlideNext 
                  ? 'bg-white hover:bg-pink-50 text-gray-600 hover:text-pink-500 shadow border border-gray-100' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="next"
            >
              <KeyboardArrowLeftIcon sx={{ transform: "rotate(180deg)", fontSize: 20 }} />
            </button>
          </div>
        </div>
      </div>
      {/* Carousel Container */}
      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-pink-500 rounded-full animate-spin" />
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
            animationDuration={400}
            controlsStrategy="responsive"
            paddingLeft={0}
            paddingRight={0}
            itemsFit="contain"
          />
        )}
      </div>
    </div>
  );
};

export default HomeSectionCarousel