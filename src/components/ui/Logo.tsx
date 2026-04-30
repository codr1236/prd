import React from 'react';

import logoImg from '../../assets/logo.png';

export const Logo = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
  return (
    <img 
      src={logoImg} 
      alt="PromptOrb Logo" 
      width={size} 
      height={size}
      className={className}
      style={{ 
        filter: className.includes('text-zinc-950') ? 'none' : 'invert(1)',
        objectFit: 'contain'
      }}
    />
  );
};
