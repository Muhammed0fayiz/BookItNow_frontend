import React from 'react';
import { clsx } from 'clsx'; // For conditional class handling, optional

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'; // Variants for styling
  isLoading?: boolean; // Optional loading state
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className,
  ...props
}) => {
  // Define styles for button variants
  const baseStyles = 'px-4 py-2 font-semibold text-sm rounded focus:outline-none';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        isLoading && 'opacity-50 cursor-not-allowed',
        className // Allow additional classes
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
