import React from 'react';

export default function SignInputsEm({ type, name, onChange, placeholder, value }) {
    return (
        <div className="relative flex justify-center w-full">
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="flex border-2 border-black text-center w-[80%] h-10 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder=" " 
            />
            {!value && (
                <label className="absolute top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none">
                    {placeholder}
                </label>
            )}
        </div>
    );
}
