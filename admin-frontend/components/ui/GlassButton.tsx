import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success';
}

export const GlassButton = ({ children, className = '', variant = 'primary', ...props }: GlassButtonProps) => {
  let variantStyles = '';
  
  if (variant === 'danger') {
    variantStyles = 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-100';
  } else if (variant === 'success') {
    variantStyles = 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-100';
  } else {
    // Default primary glass
    variantStyles = 'glass-button';
  }

  // If specific variant classes are passed, we might need to handle merging carefully, 
  // but for now, if it's not primary, we override the base glass-button class partially.
  // Actually, let's keep it simple: if custom variant, use that, else use base.
  
  const baseClass = variant === 'primary' ? 'glass-button' : `backdrop-blur-md border transition-all duration-300 shadow-lg active:scale-95 rounded-lg ${variantStyles}`;

  return (
    <button 
      className={`${baseClass} px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
