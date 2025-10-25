import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface BlogCardProps {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  href: string;
  categoryColor?: string;
  image?: string;
  tags?: string[];
}

export default function BlogCard({
  id,
  category,
  title,
  excerpt,
  author,
  date,
  readTime,
  href,
  categoryColor = "bg-blue-100 text-blue-700",
  image,
  tags = [],
}: BlogCardProps) {
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Fallback gradient if no image provided
  const bgGradient = image
    ? `url(${image})`
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <Link href={href}>
      <div
        className="group rounded-2xl overflow-hidden shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col transform hover:scale-98"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#BCCCDC" }}
      >
        {/* Card Image with Arrow Icon */}
        <div
          className="relative h-40 overflow-hidden"
          style={{ backgroundColor: "#BCCCDC" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundImage: bgGradient,
              backgroundColor: "#8b7bb8",
            }}
          />

          {/* Arrow Icon - Top Right */}
          <div
            className="absolute top-4 right-4 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center shadow-xl transition-all z-10 transform group-hover:translate-y-1 group-hover:-translate-x-1"
            style={{ backgroundColor: "#FFFFFF", color: "#1F3A51" }}
          >
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 border-2 border-blue-500"
              style={{ backgroundColor: "#D9EAFD" }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <div
                className="text-sm font-semibold leading-tight"
                style={{ color: "#1F3A51" }}
              >
                {author}
              </div>
              <div
                className="text-xs leading-tight"
                style={{ color: "#5A6B78" }}
              >
                {date}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-base font-bold mb-2 group-hover:opacity-80 transition line-clamp-2 leading-snug"
            style={{ color: "#1F3A51" }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="text-xs mb-3 flex-1 line-clamp-2"
            style={{ color: "#5A6B78" }}
          >
            {excerpt}
          </p>

          {/* Tags */}
          <div
            className="flex flex-wrap gap-1 pt-3"
            style={{ borderTopColor: "#BCCCDC", borderTopWidth: "1px" }}
          >
            {(tags.length > 0 ? tags : [category]).map((tag, idx) => (
              <span
                key={idx}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition"
                style={{
                  backgroundColor: "#F8FAFC",
                  color: "#1F3A51",
                  border: "1px solid #BCCCDC",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
