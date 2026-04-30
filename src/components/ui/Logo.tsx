import React from 'react';

export const Logo = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M20 75C20 45 40 25 70 25C90 25 90 45 90 75H20ZM30 65C30 50 40 38 55 38C65 38 72 45 72 65H30Z" 
        fill="currentColor" 
      />
    </svg>
  );
};
