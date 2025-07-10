import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import '../styles.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition-all duration-300 animate-fade-in"
      aria-label="Back to top"
    >
      <FiArrowUp className="text-xl" />
    </button>
  );
};

export default BackToTop;