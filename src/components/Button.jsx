import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', size = 'md', disabled = false, onClick, className = '' }) => {
  const baseStyles = 'rounded-full transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 hover:animate-pulse';
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-500',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };
  const sizes = {
    sm: 'px-3 py-2 text-sm min-w-[44px] min-h-[44px]',
    md: 'px-4 py-3 text-base min-w-[48px] min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-w-[52px] min-h-[52px]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;