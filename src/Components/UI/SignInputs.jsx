import React from 'react';

export default function SignInputs({ type, name, value, onChange, placeholder, className = "" }) {
  return (
    <div className="relative flex flex-col items-center w-full">
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`border-2 border-black text-center w-full h-12 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent ${className}`} 
        placeholder=" " 
      />
      {!value && (
        <label className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 pointer-events-none">
          {placeholder}
        </label>
      )}
    </div>  
  );
}
