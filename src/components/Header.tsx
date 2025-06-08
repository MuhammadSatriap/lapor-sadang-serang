"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  
  LogOut,
  
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Efek untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efek untuk memantau status login
  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getInitialSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
      >
        Beranda
      </Link>
      <Link
        href="/laporan-publik"
        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
      >
        Laporan
      </Link>
      <Link
        href="/peta"
        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
      >
        Peta
      </Link>
    </>
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled || isMenuOpen
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 w-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient"
        >
          LaporWarga
        </Link>

        {/* Navigasi Desktop */}
        {/* Navigasi Desktop */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Beranda
            </Link>
            <Link
              href="/laporan-publik"
              className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Laporan
            </Link>
            <Link
              href="/peta"
              className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Peta
            </Link>
          </div>
          {user ? (
            <div className="relative group">
              <button className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md hover:scale-105 transition-transform duration-200">
                {user.email?.charAt(0).toUpperCase()}
              </button>
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    Signed in as
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  href="/profil/laporan-saya"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Laporan Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-5 py-2 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm shadow-md hover:bg-blue-100 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Tombol Hamburger Menu Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Tampilan Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg animate-slide-in">
          <div className="flex flex-col items-center gap-4 px-4 py-6">
            <NavLinks />
            <div className="my-3 h-px w-full bg-gray-200"></div>
            {user ? (
              <div className="w-full">
                <div className="w-full text-center border-b border-gray-200 pb-4 mb-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Signed in as
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/profil/laporan-saya"
                    className="w-full flex items-center gap-2 px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Laporan Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center rounded-full px-4 py-3 text-sm font-semibold text-gray-700 bg-white/80 shadow-md hover:bg-blue-100 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center rounded-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes slide-in {
          from {
            transform: translateY(-10%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
