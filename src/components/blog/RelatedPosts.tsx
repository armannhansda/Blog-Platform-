"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  createdAt?: Date | null;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface RelatedPostsProps {
  currentPostId: string;
  posts: Post[];
  title?: string;
  limit?: number;
  showExcerpt?: boolean;
}

export function RelatedPosts({
  currentPostId,
  posts,
  title = "Related Posts",
  limit = 3,
  showExcerpt = false,
}: RelatedPostsProps) {
  // Filter out the current post and limit the number of posts
  const filteredPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, limit);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border-t-2 border-blue-500 dark:border-blue-600"
          >
            <h3 className="font-semibold mb-2 line-clamp-2">
              <Link
                href={`/blog/posts/${post.slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {post.title}
              </Link>
            </h3>

            {post.createdAt && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            )}

            {showExcerpt && post.excerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {post.excerpt}
              </p>
            )}

            <Link
              href={`/blog/posts/${post.slug}`}
              className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
            >
              Read more
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
