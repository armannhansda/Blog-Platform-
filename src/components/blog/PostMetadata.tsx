"use client";

import {
  Calendar,
  Clock,
  User,
  Tag,
  BookmarkCheck,
  Bookmark,
} from "lucide-react";
import Link from "next/link";

interface PostMetadataProps {
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  authorId?: string | null;
  published?: boolean;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  className?: string;
  showUpdated?: boolean;
  showAuthor?: boolean;
  showStatus?: boolean;
  showCategories?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PostMetadata({
  publishedAt,
  updatedAt,
  authorId,
  published = true,
  categories = [],
  className = "",
  showUpdated = true,
  showAuthor = true,
  showStatus = true,
  showCategories = true,
  size = "md",
}: PostMetadataProps) {
  // Format dates
  const formattedPublishedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";

  const formattedUpdatedDate =
    updatedAt && showUpdated && updatedAt !== publishedAt
      ? new Date(updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  // Get icon and text sizes based on the size prop
  const iconSize =
    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const textSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${textSize} text-gray-600 dark:text-gray-400 ${className}`}
    >
      {/* Published date */}
      <div className="flex items-center">
        <Calendar className={`${iconSize} mr-1`} />
        {formattedPublishedDate}
      </div>

      {/* Updated date */}
      {formattedUpdatedDate && (
        <div className="flex items-center">
          <Clock className={`${iconSize} mr-1`} />
          Updated: {formattedUpdatedDate}
        </div>
      )}

      {/* Author */}
      {authorId && showAuthor && (
        <div className="flex items-center">
          <User className={`${iconSize} mr-1`} />
          Author ID: {authorId}
        </div>
      )}

      {/* Published status */}
      {showStatus && (
        <div className="flex items-center">
          {published ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <BookmarkCheck className="h-3 w-3 mr-1" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <Bookmark className="h-3 w-3 mr-1" />
              Draft
            </span>
          )}
        </div>
      )}

      {/* Categories */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <Tag className={`${iconSize} text-gray-500 dark:text-gray-400`} />
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="inline-block text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
