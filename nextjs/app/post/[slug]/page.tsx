'use client';

import { PostDetail } from '@/app/components/PostDetail';
import { Navigation } from '@/app/components/Navigation';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <PostDetail slug={slug} />
      </div>
    </>
  );
}