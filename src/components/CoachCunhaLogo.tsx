import React from 'react';
import { useLogo } from '../context/LogoContext';

interface CoachCunhaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showText?: boolean;
}

export const CoachCunhaLogo: React.FC<CoachCunhaLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const { logoUrl } = useLogo();

  // Size mapping with optimized ratios
  const sizeClasses = {
    xs: 'w-7 h-10',
    sm: 'w-10 h-14',
    md: 'w-16 h-24',
    lg: 'w-24 h-36',
    xl: 'w-36 h-52',
    hero: 'w-56 h-80 sm:w-64 sm:h-96',
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className={`relative ${sizeClasses[size]} transition-transform duration-300 hover:scale-105 drop-shadow-2xl flex items-center justify-center`}>
        <img
          src={logoUrl}
          alt="Coach Cunha Project - Logo Oficial"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(245,158,11,0.3)] transition-all duration-300"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="mt-3 text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 block">
            Official System
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Coach Cunha <span className="text-amber-500">Project</span>
          </h1>
        </div>
      )}
    </div>
  );
};
