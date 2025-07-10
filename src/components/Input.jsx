import React from 'react';

const Input = ({ 
  name, 
  type = 'text', 
  placeholder, 
  register, 
  required, 
  minLength, 
  validate, 
  error 
}) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full p-3 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...register(name, { required, minLength, validate })}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default Input;