"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  Loader,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";

interface PostDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  coverImage?: string;
  authorId?: number;
  author?: {
    id: number;
    name: string;
    email: string;
    profileImage?: string;
  } | null;
  categories?: {
    id?: number;
    category?: {
      id: number;
      name: string;
      slug: string;
    };
    name?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [relatedPosts, setRelatedPosts] = useState<PostDetail[]>([]);
  const [isRelated, setIsRelated] = useState(true);

  // Fetch post using tRPC
  const postQuery = trpc.posts.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  // Fetch all posts for related posts
  const allPostsQuery = trpc.posts.list.useQuery();

  // Find related posts
  useEffect(() => {
    if (postQuery.data && allPostsQuery.data) {
      const post = postQuery.data;
      const allPosts = allPostsQuery.data as any[];

      // Filter related posts by category and exclude current post
      const related = allPosts
        .filter((p: any) => p.slug !== slug)
        .filter((p: any) => {
          // Check if post shares any category
          const currentCategories =
            post.categories?.map((c: any) => c.id) || [];
          const postCategories = p.categories?.map((c: any) => c.id) || [];
          return currentCategories.some((cat: number) =>
            postCategories.includes(cat)
          );
        })
        .slice(0, 3);

      // If no related posts found, show any 3 other posts
      if (related.length === 0) {
        const anyPosts = allPosts
          .filter((p: any) => p.slug !== slug)
          .slice(0, 3);
        setRelatedPosts(anyPosts);
        setIsRelated(false);
      } else {
        setRelatedPosts(related);
        setIsRelated(true);
      }
    }
  }, [postQuery.data, allPostsQuery.data, slug]);

  if (postQuery.isLoading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p style={{ color: "#6B7280" }}>Loading post...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (postQuery.isError || !postQuery.data) {
    const error = postQuery.isError ? "Failed to load post" : "Post not found";
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium mb-8"
            style={{ color: "#3B82F6" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="max-w-2xl mx-auto py-20">
            <div className="text-center">
              <h1
                className="text-3xl font-bold mb-4"
                style={{ color: "#1F3A51" }}
              >
                {error}
              </h1>
              <p className="mb-6" style={{ color: "#6B7280" }}>
                {error === "Post not found"
                  ? "The blog post you're looking for doesn't exist."
                  : "There was an error loading this post."}
              </p>
              <Link
                href="/"
                className="inline-block text-white font-semibold py-3 px-6 rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: "#3B82F6" }}
              >
                Return to Blog
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const post = postQuery.data;
  const readTime = Math.ceil((post.content.split(" ").length || 0) / 200);
  const publishDate = new Date(post.createdAt || new Date()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <Navbar />

      <article className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto mt-10">
          {/* Header Section */}
          <header className="mb-12">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((pc: any) => (
                  <Link
                    key={pc.id}
                    href={`/categories?slug=${pc.slug}`}
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold transition hover:opacity-80"
                    style={{
                      backgroundColor: "#EFF6FF",
                      color: "#3B82F6",
                    }}
                  >
                    {pc.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="text-4xl md:text-3xl font-bold mb-4 leading-tight"
              style={{ color: "#1F3A51" }}
            >
              {post.title}
            </h1>

            {/* Meta Information */}
            <div
              className="flex flex-wrap gap-4 text-sm"
              style={{ color: "#6B7280" }}
            >
              <span>{post.author?.name || "Anonymous"}</span>
              <span>•</span>
              <span>{publishDate}</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>
          </header>

          {/* Featured Image */}
          <div
            className="mb-10 h-80 rounded-lg overflow-hidden"
            style={{
              backgroundColor: "#F3F4F6",
            }}
          >
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center" style={{ color: "#D1D5DB" }}>
                  <div className="text-6xl mb-2">📖</div>
                  <p className="text-sm">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              className="text-lg font-semibold mb-8 leading-relaxed"
              style={{ color: "#4B5563" }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            style={{ color: "#374151", lineHeight: "1.75" }}
          >
            <div className="whitespace-pre-wrap font-normal">
              {post.content}
            </div>
          </div>

          {/* Author Info Card */}
          <div
            className="rounded-lg p-6 mb-8"
            style={{
              backgroundColor: "#F9FAFB",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: "#3B82F6" }}
              >
                {post.author?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: "#1F3A51" }}>
                  {post.author?.name || "Anonymous"}
                </h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Published on {publishDate}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div
            className="flex gap-4 justify-between pt-8"
            style={{ borderTopColor: "#E5E7EB", borderTopWidth: "1px" }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 font-medium py-2 px-4 rounded transition hover:opacity-70"
              style={{
                color: "#3B82F6",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>

            <button
              onClick={() => {
                const url = `${window.location.origin}/blog/${post.slug}`;
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
              }}
              className="flex items-center gap-2 font-medium py-2 px-4 rounded transition hover:opacity-70"
              style={{
                color: "#3B82F6",
              }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-12" style={{ backgroundColor: "#F9FAFB" }}>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-3xl font-bold mb-8"
                style={{ color: "#1F3A51" }}
              >
                {isRelated ? "Related Posts" : "More Articles"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group rounded-lg overflow-hidden transition hover:shadow-md"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    {/* Post Image */}
                    <div
                      className="w-full h-40 overflow-hidden"
                      style={{ backgroundColor: "#F3F4F6" }}
                    >
                      {relatedPost.coverImage ? (
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span style={{ color: "#D1D5DB" }}>📖</span>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                      {/* Category */}
                      {relatedPost.categories &&
                        relatedPost.categories.length > 0 && (
                          <div
                            className="text-xs font-semibold mb-2"
                            style={{ color: "#3B82F6" }}
                          >
                            {(relatedPost.categories[0] as any)?.name ||
                              (relatedPost.categories[0] as any)?.category
                                ?.name}
                          </div>
                        )}

                      {/* Title */}
                      <h3
                        className="font-semibold mb-2 line-clamp-2 group-hover:opacity-70 transition"
                        style={{ color: "#1F3A51" }}
                      >
                        {relatedPost.title}
                      </h3>

                      {/* Excerpt */}
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: "#6B7280" }}
                      >
                        {relatedPost.excerpt}
                      </p>

                      {/* Author and Read time */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ backgroundColor: "#3B82F6" }}
                          >
                            {relatedPost.author?.name?.[0]?.toUpperCase() ||
                              "A"}
                          </div>
                          <span
                            className="text-xs font-medium"
                            style={{ color: "#374151" }}
                          >
                            {relatedPost.author?.name || "Anonymous"}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1 text-xs"
                          style={{ color: "#9CA3AF" }}
                        >
                          <Clock className="w-3 h-3" />
                          <span>
                            {Math.ceil(
                              (relatedPost.content?.split(" ").length || 0) /
                                200
                            )}{" "}
                            min
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <div className="w-full h-px bg-gray-200"></div>
      <section
        className="py-8"
        style={{
          backgroundColor: "#F9FAFB",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "#1F3A51" }}
            >
              Stay Updated
            </h2>
            <p className="mb-6" style={{ color: "#6B7280" }}>
              Subscribe to get the latest articles in your inbox.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded text-sm focus:outline-none transition"
                style={{
                  borderColor: "#D1D5DB",
                  borderWidth: "1px",
                  color: "#1F3A51",
                }}
              />
              <button
                className="font-medium py-2 px-6 rounded transition hover:opacity-85 text-white text-sm"
                style={{ backgroundColor: "#3B82F6" }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
