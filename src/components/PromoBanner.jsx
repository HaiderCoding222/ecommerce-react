import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../styles.css';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(24, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsVisible(false);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="absolute top-2 right-2 sm:top-3 sm:right-4">
          <button
            onClick={() => setIsVisible(false)}
            className="text-white p-2 rounded-full hover:bg-gray-200/20"
          >
            <FiX className="text-lg sm:text-2xl" />
          </button>
        </div>
        <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-0 text-center sm:text-left">
          Flash Sale! Up to 50% Off!
        </h3>
        <div className="flex gap-2 sm:gap-4 text-sm sm:text-base">
          <span className="bg-white text-indigo-600 px-2 sm:px-3 py-1 rounded-lg">
            {timeLeft.days} Days
          </span>
          <span className="bg-white text-indigo-600 px-2 sm:px-3 py-1 rounded-lg">
            {timeLeft.hours} Hours
          </span>
          <span className="bg-white text-indigo-600 px-2 sm:px-3 py-1 rounded-lg">
            {timeLeft.minutes} Minutes
          </span>
          <span className="bg-white text-indigo-600 px-2 sm:px-3 py-1 rounded-lg">
            {timeLeft.seconds} Seconds
          </span>
        </div>
        <Link
          to="/category/all"
          className="mt-2 sm:mt-0 bg-white text-indigo-600 px-4 sm:px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default PromoBanner;