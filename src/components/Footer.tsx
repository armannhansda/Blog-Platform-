"use client";

import Link from "next/link";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="py-12 px-6 md:px-12 border-t"
      style={{
        backgroundColor: "#1F3A51",
        borderColor: "#0F1F2E",
      }}
    >
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>
              BlogPlatform
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#BCCCDC" }}>
              Your go-to platform for travel stories, culinary adventures, and
              lifestyle inspiration.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition transform hover:scale-110"
                style={{
                  backgroundColor: "#3D74B6",
                  color: "#FFFFFF",
                }}
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition transform hover:scale-110"
                style={{
                  backgroundColor: "#3D74B6",
                  color: "#FFFFFF",
                }}
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition transform hover:scale-110"
                style={{
                  backgroundColor: "#3D74B6",
                  color: "#FFFFFF",
                }}
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@blogplatform.com"
                className="p-2 rounded-full transition transform hover:scale-110"
                style={{
                  backgroundColor: "#3D74B6",
                  color: "#FFFFFF",
                }}
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: "#FFFFFF" }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: "#FFFFFF" }}>
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Travel
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Culinary
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Lifestyle
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Tips & Hacks
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: "#FFFFFF" }}>
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="text-sm transition hover:font-semibold"
                  style={{ color: "#BCCCDC" }}
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-8" style={{ borderColor: "#0F1F2E" }}></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <p className="text-sm" style={{ color: "#BCCCDC" }}>
            &copy; {currentYear} BlogPlatform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
