"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Loader, Upload, X, Check, Search, ChevronDown } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { trpc } from "@/lib/trpc/client";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // tRPC hooks
  const categoriesQuery = trpc.categories.list.useQuery();
  const createPostMutation = trpc.posts.create.useMutation();
  const createAuthorMutation = trpc.users.createOrGetAuthor.useMutation();

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep2 =
    formData.title.trim() !== "" && formData.slug.trim() !== "";
  const canProceedToStep3 =
    canProceedToStep2 &&
    formData.excerpt.trim() !== "" &&
    formData.content.trim() !== "" &&
    formData.categoryIds.length > 0;

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

  // Update categories from tRPC query
  useEffect(() => {
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
      setCategoriesLoading(false);
    }
  }, [categoriesQuery.data]);

  // Set loading state from tRPC query
  useEffect(() => {
    setCategoriesLoading(categoriesQuery.isLoading);
  }, [categoriesQuery.isLoading]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    setFormData((prev) => ({
      ...prev,
      title,
      slug,
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
    const isChecked = !formData.categoryIds.includes(categoryId);

    setFormData((prev) => ({
      ...prev,
      categoryIds: isChecked
        ? [...prev.categoryIds, categoryId]
        : prev.categoryIds.filter((id) => id !== categoryId),
    }));
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const selectedCategories = categories.filter((cat) =>
    formData.categoryIds.includes(cat.id)
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setImageUploading(true);
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        coverImage: data.secure_url,
      }));

      setImagePreview(data.secure_url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image to Cloudinary"
      );
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: "",
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate all required fields FIRST
      if (
        !formData.title ||
        !formData.slug ||
        !formData.excerpt ||
        !formData.content ||
        !formData.authorName
      ) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      if (formData.categoryIds.length === 0) {
        setError("Please select at least one category");
        setIsLoading(false);
        return;
      }

      // Validate slug format (must be lowercase with hyphens only)
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(formData.slug.trim())) {
        setError(
          "Slug must contain only lowercase letters, numbers, and hyphens"
        );
        setIsLoading(false);
        return;
      }

      // Validate title length
      if (
        formData.title.trim().length < 3 ||
        formData.title.trim().length > 100
      ) {
        setError("Title must be between 3 and 100 characters");
        setIsLoading(false);
        return;
      }

      // Validate slug length
      if (
        formData.slug.trim().length < 3 ||
        formData.slug.trim().length > 100
      ) {
        setError("Slug must be between 3 and 100 characters");
        setIsLoading(false);
        return;
      }

      // Validate excerpt length
      if (
        formData.excerpt.trim().length < 1 ||
        formData.excerpt.trim().length > 200
      ) {
        setError("Excerpt must be between 1 and 200 characters");
        setIsLoading(false);
        return;
      }

      // Validate content length
      if (formData.content.trim().length < 10) {
        setError("Content must be at least 10 characters long");
        setIsLoading(false);
        return;
      }

      // Validate coverImage if provided (must be valid URL)
      if (formData.coverImage && formData.coverImage.trim() !== "") {
        try {
          new URL(formData.coverImage);
        } catch {
          setError("Cover image must be a valid URL");
          setIsLoading(false);
          return;
        }
      }

      try {
        // Create or get author using tRPC
        console.log("[CreatePost] Creating author with:", {
          name: formData.authorName.trim(),
        });
        const author = await createAuthorMutation.mutateAsync({
          name: formData.authorName.trim(),
        });

        if (!author || !author.id) {
          throw new Error("Failed to create or get author");
        }

        console.log("[CreatePost] Author created/retrieved:", {
          id: author.id,
          name: author.name,
        });

        // Create post using tRPC (coverImage is optional)
        const postPayload = {
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
          coverImage:
            formData.coverImage && formData.coverImage.trim() !== ""
              ? formData.coverImage.trim()
              : undefined,
          authorId: author.id,
          categoryIds: formData.categoryIds,
          published: false,
        };

        console.log("[CreatePost] Creating post with payload:", postPayload);
        await createPostMutation.mutateAsync(postPayload);

        console.log("[CreatePost] Post created successfully");
        setSuccess(true);
        setFormData({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverImage: "",
          authorName: "",
          categoryIds: [],
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (mutationError) {
        console.error("Mutation error full details:", mutationError);
        if (mutationError instanceof Error) {
          console.error("Error message:", mutationError.message);
          console.error("Error stack:", mutationError.stack);
        }
        if (mutationError && typeof mutationError === "object") {
          console.error(
            "Error object:",
            JSON.stringify(mutationError, null, 2)
          );
        }
        throw mutationError;
      }
    } catch (err) {
      console.error("Submit error:", err);
      let errorMessage = "Something went wrong";

      if (err instanceof Error) {
        console.error("Error message:", err.message);

        // Try to extract validation errors if available
        if ("data" in err && err.data && typeof err.data === "object") {
          const data = err.data as any;

          // Log the full error object for debugging
          console.error("Full error data:", data);

          // Check if validationErrors exist in the cause
          if (data.cause && typeof data.cause === "object") {
            const cause = data.cause as any;
            if (cause.details && cause.details.validationErrors) {
              const validationErrors = cause.details.validationErrors as Array<{
                field: string;
                message: string;
              }>;
              console.error("Validation errors:", validationErrors);

              // Format validation errors nicely
              const fieldErrors = validationErrors
                .map((e) => `${e.field}: ${e.message}`)
                .join("\n");
              errorMessage = `Validation errors:\n${fieldErrors}`;
            }
          }
        }

        // If no structured error, use the error message
        if (errorMessage === "Something went wrong") {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F3F4F6" }}>
      <div className="w-full px-4 md:px-8 py-2 pt-20 md:pt-10 md:pb-5 ">
        {/* Container */}
        <div className="max-w-5xl mx-auto md:mt-1">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl text-center md:text-3xl font-bold mb-3"
              style={{ color: "#1F3A51" }}
            >
              ✍️ Share Your Story
            </h1>
            <p className="text-lg text-center" style={{ color: "#6B7280" }}>
              Create and publish your next blog post
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 w-full">
            <div className="flex items-start justify-between mb-12 w-full relative px-5">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className="flex flex-col items-center flex-1"
                  style={{
                    opacity: currentStep >= step ? 1 : 0.3,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 mb-2 relative z-20"
                    style={{
                      backgroundColor:
                        currentStep >= step ? "#3B82F6" : "#D1D5DB",
                      color: currentStep >= step ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  <span
                    className="text-xs font-medium text-center"
                    style={{
                      color: currentStep >= step ? "#3B82F6" : "#9CA3AF",
                    }}
                  >
                    {step === 1 && "Basics"}
                    {step === 2 && "Content"}
                    {step === 3 && "Finalize"}
                  </span>
                </div>
              ))}
              {/* Connector bars between steps */}
              {[1, 2].map((connector) => (
                <div
                  key={`connector-${connector}`}
                  className="absolute h-1 top-5 transition-all duration-300"
                  style={{
                    left: `calc(${
                      (100 / 3) * (connector - 1) + 16.666
                    }% + 20px)`,
                    right: `calc(${
                      (100 / 3) * (2 - connector) + 16.666
                    }% + 20px)`,
                    backgroundColor:
                      currentStep > connector ? "#3B82F6" : "#E5E7EB",
                    zIndex: 10,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div
              className="mb-8 p-4 rounded-lg border-2 flex items-center gap-3"
              style={{
                backgroundColor: "#ECFDF5",
                borderColor: "#10B981",
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#10B981" }}
              >
                <Check className="w-4 h-4 text-white" />
              </div>
              <p style={{ color: "#047857" }}>
                <span className="font-semibold">Success!</span> Your post has
                been published
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="mb-8 p-4 rounded-lg border-2 flex items-start justify-between"
              style={{
                backgroundColor: "#FEF2F2",
                borderColor: "#F87171",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: "#F87171" }}
                >
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <p style={{ color: "#991B1B" }}>
                  <span className="font-semibold">Error:</span> {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-2xl font-light hover:opacity-50 transition shrink-0"
                style={{ color: "#F87171" }}
              >
                ×
              </button>
            </div>
          )}

          {/* Form Card */}
          <div
            className="rounded-2xl shadow-md p-8 md:p-10"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <form onSubmit={handleSubmit}>
              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-3"
                      style={{ color: "#1F3A51" }}
                    >
                      Post Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="What's on your mind?"
                      className="w-full px-0 py-3 text-lg border-b-2 focus:outline-none transition bg-transparent placeholder-gray-400"
                      style={{
                        borderColor: formData.title ? "#3B82F6" : "#E5E7EB",
                        color: "#1F3A51",
                      }}
                      required
                    />
                    <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                      Make it catchy and interesting
                    </p>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-3"
                      style={{ color: "#1F3A51" }}
                    >
                      URL Slug
                    </label>
                    <div
                      className="flex items-center border-b-2 transition"
                      style={{
                        borderColor: formData.slug ? "#3B82F6" : "#E5E7EB",
                      }}
                    >
                      <span
                        className="text-sm font-medium pr-2"
                        style={{ color: "#6B7280" }}
                      >
                        blog.com/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="url-slug"
                        className="flex-1 px-0 py-3 focus:outline-none bg-transparent placeholder-gray-400"
                        style={{ color: "#1F3A51" }}
                        required
                      />
                    </div>
                    <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                      Auto-generated from your title
                    </p>
                  </div>

                  <div
                    className="flex justify-end pt-8 border-t"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedToStep2}
                      className="px-6 py-2 rounded-lg font-semibold transition"
                      style={{
                        backgroundColor: canProceedToStep2
                          ? "#3B82F6"
                          : "#D1D5DB",
                        color: "#FFFFFF",
                        opacity: canProceedToStep2 ? 1 : 0.5,
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label
                        className="block text-sm px-3 font-semibold"
                        style={{ color: "#1F3A51" }}
                      >
                        Excerpt
                      </label>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          backgroundColor:
                            formData.excerpt.length < 50
                              ? "#FEE2E2"
                              : formData.excerpt.length < 150
                              ? "#FEF3C7"
                              : "#DCFCE7",
                          color:
                            formData.excerpt.length < 50
                              ? "#991B1B"
                              : formData.excerpt.length < 150
                              ? "#92400E"
                              : "#166534",
                        }}
                      >
                        {formData.excerpt.length}/150 chars
                      </span>
                    </div>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Brief summary of your post..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition bg-transparent resize-none placeholder-gray-400"
                      style={{
                        borderColor: formData.excerpt ? "#3B82F6" : "#E5E7EB",
                        color: "#1F3A51",
                      }}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label
                        className="block text-sm font-semibold"
                        style={{ color: "#1F3A51" }}
                      >
                        Content
                      </label>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          backgroundColor:
                            formData.content.length < 100
                              ? "#FEE2E2"
                              : formData.content.length < 500
                              ? "#FEF3C7"
                              : "#DCFCE7",
                          color:
                            formData.content.length < 100
                              ? "#991B1B"
                              : formData.content.length < 500
                              ? "#92400E"
                              : "#166534",
                        }}
                      >
                        {formData.content.length} chars
                      </span>
                    </div>
                    <div
                      className="rounded-lg border-2 overflow-hidden"
                      style={{
                        borderColor: formData.content ? "#3B82F6" : "#E5E7EB",
                      }}
                      data-color-mode="light"
                    >
                      <MDEditor
                        value={formData.content}
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            content: val || "",
                          }))
                        }
                        preview="live"
                        height={300}
                        visibleDragbar={false}
                        textareaProps={{
                          placeholder:
                            "Write your complete story using Markdown...",
                        }}
                        enableScroll={true}
                        hideToolbar={false}
                        className="w-full"
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#1F3A51",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-4"
                      style={{ color: "#1F3A51" }}
                    >
                      Categories
                    </label>

                    {/* Search Box with Selected Categories Inside */}
                    <div ref={dropdownRef} className="relative">
                      <div
                        className="flex items-center gap-2 px-3 py-2 border-2 rounded-lg flex-wrap"
                        style={{
                          borderColor: "#E5E7EB",
                          backgroundColor: "#FFFFFF",
                          minHeight: "48px",
                        }}
                      >
                        {/* Display Selected Categories as Tags */}
                        {selectedCategories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium shrink-0"
                            style={{
                              backgroundColor: "#DBEAFE",
                              color: "#1E40AF",
                            }}
                          >
                            {category.name}
                            <button
                              type="button"
                              onClick={() => handleCategoryChange(category.id)}
                              className="hover:opacity-70 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {/* Search Input */}
                        <div className="flex items-center gap-1 flex-1 min-w-[200px]">
                          {/* <Search
                            className="w-4 h-4 shrink-0"
                            style={{ color: "#6B7280" }}
                          /> */}
                          <input
                            type="text"
                            placeholder={
                              selectedCategories.length > 0
                                ? "Add more..."
                                : "Search categories..."
                            }
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            onFocus={() => setShowCategoryDropdown(true)}
                            className="flex-1 outline-none bg-transparent text-sm"
                            style={{ color: "#1F3A51" }}
                          />
                        </div>
                      </div>

                      {/* Search Results - Display below search box */}
                      {(showCategoryDropdown || categorySearch) && (
                        <div
                          className="absolute top-full left-0 right-0 mt-2 bg-white border-2 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                          style={{ borderColor: "#E5E7EB" }}
                        >
                          {categoriesLoading ? (
                            <div className="flex items-center justify-center gap-2 px-4 py-4">
                              <Loader
                                className="w-4 h-4 animate-spin"
                                style={{ color: "#3B82F6" }}
                              />
                              <span style={{ color: "#6B7280" }}>
                                Loading categories...
                              </span>
                            </div>
                          ) : filteredCategories.length > 0 ? (
                            <div className="p-2">
                              <div
                                className="text-xs font-semibold px-3 py-2 mb-2"
                                style={{ color: "#6B7280" }}
                              >
                                {filteredCategories.length} categories found
                              </div>
                              {filteredCategories.map((category) => (
                                <label
                                  key={category.id}
                                  className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded transition hover:bg-blue-50"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.categoryIds.includes(
                                      category.id
                                    )}
                                    onChange={() =>
                                      handleCategoryChange(category.id)
                                    }
                                    className="w-4 h-4 rounded"
                                    style={{ accentColor: "#3B82F6" }}
                                  />
                                  <div className="flex-1">
                                    <div
                                      className="text-sm font-medium"
                                      style={{ color: "#1F3A51" }}
                                    >
                                      {category.name}
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div
                              className="px-4 py-4 text-center text-sm"
                              style={{ color: "#9CA3AF" }}
                            >
                              No categories found matching "{categorySearch}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex justify-between pt-8 border-t"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 rounded-lg font-semibold transition"
                      style={{ backgroundColor: "#F3F4F6", color: "#1F3A51" }}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedToStep3}
                      className="px-6 py-2 rounded-lg font-semibold transition"
                      style={{
                        backgroundColor: canProceedToStep3
                          ? "#3B82F6"
                          : "#D1D5DB",
                        color: "#FFFFFF",
                        opacity: canProceedToStep3 ? 1 : 0.5,
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-4"
                      style={{ color: "#1F3A51" }}
                    >
                      Cover Image{" "}
                      <span style={{ color: "#9CA3AF" }}>(Optional)</span>
                    </label>
                    {!imagePreview ? (
                      <div
                        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition hover:bg-gray-50"
                        style={{ borderColor: "#E5E7EB" }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: "#F3F4F6" }}
                        >
                          <Upload style={{ color: "#6B7280" }} />
                        </div>
                        <p
                          className="font-medium mb-2"
                          style={{ color: "#1F3A51" }}
                        >
                          Drop your image here
                        </p>
                        <p
                          className="text-sm mb-4"
                          style={{ color: "#6B7280" }}
                        >
                          or click to browse
                        </p>
                        <input
                          type="file"
                          id="coverImage"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="coverImage"
                          className="inline-block px-4 py-2 rounded-lg font-semibold cursor-pointer transition hover:shadow-md"
                          style={{
                            backgroundColor: "#3B82F6",
                            color: "#FFFFFF",
                          }}
                        >
                          {imageUploading ? "Uploading..." : "Select File"}
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Cover"
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-3"
                      style={{ color: "#1F3A51" }}
                    >
                      Author Name
                    </label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full px-0 py-3 text-lg border-b-2 focus:outline-none transition bg-transparent placeholder-gray-400"
                      style={{
                        borderColor: formData.authorName
                          ? "#3B82F6"
                          : "#E5E7EB",
                        color: "#1F3A51",
                      }}
                      required
                    />
                  </div>

                  <div
                    className="flex justify-between pt-8 border-t"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 rounded-lg font-semibold transition"
                      style={{ backgroundColor: "#F3F4F6", color: "#1F3A51" }}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !formData.authorName.trim()}
                      className="px-8 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                      style={{
                        backgroundColor:
                          isLoading || !formData.authorName.trim()
                            ? "#D1D5DB"
                            : "#10B981",
                        color: "#FFFFFF",
                        opacity:
                          isLoading || !formData.authorName.trim() ? 0.5 : 1,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Publish
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
