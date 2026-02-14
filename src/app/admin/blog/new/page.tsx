'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminBlogNewPage() {
  useEffect(() => {
    // Generate a new ID and redirect to edit page
    const newId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
    redirect(`/admin/blog/edit/${newId}`);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="text-slate-600 mt-4">Creating new blog post...</p>
      </div>
    </div>
  );
}
