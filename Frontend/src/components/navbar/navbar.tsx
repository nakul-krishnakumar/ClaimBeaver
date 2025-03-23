"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/auth-helpers/brower-connector";

export default function StickyGlassNavbar() {
  const [activeItem, setActiveItem] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<boolean | null>(null); // Allow null and boolean

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(!!data.session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(!!session);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-20 px-4 py-4 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`w-full max-w-6xl mx-auto bg-white/70 border border-slate-200 backdrop-blur-sm rounded-full px-6 py-3 flex items-center justify-between ${
          isScrolled ? "shadow-sm shadow-blue-200/60" : ""
        }`}
      >
        {/* Logo section */}
        <div className="flex-shrink-0 px-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-medium text-slate-800">
              Claim Beaver
            </span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center justify-center">
          <div className="bg-slate-100/80 rounded-full p-1 flex space-x-1">
            <Link
              href="/chat"
              onClick={() => setActiveItem("Login")}
              className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                activeItem === "Login"
                  ? "bg-blue-500 text-white"
                  : "text-slate-700 hover:bg-slate-200/80"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Chat with AI Agent
            </Link>
            <Link
            href="/claims"
            onClick={() => setActiveItem("Claims")}
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 font-medium ${
              activeItem === "Claims"
                ? "bg-blue-500 text-white"
                : "text-slate-700 hover:bg-slate-200/80"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Ask your Claims
          </Link>
          <Link
            href="tel:+19702935709"
            onClick={() => setActiveItem("Call")}
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 font-medium ${
              activeItem === "Call"
                ? "bg-blue-500 text-white"
                : "text-slate-700 hover:bg-slate-200/80"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Have a Call with AI
          </Link>
          </div>
        </div>

        {/* Right section with login/logout */}
        <div className="hidden md:block">
          {session === null ? (
            <div className="w-24 h-10 bg-gray-300 rounded-full animate-pulse" />
          ) : session ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setSession(false);
              }}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white border border-red-400/10 px-6 py-2 rounded-full font-medium transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white border border-blue-400/10 px-6 py-2 rounded-full font-medium transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* Push content down when navbar is fixed */}
      <div className="pt-16"></div>
    </div>
  );
}
