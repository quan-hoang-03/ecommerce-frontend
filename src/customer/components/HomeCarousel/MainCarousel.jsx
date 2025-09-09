import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { mainCarouselData } from "./MainCarouselData";

const MainCarousel = () => {
  const items = mainCarouselData.map((item, index) => (
    <img
      key={index}
      className="cursor-pointer -z-10"
      role="presentation"
      src={item.image}
      alt={item.alt}
    />
  ));

  return (
        <div>
          <AliceCarousel
            items={items}
            disableButtonsControls
            autoPlay
            autoPlayInterval={1000}
            infinite
          />
          ;
        </div>
      ); 
};

export default MainCarousel;
