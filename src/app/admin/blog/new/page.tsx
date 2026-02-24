'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminBlogNewPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/blog/edit/new');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="text-slate-600 mt-4">Creating new blog post...</p>
      </div>
    </div>
  );
}
