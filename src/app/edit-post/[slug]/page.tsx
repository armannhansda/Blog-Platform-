"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Loader, Upload, X, Check, Search } from "lucide-react";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import { trpc } from "@/lib/trpc/client";

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    authorName: "",
    categoryIds: [] as number[],
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // tRPC hooks
  const postQuery = trpc.posts.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );
  const categoriesQuery = trpc.categories.list.useQuery();
  const updatePostMutation = trpc.posts.update.useMutation();
  const createAuthorMutation = trpc.users.createOrGetAuthor.useMutation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load post data from tRPC query
  useEffect(() => {
    if (postQuery.data) {
      setFormData({
        title: postQuery.data.title,
        slug: postQuery.data.slug,
        excerpt: postQuery.data.excerpt || "",
        content: postQuery.data.content,
        coverImage: postQuery.data.coverImage || "",
        authorName: postQuery.data.author?.name || "",
        categoryIds: postQuery.data.categories?.map((cat: any) => cat.id) || [],
      });

      if (postQuery.data.coverImage) {
        setImagePreview(postQuery.data.coverImage);
      }
      setPageLoading(false);
    }
  }, [postQuery.data]);

  // Load categories from tRPC query
  useEffect(() => {
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
      setCategoriesLoading(false);
    }
  }, [categoriesQuery.data]);

  // Update loading state for categories
  useEffect(() => {
    setCategoriesLoading(categoriesQuery.isLoading);
  }, [categoriesQuery.isLoading]);

  // Handle post loading error
  useEffect(() => {
    if (postQuery.isError) {
      setError("Failed to load post");
      setPageLoading(false);
    }
  }, [postQuery.isError]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const selectedCategories = categories.filter((cat) =>
    formData.categoryIds.includes(cat.id)
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setImageUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({
          ...prev,
          coverImage: base64String,
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.excerpt || !formData.content) {
        setError("Title, excerpt, and content are required");
        setIsLoading(false);
        return;
      }

      // Get or create author
      const authorResult = await createAuthorMutation.mutateAsync({
        name: formData.authorName || "Anonymous",
        email: `author-${Date.now()}@blog.local`,
      });

      // Update post using tRPC
      await updatePostMutation.mutateAsync({
        id: postQuery.data?.id!,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        authorId: authorResult.id,
        categoryIds: formData.categoryIds,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error: any) {
      console.error("Error updating post:", error);
      setError(error?.message || "Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F3F4F6" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className=" mt-10 mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1F3A51" }}>
            Edit Post
          </h1>
          <p style={{ color: "#6B7280" }}>Update your blog post details</p>
        </div>

        {/* Messages */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg border"
            style={{
              backgroundColor: "#FEE2E2",
              borderColor: "#FECACA",
              color: "#DC2626",
            }}
          >
            <p className="font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div
            className="mb-6 p-4 rounded-lg border"
            style={{
              backgroundColor: "#DCFCE7",
              borderColor: "#BBEF63",
              color: "#15803D",
            }}
          >
            <p className="font-medium">
              Post updated successfully! Redirecting to profile...
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 shadow-lg"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Title and Slug */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Title */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1F3A51" }}
              >
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter post title"
                className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#E5E7EB",
                  backgroundColor: "#F9FAFB",
                  color: "#000000",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.backgroundColor = "#FFFFFF";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.backgroundColor = "#F9FAFB";
                }}
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1F3A51" }}
              >
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="post-slug"
                className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#E5E7EB",
                  backgroundColor: "#F9FAFB",
                  color: "#000000",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.backgroundColor = "#FFFFFF";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.backgroundColor = "#F9FAFB";
                }}
              />
              <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                URL-friendly version
              </p>
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-sm font-semibold"
                style={{ color: "#1F3A51" }}
              >
                Excerpt *
              </label>
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  color:
                    formData.excerpt.length < 50
                      ? "#DC2626"
                      : formData.excerpt.length < 150
                      ? "#CA8A04"
                      : "#10B981",
                  backgroundColor:
                    formData.excerpt.length < 50
                      ? "#FEE2E2"
                      : formData.excerpt.length < 150
                      ? "#FEF3C7"
                      : "#DCFCE7",
                }}
              >
                {formData.excerpt.length}/150
              </span>
            </div>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Brief summary of your post (recommended: 50-150 characters)"
              rows={3}
              maxLength={150}
              className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 resize-none"
              style={{
                borderColor: "#E5E7EB",
                backgroundColor: "#F9FAFB",
                color: "#000000",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3B82F6";
                e.target.style.backgroundColor = "#FFFFFF";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E5E7EB";
                e.target.style.backgroundColor = "#F9FAFB";
              }}
              required
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label
                className="block text-sm font-semibold"
                style={{ color: "#1F3A51" }}
              >
                Content *
              </label>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                {formData.content.length} characters
              </span>
            </div>

            {/* MDEditor */}
            <div data-color-mode="light">
              <MDEditor
                value={formData.content}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, content: val || "" }))
                }
                preview="live"
                height={300}
                visibleDragbar={false}
                textareaProps={{
                  placeholder: "Write your complete story using Markdown...",
                }}
                enableScroll={true}
                hideToolbar={false}
                className="w-full rounded-lg"
              />
            </div>
            <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
              💡 Tip: Use Markdown formatting for better styling
            </p>
          </div>
          {/* Author and Categories */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Author */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1F3A51" }}
              >
                Author *
              </label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="Enter author name"
                className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#E5E7EB",
                  backgroundColor: "#F9FAFB",
                  color: "#000000",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.backgroundColor = "#FFFFFF";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.backgroundColor = "#F9FAFB";
                }}
                required
              />
            </div>

            {/* Categories Full Dropdown */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1F3A51" }}
              >
                Categories *
              </label>

              {/* Category Dropdown */}
              <div ref={dropdownRef} className="relative">
                {/* Search Input with Selected Tags Inside */}
                <div
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg border transition flex-wrap"
                  style={{
                    borderColor: showCategoryDropdown ? "#3B82F6" : "#E5E7EB",
                    backgroundColor: "#F9FAFB",
                    alignContent: "center",
                  }}
                >
                  {/* Selected Categories Tags Inside Search Bar */}
                  {selectedCategories.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {selectedCategories.map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
                          style={{ backgroundColor: "#3B82F6" }}
                        >
                          {cat.name}
                          <button
                            type="button"
                            onClick={() => handleCategoryChange(cat.id)}
                            className="hover:opacity-80"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search Icon and Input */}
                  <div className="flex items-center gap-2 flex-1 min-w-max">
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      onFocus={() => setShowCategoryDropdown(true)}
                      placeholder={
                        selectedCategories.length > 0
                          ? "Add more..."
                          : "Search categories..."
                      }
                      className="bg-transparent outline-none text-sm"
                      style={{ color: "#000000", minWidth: "100px" }}
                    />
                  </div>
                </div>

                {/* Dropdown Menu */}
                {showCategoryDropdown && categorySearch && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-50 max-h-48 overflow-y-auto"
                    style={{
                      borderColor: "#E5E7EB",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {categoriesLoading ? (
                      <div className="p-4 text-center">
                        <Loader className="w-4 h-4 animate-spin mx-auto mb-2" />
                        <p className="text-xs" style={{ color: "#6B7280" }}>
                          Loading categories...
                        </p>
                      </div>
                    ) : filteredCategories.length > 0 ? (
                      <>
                        <div
                          className="px-4 py-2 text-xs font-semibold border-b"
                          style={{
                            color: "#6B7280",
                            borderColor: "#E5E7EB",
                            backgroundColor: "#F9FAFB",
                          }}
                        >
                          {filteredCategories.length} categor
                          {filteredCategories.length === 1 ? "y" : "ies"} found
                        </div>
                        {filteredCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                              handleCategoryChange(category.id);
                              setCategorySearch("");
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                            style={{ borderColor: "#E5E7EB" }}
                          >
                            <div
                              className="w-4 h-4 rounded border-2 flex items-center justify-center"
                              style={{
                                borderColor: formData.categoryIds.includes(
                                  category.id
                                )
                                  ? "#3B82F6"
                                  : "#D1D5DB",
                                backgroundColor: formData.categoryIds.includes(
                                  category.id
                                )
                                  ? "#3B82F6"
                                  : "transparent",
                              }}
                            >
                              {formData.categoryIds.includes(category.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span style={{ color: "#1F3A51" }}>
                              {category.name}
                            </span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs" style={{ color: "#6B7280" }}>
                          No categories found
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {formData.categoryIds.length === 0 && (
                <p className="text-xs mt-2" style={{ color: "#DC2626" }}>
                  ⚠️ At least one category is required
                </p>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="mb-6">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#1F3A51" }}
            >
              Cover Image
            </label>
            {imagePreview ? (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Cover"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                  style={{ borderColor: "#E5E7EB" }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 rounded-full transition text-white"
                  style={{ backgroundColor: "#DC2626" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#B91C1C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#DC2626")
                  }
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            <label
              className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed rounded-lg transition cursor-pointer"
              style={{
                borderColor: "#D1D5DB",
                backgroundColor: "#F9FAFB",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#3B82F6";
                e.currentTarget.style.backgroundColor = "#DBEAFE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#D1D5DB";
                e.currentTarget.style.backgroundColor = "#F9FAFB";
              }}
            >
              <Upload className="w-5 h-5" style={{ color: "#3B82F6" }} />
              <span className="font-medium" style={{ color: "#6B7280" }}>
                {imageUploading ? "Uploading..." : "Click to upload image"}
              </span>
              <input
                type="file"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="hidden"
                accept="image/*"
              />
            </label>
            <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
              PNG, JPG, GIF up to 5MB
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 ml-auto w-fit">
            <button
              type="submit"
              disabled={isLoading}
              className="font-semibold py-2 px-5 rounded-lg transition text-white flex items-center justify-center gap-2 text-sm"
              style={{
                backgroundColor: isLoading ? "#93C5FD" : "#3B82F6",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#3B82F6";
                }
              }}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </button>
            <Link
              href="/profile"
              className="font-semibold py-2 px-5 rounded-lg transition text-center border text-sm"
              style={{
                color: "#1F3A51",
                borderColor: "#D1D5DB",
                backgroundColor: "#F9FAFB",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E5E7EB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F9FAFB";
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
