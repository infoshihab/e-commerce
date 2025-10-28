import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const Banner = () => {
  const { siteContent, siteLoading } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = siteContent?.banners || [];

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (siteLoading || banners.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        Loading banners...
      </div>
    );
  }

  return (
    <div className="relative w-full  overflow-hidden">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${banners.length * 100}%`,
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-full" // full width and height for the banner
          >
            <img
              src={banner.url}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover" // object-cover ensures the image covers the area while preserving the aspect ratio
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentIndex ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
