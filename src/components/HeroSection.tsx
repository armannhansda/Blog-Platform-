"use client";
import { useState, useEffect } from "react";
import type { BlogCardProps } from "./BlogCard";

export interface HeroAuthor {
  name: string;
  initials?: string;
  date: string;
  readTime: string;
}

export interface HeroSectionProps {
  posts?: BlogCardProps[];
  category?: string;
  title?: string;
  description?: string;
  author?: HeroAuthor;
  backgroundGradient?: string;
  onCategoryClick?: () => void;
  autoSlide?: boolean;
  slideInterval?: number;
}

export default function HeroSection({
  posts = [],
  category,
  title,
  description,
  author,
  backgroundGradient = "from-purple-600 via-blue-600 to-blue-400",
  onCategoryClick,
  autoSlide = true,
  slideInterval = 5000,
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const displayPosts = posts.slice(0, 3); // Only show first 3 posts
  const totalSlides = Math.max(displayPosts.length, 3);
  const currentPost = displayPosts[currentSlide] || displayPosts[0];

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || displayPosts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayPosts.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, displayPosts.length]);

  // Get gradient color based on category
  const getCategoryGradient = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case "destination":
        return "linear-gradient(135deg, #D9EAFD 0%, #BCCCDC 100%)";
      case "culinary":
        return "linear-gradient(135deg, #9AA6B2 0%, #BCCCDC 100%)";
      case "lifestyle":
        return "linear-gradient(135deg, #BCCCDC 0%, #D9EAFD 100%)";
      case "tips & hacks":
        return "linear-gradient(135deg, #D9EAFD 0%, #BCCCDC 100%)";
      default:
        return backgroundGradient;
    }
  };

  return (
    <section className="w-full mb-16">
      <div className="relative h-[340px] md:h-[500px] w-full overflow-hidden shadow-2xl group rounded-b-3xl">
        {/* Background image or gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: currentPost?.image
              ? `url(${currentPost.image})`
              : getCategoryGradient(currentPost?.category),
            backgroundSize: currentPost?.image ? "cover" : "100% 100%",
            backgroundPosition: "center",
          }}
        />
        {/* Overlay with better contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Content */}
        <div className="absolute left-0 bottom-0 p-4 sm:p-6 md:p-8 w-full pb-14 sm:pb-16 md:pb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 md:gap-8">
            <div className="flex-1">
              <button
          onClick={onCategoryClick}
          className="inline-block bg-white/95 hover:bg-white text-gray-800 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold mt-4 sm:mt-6 md:mt-8 transition cursor-pointer mb-3"
          style={{ color: "#3D74B6" }}
              >
          {currentPost?.category || category || "Blog"}
              </button>
              <h1 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-lg leading-tight">
          {currentPost?.title || title || "Welcome to Horizone"}
              </h1>
              <p className="text-white/95 text-sm sm:text-base md:text-lg max-w-xl md:max-w-2xl drop-shadow-md leading-relaxed font-light">
          {currentPost?.excerpt ||
            description ||
            "Discover amazing travel stories"}
              </p>
            </div>
            {currentPost && (
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg border-2 md:border-[3px] border-white/80 shadow-lg"
            style={{ backgroundColor: "#3D74B6" }}
          >
            {currentPost.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="text-white/95">
            <div className="font-bold text-sm sm:text-base">
              {currentPost.author}
            </div>
            <div className="opacity-80 text-xs sm:text-sm">
              {currentPost.date} • {currentPost.readTime}
            </div>
          </div>
              </div>
            )}
            {author && !currentPost && (
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg border-2 md:border-[3px] border-white/80 shadow-lg"
            style={{ backgroundColor: "#3D74B6" }}
          >
            {author.initials ||
              author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
          </div>
          <div className="text-white/95">
            <div className="font-bold text-sm sm:text-base">{author.name}</div>
            <div className="opacity-80 text-xs sm:text-sm">
              {author.date} • {author.readTime}
            </div>
          </div>
              </div>
            )}
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute left-12 bottom-6 flex gap-3 z-10">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx % displayPosts.length);
              }}
              className="rounded-full transition"
              style={{
                width: idx === currentSlide ? "24px" : "12px",
                height: "12px",
                backgroundColor:
                  idx === currentSlide
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.5)",
                transition: "all 0.3s ease",
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
