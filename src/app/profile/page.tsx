"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  LogOut,
  Heart,
  MessageCircle,
  Share,
  Edit3,
  Trash2,
  MoreHorizontal,
  Settings,
  Lock,
  Eye,
  Download,
  Bell,
} from "lucide-react";
import { api } from "@/lib/trpc/react";
import type { RouterOutputs } from "@/lib/trpc/types";
import type { BlogCardProps } from "@/components/BlogCard";

interface UserPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage?: string | null;
  createdAt: string | Date | null;
  author?: {
    name: string;
    email: string;
  } | null;
  categories: Array<{
    description?: string | null;
    id: number;
    slug: string;
    name: string;
  }>;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  bio?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // tRPC hooks
  const [authorId, setAuthorId] = useState<number | null>(null);
  const postsQuery = api.posts.listByAuthor.useQuery(
    { authorId: authorId! },
    { enabled: authorId !== null }
  );
  const deletePostMutation = api.posts.delete.useMutation();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = localStorage.getItem("user");

    if (!isLoggedIn || !userData) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Set the authorId to fetch posts for this user
      if (parsedUser.id) {
        setAuthorId(parsedUser.id);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Fetch and filter user's posts from tRPC query
  useEffect(() => {
    if (postsQuery.data && user) {
      setPostsLoading(true);
      // The query already filters by authorId, so we can directly use it
      type PostData = RouterOutputs["posts"]["listByAuthor"][number];
      setUserPosts(postsQuery.data as PostData[]);
      setPostsLoading(false);
    }
  }, [postsQuery.data, user]);

  // Update loading state
  useEffect(() => {
    if (postsQuery.isLoading) {
      setPostsLoading(true);
    }
  }, [postsQuery.isLoading]);

  const handleDeletePost = async (postId: number, slug: string) => {
    try {
      setDeleting(postId);
      await deletePostMutation.mutateAsync(postId);

      // Remove post from local state
      setUserPosts((posts) => posts.filter((p) => p.id !== postId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);

    // Clear localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    // Redirect to home
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F3F4F6" }}>
      <Navbar />

      {/* Cover Banner */}
      <div
        className="w-full h-48 relative"
        style={{
          background:
            "linear-gradient(90deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)",
        }}
      ></div>

      {/* Profile Card - Centered */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-20 mb-12">
        <div
          className="rounded-2xl p-8 overflow-hidden"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Top Section: Avatar + Basic Info */}
          <div
            className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6 pb-6"
            style={{ borderBottom: "1px solid #F3F4F6" }}
          >
            {/* Avatar */}
            <div className="shrink-0 relative">
              <div
                className="w-32 h-32 rounded-2xl flex items-center justify-center text-white text-5xl font-bold overflow-hidden border-4 shadow-lg"
                style={{
                  backgroundColor: "#3B82F6",
                  borderColor: "#FFFFFF",
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.2)",
                }}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
                style={{
                  backgroundColor: "#10B981",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                }}
              >
                ✓
              </div>
            </div>

            {/* Name & Quick Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: "#1F3A51" }}
                >
                  {user.name}
                </h1>
                {user.role === "admin" && (
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "#DBEAFE",
                      color: "#3B82F6",
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
                @{user.email?.split("@")[0]}
              </p>
              {user.bio ? (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#5B6B7E" }}
                >
                  {user.bio}
                </p>
              ) : (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#5B6B7E" }}
                >
                  {user.role === "admin"
                    ? "Platform Administrator"
                    : "Blog Author"}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#3B82F6" }}
                >
                  {userPosts.length}
                </div>
                <div
                  style={{ color: "#6B7280" }}
                  className="text-xs font-medium"
                >
                  Posts
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: Contact & Metadata */}
          <div
            className="flex flex-wrap gap-4 mb-6 pb-6"
            style={{ borderBottom: "1px solid #F3F4F6" }}
          >
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" style={{ color: "#3B82F6" }} />
              <a
                href={`mailto:${user.email}`}
                style={{ color: "#374151" }}
                className="hover:text-blue-600 transition"
              >
                {user.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" style={{ color: "#3B82F6" }} />
              <span style={{ color: "#374151" }}>
                Joined{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Recently"}
              </span>
            </div>
          </div>

          {/* Bottom Section: Action Buttons */}
          <div>
            {/* Primary Actions */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Link
                href="/edit-profile"
                className="font-medium py-2 px-4 rounded-lg transition duration-200 text-white text-sm flex items-center gap-2"
                style={{
                  backgroundColor: "#3B82F6",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563EB";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(59, 130, 246, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#3B82F6";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>
              <Link
                href="/create-post"
                className="font-medium py-2 px-4 rounded-lg transition duration-200 text-white text-sm flex items-center gap-2"
                style={{
                  backgroundColor: "#10B981",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#059669";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(16, 185, 129, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#10B981";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                New Post
              </Link>
              <button
                disabled={isLogoutLoading}
                onClick={handleLogout}
                className="py-1.5 px-2 rounded-lg transition duration-200 text-xs font-medium flex items-center justify-center gap-1"
                style={{
                  backgroundColor: "#FEE2E2",
                  color: "#DC2626",
                  border: "1px solid #FECACA",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FCA5A5";
                  e.currentTarget.style.borderColor = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FEE2E2";
                  e.currentTarget.style.borderColor = "#FECACA";
                }}
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>

            {/* Secondary Actions */}
            {/* <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => alert("Privacy settings coming soon")}
                className="py-1.5 px-2 rounded-lg transition duration-200 text-xs font-medium flex items-center justify-center gap-1"
                style={{
                  backgroundColor: "#F3F4F6",
                  color: "#1F3A51",
                  border: "1px solid #E5E7EB",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E5E7EB";
                  e.currentTarget.style.borderColor = "#3B82F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
                title="Privacy settings"
              >
                <Eye className="w-3 h-3" />
                <span>Privacy</span>
              </button>
              <button
                onClick={() => alert("Security settings coming soon")}
                className="py-1.5 px-2 rounded-lg transition duration-200 text-xs font-medium flex items-center justify-center gap-1"
                style={{
                  backgroundColor: "#F3F4F6",
                  color: "#1F3A51",
                  border: "1px solid #E5E7EB",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E5E7EB";
                  e.currentTarget.style.borderColor = "#3B82F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
                title="Security settings"
              >
                <Lock className="w-3 h-3" />
                <span>Security</span>
              </button>
              <button
                onClick={() => alert("Notifications coming soon")}
                className="py-1.5 px-2 rounded-lg transition duration-200 text-xs font-medium flex items-center justify-center gap-1"
                style={{
                  backgroundColor: "#F3F4F6",
                  color: "#1F3A51",
                  border: "1px solid #E5E7EB",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E5E7EB";
                  e.currentTarget.style.borderColor = "#3B82F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
                title="Notifications"
              >
                <Bell className="w-3 h-3" />
                <span>Alerts</span>
              </button>
              <button
                disabled={isLogoutLoading}
                onClick={handleLogout}
                className="py-1.5 px-2 rounded-lg transition duration-200 text-xs font-medium flex items-center justify-center gap-1"
                style={{
                  backgroundColor: "#FEE2E2",
                  color: "#DC2626",
                  border: "1px solid #FECACA",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FCA5A5";
                  e.currentTarget.style.borderColor = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FEE2E2";
                  e.currentTarget.style.borderColor = "#FECACA";
                }}
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        {/* Tabs/Navigation */}
        <div
          className="flex gap-8 mb-6 border-b"
          style={{ borderColor: "#E5E7EB" }}
        >
          <button
            className="font-semibold py-4 pb-3 border-b-2 transition"
            style={{
              color: "#1F3A51",
              borderColor: "#3B82F6",
            }}
          >
            Posts
          </button>
          <button
            className="font-semibold py-4 pb-3 transition"
            style={{
              color: "#6B7280",
              borderColor: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1F3A51")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            About
          </button>
        </div>

        {/* Posts Section */}
        <div>
          {postsLoading ? (
            <div className="py-12 text-center">
              <div
                className="w-8 h-8 rounded-full border-4 border-t-2 animate-spin mx-auto mb-4"
                style={{
                  borderColor: "#E5E7EB",
                  borderTopColor: "#3B82F6",
                }}
              ></div>
              <p style={{ color: "#6B7280" }}>Loading posts...</p>
            </div>
          ) : userPosts.length === 0 ? (
            <div
              className="rounded-lg p-12 text-center"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
              }}
            >
              <p className="mb-4 text-lg" style={{ color: "#6B7280" }}>
                No posts yet
              </p>
              <Link
                href="/create-post"
                className="inline-block font-medium py-2 px-6 rounded-lg text-white transition"
                style={{
                  backgroundColor: "#3B82F6",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563EB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3B82F6")
                }
              >
                Write your first post
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {userPosts.map((post) => (
                <div key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div
                      className="rounded-xl p-6 transition-all duration-300 overflow-hidden"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#3B82F6";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(59, 130, 246, 0.12)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#E5E7EB";
                        e.currentTarget.style.boxShadow =
                          "0 1px 3px rgba(0, 0, 0, 0.05)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div className="flex gap-6">
                        {/* Image */}
                        {post.coverImage && (
                          <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {post.categories &&
                                post.categories.length > 0 && (
                                  <span
                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                      backgroundColor: "#DBEAFE",
                                      color: "#3B82F6",
                                    }}
                                  >
                                    {post.categories[0]?.name}
                                  </span>
                                )}
                            </div>
                            <h3
                              className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition mb-2"
                              style={{ color: "#1F3A51" }}
                            >
                              {post.title}
                            </h3>
                            <p
                              className="text-sm line-clamp-2 leading-relaxed"
                              style={{ color: "#6B7280" }}
                            >
                              {post.excerpt}
                            </p>
                          </div>
                          <div
                            className="flex items-center justify-between mt-4 pt-4"
                            style={{ borderTop: "1px solid #F3F4F6" }}
                          >
                            <span
                              className="text-xs font-medium"
                              style={{ color: "#9CA3AF" }}
                            >
                              {post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "Recently"}
                            </span>
                            <div
                              className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  router.push(`/edit-post/${post.slug}`);
                                }}
                                className="p-2 rounded-lg transition"
                                style={{
                                  backgroundColor: "#DBEAFE",
                                  color: "#3B82F6",
                                }}
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              {deleteConfirm === post.id ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeletePost(post.id, post.slug);
                                    }}
                                    disabled={deleting === post.id}
                                    className="px-2 py-1 text-xs font-medium rounded-lg text-white"
                                    style={{ backgroundColor: "#DC2626" }}
                                  >
                                    {deleting === post.id ? "..." : "Yes"}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setDeleteConfirm(null);
                                    }}
                                    className="px-2 py-1 text-xs font-medium rounded-lg"
                                    style={{
                                      backgroundColor: "#E5E7EB",
                                      color: "#374151",
                                    }}
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setDeleteConfirm(post.id);
                                  }}
                                  className="p-2 rounded-lg transition"
                                  style={{
                                    backgroundColor: "#FEE2E2",
                                    color: "#DC2626",
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
