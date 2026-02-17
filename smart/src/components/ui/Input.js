'use client';

import { useState } from 'react';

const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onFocus,
  disabled = false,
  error = null,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles =
    'w-full px-4 py-2 rounded-lg border-2 transition-colors duration-200 focus:outline-none';

  const borderStyles = error
    ? 'border-red-500 focus:border-red-600'
    : isFocused
      ? 'border-blue-500'
      : 'border-gray-300 dark:border-gray-600';

  const bgStyles =
    'bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400';

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div className={className}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`${baseStyles} ${borderStyles} ${bgStyles} ${disabledStyles}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
