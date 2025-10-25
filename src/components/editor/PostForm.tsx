"use client";

import { useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";

interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  categoryIds: string[];
  published: boolean;
}

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  categories?: Array<{ id: string; name: string }>;
  isSubmitting?: boolean;
}

export function PostForm({
  initialData = {},
  onSubmit,
  categories = [],
  isSubmitting = false,
}: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData.title || "",
    excerpt: initialData.excerpt || "",
    content: initialData.content || "",
    categoryIds: initialData.categoryIds || [],
    published: initialData.published || false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PostFormData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name as keyof PostFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, categoryIds: selectedOptions }));

    if (errors.categoryIds) {
      setErrors((prev) => ({ ...prev, categoryIds: undefined }));
    }
  };

  const handleContentChange = (value: string | undefined) => {
    setFormData((prev) => ({ ...prev, content: value || "" }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PostFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = "At least one category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.title
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm`}
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
          placeholder="Brief summary of your post"
        />
      </div>

      <div>
        <label
          htmlFor="categoryIds"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Categories
        </label>
        <select
          id="categoryIds"
          name="categoryIds"
          multiple
          value={formData.categoryIds}
          onChange={handleSelectChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.categoryIds
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm`}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Hold Ctrl (or Cmd) to select multiple categories
        </p>
        {errors.categoryIds && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.categoryIds}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Content
        </label>
        <MarkdownEditor
          initialValue={formData.content}
          onChange={handleContentChange}
        />
        {errors.content && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.content}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="published"
          name="published"
          type="checkbox"
          checked={formData.published}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
        />
        <label
          htmlFor="published"
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          Publish immediately
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {isSubmitting ? "Saving..." : "Save Post"}
        </button>
      </div>
    </form>
  );
}
