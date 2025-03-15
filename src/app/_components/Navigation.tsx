"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 bg-[#111]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === "/"
                    ? "border-b-2 border-[#8B4513] text-[#8B4513]"
                    : "border-b-2 border-transparent text-gray-400 hover:border-b-2 hover:border-gray-700 hover:text-white"
                }`}
              >
                Visualizer
              </Link>
              <Link
                href="/voicings"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === "/voicings"
                    ? "border-b-2 border-[#8B4513] text-[#8B4513]"
                    : "border-b-2 border-transparent text-gray-400 hover:border-b-2 hover:border-gray-700 hover:text-white"
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
