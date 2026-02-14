'use client';

import { useEffect, useState } from 'react';
import ContactButtons from './ContactButtons';

export default function ContactButtonsWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <ContactButtons position="fixed" size="md" />;
}
