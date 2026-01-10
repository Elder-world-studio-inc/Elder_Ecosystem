import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard = ({ children, className = '', onClick }: GlassCardProps) => (
  <div 
    onClick={onClick}
    className={`glass-panel rounded-xl p-6 ${className}`}
  >
    {children}
  </div>
);
