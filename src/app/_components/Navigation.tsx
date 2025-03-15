"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-[#111] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === "/"
                    ? "text-[#8B4513] border-b-2 border-[#8B4513]"
                    : "text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-700 border-b-2 border-transparent"
                }`}
              >
                Visualizer
              </Link>
              <Link
                href="/voicings"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === "/voicings"
                    ? "text-[#8B4513] border-b-2 border-[#8B4513]"
                    : "text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-700 border-b-2 border-transparent"
                }`}
              >
                Voicings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 