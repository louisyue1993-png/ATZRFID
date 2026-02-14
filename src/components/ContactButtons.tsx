'use client';

import { MessageCircle, Mail } from 'lucide-react';

interface ContactButtonsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'fixed' | 'inline';
}

export default function ContactButtons({
  className = '',
  size = 'md',
  position = 'fixed',
}: ContactButtonsProps) {
  const whatsappNumber = '8617688964979';
  const email = 'info@atzrfid.com';

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-16 w-16',
  };

  const iconSizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };

  if (position === 'fixed') {
    return (
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 ${className}`}
      >
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className={iconSizeClasses[size]} />
        </a>

        {/* Email Button */}
        <a
          href={`mailto:${email}`}
          className={`${sizeClasses[size]} bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110`}
          aria-label="Send us an email"
        >
          <Mail className={iconSizeClasses[size]} />
        </a>
      </div>
    );
  }

  // Inline position (for use in headers, footers, etc.)
  return (
    <div className={`flex gap-3 ${className}`}>
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">WhatsApp</span>
      </a>

      {/* Email Button */}
      <a
        href={`mailto:${email}`}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        aria-label="Send us an email"
      >
        <Mail className="h-5 w-5" />
        <span className="font-medium">Email</span>
      </a>
    </div>
  );
}
