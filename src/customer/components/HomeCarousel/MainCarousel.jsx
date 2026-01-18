import React, { useState, useEffect } from "react";
import { mainCarouselData, sideBanners } from "./MainCarouselData";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const MainCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mainCarouselData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? mainCarouselData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mainCarouselData.length);
  };

  return (
    <div className="w-full bg-gradient-to-b from-purple-50 to-pink-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          {/* Main Slider - Left Side */}
          <div className="flex-1 lg:flex-[2] relative">
            <div className="relative w-full h-[456px] rounded-xl overflow-hidden shadow-lg">
              {/* Slides */}
              {mainCarouselData.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                aria-label="Previous slide"
              >
                <ArrowBackIosIcon style={{ fontSize: 18, marginLeft: 4 }} />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                aria-label="Next slide"
              >
                <ArrowForwardIosIcon style={{ fontSize: 18 }} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {mainCarouselData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 ${
                      index === currentIndex
                        ? "w-6 h-2 bg-purple-600 rounded"
                        : "w-2 h-2 bg-white/60 rounded-full hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Banners - Right Side (hidden on mobile) */}
          <div className="hidden lg:flex flex-col gap-4 w-80">
            {sideBanners && sideBanners.length >= 2 ? (
              <>
                <div className="flex-1 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <img
                    src={sideBanners[0].image}
                    alt={sideBanners[0].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <img
                    src={sideBanners[1].image}
                    alt={sideBanners[1].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <img
                    src={
                      mainCarouselData[1]?.image || mainCarouselData[0]?.image
                    }
                    alt="Banner 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <img
                    src={
                      mainCarouselData[2]?.image || mainCarouselData[0]?.image
                    }
                    alt="Banner 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default MainCarousel;
