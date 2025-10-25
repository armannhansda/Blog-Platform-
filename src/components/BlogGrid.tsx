"use client";

import { useState, useEffect } from "react";
import FilterTabs from "./FilterTabs";
import BlogCard, { BlogCardProps } from "./BlogCard";

export interface BlogGridProps {
  title: string;
  description: string;
  posts: BlogCardProps[];
  categories?: string[];
  sortOptions?: { label: string; value: string }[];
  showLoadMore?: boolean;
  currentPage?: number;
  totalPages?: number;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
}

export default function BlogGrid({
  title,
  description,
  posts,
  categories = ["All", "Destination", "Culinary", "Lifestyle", "Tips & Hacks"],
  sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Popular", value: "popular" },
  ],
  showLoadMore = true,
  currentPage = 1,
  totalPages = 1,
  onNextPage,
  onPreviousPage,
}: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(isLoggedIn);
  }, []);

  // Debug pagination
  useEffect(() => {
    console.log(
      "BlogGrid - currentPage:",
      currentPage,
      "totalPages:",
      totalPages,
      "posts count:",
      posts.length
    );
  }, [currentPage, totalPages, posts.length]);

  // Apply category filter to current page posts
  const displayedPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  // Debug logging
  useEffect(() => {
    console.log("BlogGrid - Posts:", posts.length);
    console.log("BlogGrid - Displayed posts:", displayedPosts.length);
    console.log("BlogGrid - Current page:", currentPage);
    console.log("BlogGrid - Total pages:", totalPages);
  }, [posts, displayedPosts, currentPage, totalPages]);

  return (
    <section className="container mx-auto px-3 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
        {/* Filter tabs */}
        <FilterTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <a
          href={isAuthenticated ? "/create-post" : "/login"}
          aria-label="Create Post"
          className="mt-2 md:mt-0 md:self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-semibold text-sm transition shrink-0"
          style={{
            borderColor: "#3D74B6",
            color: "#3D74B6",
            backgroundColor: "transparent",
          }}
          title={
            isAuthenticated ? "Create a new post" : "Sign in to create posts"
          }
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "#3D74B6";
            (e.target as HTMLElement).style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "transparent";
            (e.target as HTMLElement).style.color = "#3D74B6";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
          </svg>
          Create Post
        </a>
      </div>

      {/* Blog cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPosts.length > 0 ? (
          displayedPosts.map((post) => <BlogCard key={post.id} {...post} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg" style={{ color: "#5A6B78" }}>
              No posts found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Load more button */}
      {showLoadMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => {}}
            className="px-8 py-3 rounded-lg border-2 font-bold transition"
            style={{
              borderColor: "#3D74B6",
              color: "#3D74B6",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#3D74B6";
              (e.target as HTMLElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "transparent";
              (e.target as HTMLElement).style.color = "#3D74B6";
            }}
          >
            Load More Articles
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          {/* Previous Button */}
          <button
            onClick={() => {
              onPreviousPage?.();
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 font-semibold transition text-sm"
            style={{
              color: currentPage === 1 ? "#D1D5DB" : "#5A6B78",
              backgroundColor: "transparent",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            ← PREV
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                // Direct page navigation
                if (page > currentPage) {
                  for (let i = currentPage; i < page; i++) {
                    onNextPage?.();
                  }
                } else if (page < currentPage) {
                  for (let i = currentPage; i > page; i--) {
                    onPreviousPage?.();
                  }
                }
              }}
              className="w-10 h-10 rounded-full font-bold transition flex items-center justify-center text-sm"
              style={{
                backgroundColor: page === currentPage ? "#1F3A51" : "#FFFFFF",
                color: page === currentPage ? "#FFFFFF" : "#5A6B78",
                border: page === currentPage ? "none" : "1px solid #D1D5DB",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (page !== currentPage) {
                  (e.target as HTMLElement).style.backgroundColor = "#F0F4F8";
                }
              }}
              onMouseLeave={(e) => {
                if (page !== currentPage) {
                  (e.target as HTMLElement).style.backgroundColor = "#FFFFFF";
                }
              }}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => {
              onNextPage?.();
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 font-semibold transition text-sm"
            style={{
              color: currentPage === totalPages ? "#D1D5DB" : "#5A6B78",
              backgroundColor: "transparent",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            NEXT →
          </button>
        </div>
      )}
    </section>
  );
}
