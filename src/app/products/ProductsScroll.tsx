'use client';

import { useEffect, useRef } from 'react';

interface ProductsScrollProps {
  shouldScroll: boolean;
}

export default function ProductsScroll({ shouldScroll }: ProductsScrollProps) {
  const scrolledRef = useRef(false);

  useEffect(() => {
    // Only scroll once and only if category/subcategory is selected
    if (shouldScroll && !scrolledRef.current) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const targetElement = document.getElementById('products-section');
        if (targetElement) {
          console.log('Scrolling to products-section');
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          scrolledRef.current = true;
        } else {
          console.log('products-section not found');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [shouldScroll]);

  return null;
}
