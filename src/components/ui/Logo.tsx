import React from 'react';

export const Logo = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 1024 1024" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M221.3 543.1C221.3 400.1 336.9 284.5 480 284.5C623.1 284.5 738.7 400.1 738.7 543.1V714.7H221.3V543.1Z" 
        fill="currentColor" 
      />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M221.3 714.7H738.7V543.1C738.7 400.1 623.1 284.5 480 284.5C336.9 284.5 221.3 400.1 221.3 543.1V714.7ZM141.3 543.1C141.3 356.1 292.9 204.5 480 204.5C667.1 204.5 818.7 356.1 818.7 543.1V794.7H141.3V543.1Z" 
        fill="currentColor" 
      />
    </svg>
  );
};
