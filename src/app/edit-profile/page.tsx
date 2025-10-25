"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Loader, Upload, X } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profileImage: "",
    coverImage: "",
  });

  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  // tRPC mutation for updating user
  const updateUserMutation = trpc.users.update.useMutation();

  // Check authentication and load user data on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = localStorage.getItem("user");

    if (!isLoggedIn || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Load current user profile data using tRPC
      fetchUserProfile(parsedUser.id);
    } catch (err) {
      console.error("Error parsing user data:", err);
      router.push("/login");
    }
  }, [router]);

  const fetchUserProfile = async (userId: number) => {
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem("authToken");

      // Call the tRPC endpoint with proper authentication
      const response = await fetch(
        `/api/trpc/users.getById?input=${JSON.stringify(userId)}`,
        {
          headers: {
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      const userData = data.result.data;

      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        profileImage: userData.profileImage || "",
        coverImage: userData.coverImage || "",
      });

      if (userData.profileImage) {
        setProfileImagePreview(userData.profileImage);
      }
      if (userData.coverImage) {
        setCoverImagePreview(userData.coverImage);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile data");
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    if (imageType === "profile") {
      setProfileImageUploading(true);
    } else {
      setCoverImageUploading(true);
    }
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );
      formDataUpload.append(
        "folder",
        `blog-platform/${imageType === "profile" ? "profiles" : "covers"}`
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

      if (imageType === "profile") {
        setFormData((prev) => ({
          ...prev,
          profileImage: data.secure_url,
        }));
        setProfileImagePreview(data.secure_url);
      } else {
        setFormData((prev) => ({
          ...prev,
          coverImage: data.secure_url,
        }));
        setCoverImagePreview(data.secure_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      if (imageType === "profile") {
        setProfileImageUploading(false);
      } else {
        setCoverImageUploading(false);
      }
    }
  };

  const handleRemoveImage = (imageType: "profile" | "cover") => {
    if (imageType === "profile") {
      setFormData((prev) => ({
        ...prev,
        profileImage: "",
      }));
      setProfileImagePreview(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        coverImage: "",
      }));
      setCoverImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.email) {
        setError("Name and email are required");
        setIsLoading(false);
        return;
      }

      if (!user) {
        setError("User not found");
        setIsLoading(false);
        return;
      }

      const updatedUser = await updateUserMutation.mutateAsync({
        id: user.id,
        name: formData.name,
        email: formData.email,
        bio: formData.bio || undefined,
        profileImage: formData.profileImage || null,
        coverImage: formData.coverImage || null,
      });

      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess(true);

      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Failed to update profile";
      setError(errorMessage);
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
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Update your profile information and images
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">
                Profile updated successfully! Redirecting...
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-50 p-8 rounded-lg"
          >
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cover Image
              </label>
              {coverImagePreview ? (
                <div className="mb-4 relative">
                  <img
                    src={coverImagePreview}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage("cover")}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition cursor-pointer bg-white">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">
                  {coverImageUploading
                    ? "Uploading..."
                    : "Click to upload or drag and drop"}
                </span>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, "cover")}
                  disabled={coverImageUploading}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Profile Picture
              </label>
              {profileImagePreview ? (
                <div className="mb-4 flex justify-center relative">
                  <div className="relative">
                    <img
                      src={profileImagePreview}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("profile")}
                      className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition cursor-pointer bg-white">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">
                  {profileImageUploading
                    ? "Uploading..."
                    : "Click to upload profile picture"}
                </span>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, "profile")}
                  disabled={profileImageUploading}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 5MB. Recommended: 400x400px
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
              <Link
                href="/profile"
                className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
