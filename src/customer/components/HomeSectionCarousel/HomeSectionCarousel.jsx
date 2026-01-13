import React, { useState } from 'react'
import AliceCarousel from "react-alice-carousel";
import HomeSectionCard from '../HomeSectionCard/HomeSectionCard';
import "./style.css"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";


const HomeSectionCarousel = ({ data, sectionName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const responsive = {
    0: { items: 1 },
    568: { items: 3 },
    1024: { items: 5.5 },
  };

  const slidePrev = () => {
    setActiveIndex(activeIndex - 1);
  };

  const slideNext = () => {
    setActiveIndex(activeIndex + 1);
  };

  const syncActiveIndex = ({ item }) => {
    setActiveIndex(item);
  };

  const items = data
    .slice(0, 10)
    .map((item, index) => <HomeSectionCard key={item.id || index} product={item} />);
  
  // Kiểm tra có thể slide tiếp không (giả sử hiển thị tối đa 5 items)
  const maxVisibleItems = 5;
  const canSlideNext = activeIndex < items.length - maxVisibleItems;
  const canSlidePrev = activeIndex > 0;

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
        <AliceCarousel
          items={items}
          disableButtonsControls
          responsive={responsive}
          disableDotsControls
          onSlideChange={syncActiveIndex}
          activeIndex={activeIndex}
          mouseTracking
          animationDuration={800}
        />
      </div>
    </div>
  );
};

export default HomeSectionCarousel