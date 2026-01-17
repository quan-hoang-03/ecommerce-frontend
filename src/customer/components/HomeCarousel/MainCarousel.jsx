import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { mainCarouselData } from "./MainCarouselData";

const MainCarousel = () => {
  const items = mainCarouselData.map((item, index) => (
    <div key={index} className="w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] relative">
      <img
        className="cursor-pointer w-full h-full object-cover"
        role="presentation"
        src={item.image}
        alt={item.alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  ));

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl shadow-lg">
      <AliceCarousel
        items={items}
        disableButtonsControls
        autoPlay
        autoPlayInterval={4000}
        infinite
        mouseTracking
        animationDuration={800}
        disableDotsControls={false}
      />
    </div>
  ); 
};

export default MainCarousel;
