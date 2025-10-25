import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} BlogPlatform. All rights
              reserved.
            </p>
          </div>
          <div className="mt-4 flex justify-center md:mt-0">
            <div className="flex space-x-6">
              <Link
                href="/blog"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
