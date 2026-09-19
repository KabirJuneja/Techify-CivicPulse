import React from 'react';
import officialLogo from '../assets/images/nagarx_official_logo_1789765663884.jpg';

interface NagarXLogoProps {
  variant?: 'icon' | 'full' | 'imageOnly';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
}

export const NagarXLogo: React.FC<NagarXLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showText = true,
  showTagline = true,
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', text: 'text-sm', tagline: 'text-[8px]' },
    md: { img: 'w-10 h-10', text: 'text-base sm:text-lg', tagline: 'text-[9px]' },
    lg: { img: 'w-12 h-12', text: 'text-xl sm:text-2xl', tagline: 'text-[10px]' },
    xl: { img: 'w-16 h-16', text: 'text-2xl sm:text-3xl', tagline: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  if (variant === 'imageOnly') {
    return (
      <img
        src={officialLogo}
        alt="NAGAR-X Official Logo"
        referrerPolicy="no-referrer"
        className={`object-contain rounded-xl ${className}`}
      />
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-slate-200/90 shadow-sm shrink-0 bg-white p-0.5 ${currentSize.img} ${className}`}>
        <img
          src={officialLogo}
          alt="NAGAR-X Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Official Symbol Container */}
      <div className={`relative overflow-hidden rounded-xl border border-slate-200/90 shadow-sm shrink-0 bg-white p-0.5 ${currentSize.img}`}>
        <img
          src={officialLogo}
          alt="NAGAR-X Symbol"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Brand Text Block */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center space-x-1.5">
            <span className={`font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase ${currentSize.text}`}>
              nagar-x
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-[9px] font-extrabold text-blue-700 uppercase tracking-wider border border-blue-100">
              Civic Portal
            </span>
          </div>
          {showTagline && (
            <span className={`font-bold text-slate-500 uppercase tracking-wider mt-1 ${currentSize.tagline}`}>
              Smart Cities. Stronger Communities.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default NagarXLogo;
