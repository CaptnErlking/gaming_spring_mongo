import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  hover = true,
}) => {
  const baseClasses = 'bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-lg transition-all duration-300';
  const glowClasses = glow ? 'card-glow' : '';
  const hoverClasses = hover ? 'hover:shadow-xl' : '';

  return (
    <div className={`${baseClasses} ${glowClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
