"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Filter, Check } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PostFiltersProps {
  categories?: Category[];
  showPublished?: boolean;
}

export function PostFilters({
  categories = [],
  showPublished = true,
}: PostFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [publishedFilter, setPublishedFilter] = useState<string>(
    searchParams.get("published") || "all"
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Update URL when filters change
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    if (publishedFilter !== "all") {
      params.set("published", publishedFilter);
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  }, [search, selectedCategories, publishedFilter, router, pathname]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      updateFilters();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, updateFilters]);

  // Update other filters immediately
  useEffect(() => {
    updateFilters();
  }, [selectedCategories, publishedFilter, updateFilters]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isCategoryDropdownOpen &&
        !(event.target as Element).closest("#category-dropdown")
      ) {
        setIsCategoryDropdownOpen(false);
      }

      if (
        isStatusDropdownOpen &&
        !(event.target as Element).closest("#status-dropdown")
      ) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCategoryDropdownOpen, isStatusDropdownOpen]);

  // Handle category selection
  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setPublishedFilter("all");
    router.push(pathname);
  };

  // Check if any filters are active
  const hasActiveFilters =
    search || selectedCategories.length > 0 || publishedFilter !== "all";

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="relative" id="category-dropdown">
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="inline-flex justify-center items-center w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter className="h-4 w-4 mr-2" />
            Categories
            {selectedCategories.length > 0 && (
              <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs">
                {selectedCategories.length}
              </span>
            )}
          </button>

          {isCategoryDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div
                className="py-1 max-h-60 overflow-auto"
                role="menu"
                aria-orientation="vertical"
              >
                {categories.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No categories found
                  </div>
                ) : (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                      Select categories
                    </div>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.slug)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                          {selectedCategories.includes(category.slug) && (
                            <Check className="h-4 w-4 text-blue-500" />
                          )}
                        </span>
                        {category.name}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Published status filter */}
        {showPublished && (
          <div className="relative" id="status-dropdown">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="inline-flex justify-center items-center w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="mr-1">Status:</span>
              <span className="font-medium">
                {publishedFilter === "all"
                  ? "All"
                  : publishedFilter === "true"
                  ? "Published"
                  : "Draft"}
              </span>
            </button>

            {isStatusDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => setPublishedFilter("all")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    <span className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                      {publishedFilter === "all" && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </span>
                    All
                  </button>
                  <button
                    onClick={() => setPublishedFilter("true")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    <span className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                      {publishedFilter === "true" && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </span>
                    Published
                  </button>
                  <button
                    onClick={() => setPublishedFilter("false")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    <span className="w-4 h-4 mr-2 inline-flex items-center justify-center">
                      {publishedFilter === "false" && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </span>
                    Draft
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Active filters:
          </span>

          {search && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Search: {search}
              <button
                onClick={() => setSearch("")}
                className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedCategories.map((slug) => {
            const category = categories.find((c) => c.slug === slug);
            return category ? (
              <span
                key={slug}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              >
                Category: {category.name}
                <button
                  onClick={() => toggleCategory(slug)}
                  className="ml-1 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ) : null;
          })}

          {publishedFilter !== "all" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              Status: {publishedFilter === "true" ? "Published" : "Draft"}
              <button
                onClick={() => setPublishedFilter("all")}
                className="ml-1 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
