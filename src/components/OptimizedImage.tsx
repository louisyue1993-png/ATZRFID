'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (fill) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        {isLoading && !priority && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={cn(
            'transition-opacity duration-500',
            isLoading && !priority ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <span className="text-slate-400 text-sm">Image not available</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && !priority && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width || 400}
        height={height || 400}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={cn(
          'transition-opacity duration-500',
          isLoading && !priority ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <span className="text-slate-400 text-sm">Image not available</span>
        </div>
      )}
    </div>
  );
}
