import React from 'react'
import AliceCarousel from 'react-alice-carousel';
import { mainCarouselData } from '../HomeCarousel/MainCarouselData';

const HomeSectionCarousel = () => {
    const responsive = {
      0: { items: 1 },
      568: { items: 2 },
      1024: { items: 3 },
    };

  const items = mainCarouselData.map((item, index) => (
      <img
        key={index}
        className="cursor-pointer"
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
          responsive={responsive}
        />
        ;
      </div>
    ); 
}

export default HomeSectionCarousel