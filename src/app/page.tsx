"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BlogGrid from "@/components/BlogGrid";
import type { BlogCardProps } from "@/components/BlogCard";
import { trpc } from "@/lib/trpc/client";

export default function Home() {
  const [filteredPosts, setFilteredPosts] = useState<BlogCardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Fetch all posts using tRPC
  const postsQuery = trpc.posts.list.useQuery();

  // Transform tRPC posts to BlogCardProps format
  useEffect(() => {
    if (postsQuery.data) {
      const transformedPosts: BlogCardProps[] = postsQuery.data.map(
        (post: any) =>
          ({
            id: post.id.toString(),
            title: post.title,
            excerpt: post.excerpt || "",
            image: post.coverImage || "",
            author: post.author?.name || "Anonymous",
            category:
              post.categories?.[0]?.name ||
              post.categories?.[0]?.category?.name ||
              "Uncategorized",
            slug: post.slug,
            date: new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            readTime: Math.ceil(
              (post.content?.split(" ").length || 0) / 200
            ).toString(),
            href: `/blog/${post.slug}`,
          } as BlogCardProps)
      );

      // Filter posts based on search query
      const query = searchQuery.toLowerCase();
      const filtered =
        searchQuery.trim() === ""
          ? transformedPosts
          : transformedPosts.filter((post) => {
              return (
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.author.toLowerCase().includes(query) ||
                post.category.toLowerCase().includes(query)
              );
            });

      setFilteredPosts(filtered);
      setCurrentPage(1);
    }
  }, [postsQuery.data, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Transform posts for HeroSection
  const allBlogPosts = postsQuery.data
    ? postsQuery.data.map(
        (post: any) =>
          ({
            id: post.id.toString(),
            title: post.title,
            excerpt: post.excerpt || "",
            image: post.coverImage || "",
            author: post.author?.name || "Anonymous",
            category:
              post.categories?.[0]?.name ||
              post.categories?.[0]?.category?.name ||
              "Uncategorized",
            slug: post.slug,
            date: new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            readTime: Math.ceil(
              (post.content?.split(" ").length || 0) / 200
            ).toString(),
            href: `/blog/${post.slug}`,
          } as BlogCardProps)
      )
    : [];

  return (
    <main
      className="min-h-screen transition-colors"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="relative">
        <HeroSection
          posts={allBlogPosts}
          autoSlide={true}
          slideInterval={5000}
        />
      </div>
      <div className="container mx-auto px-6">
        <BlogGrid
          title={searchQuery.trim() !== "" ? "Search Results" : "Blog"}
          description={
            searchQuery.trim() !== ""
              ? `Found ${filteredPosts.length} result${
                  filteredPosts.length !== 1 ? "s" : ""
                } for "${searchQuery}"`
              : "Here, we share travel tips, destination guides, and stories that inspire your next adventure."
          }
          posts={paginatedPosts}
          showLoadMore={false}
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      </div>
    </main>
  );
}
