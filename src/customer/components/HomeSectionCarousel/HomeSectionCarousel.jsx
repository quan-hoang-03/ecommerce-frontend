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
      <HomeSectionCard key={item.id || index} product={mapProductData(item)} />
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
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className='text-3xl font-bold text-gray-900'>{sectionName}</h2>
        <div className="flex gap-2">
          <button
            onClick={slidePrev}
            disabled={!canSlidePrev}
            className={`p-2 rounded-full transition-all duration-200 ${
              canSlidePrev 
                ? 'bg-white hover:bg-gray-100 text-gray-700 shadow-md hover:shadow-lg' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="previous"
          >
            <KeyboardArrowLeftIcon />
          </button>
          <button
            onClick={slideNext}
            disabled={!canSlideNext}
            className={`p-2 rounded-full transition-all duration-200 ${
              canSlideNext 
                ? 'bg-white hover:bg-gray-100 text-gray-700 shadow-md hover:shadow-lg' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="next"
          >
            <KeyboardArrowLeftIcon sx={{ transform: "rotate(180deg)" }} />
          </button>
        </div>
      </div>
      <div className="relative px-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-[15rem]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
            animationDuration={800}
            controlsStrategy="responsive"
          />
        )}
      </div>
    </div>
  );
};

export default HomeSectionCarousel