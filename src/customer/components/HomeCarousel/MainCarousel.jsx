import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { mainCarouselData } from "./MainCarouselData";

const MainCarousel = () => {
  const items = mainCarouselData.map((item, index) => (
    <div key={index} className="w-full h-[500px] md:h-[600px] lg:h-[700px] relative">
      <img
        className="cursor-pointer w-full h-full object-cover"
        role="presentation"
        src={item.image}
        alt={item.alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  ));

  return (
    <div className="relative w-full overflow-hidden">
      <AliceCarousel
        items={items}
        disableButtonsControls
        autoPlay
        autoPlayInterval={4000}
        infinite
        mouseTracking
        animationDuration={1000}
        disableDotsControls={false}
      />
    </div>
  ); 
};

export default MainCarousel;
