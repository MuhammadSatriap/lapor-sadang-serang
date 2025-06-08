// File: src/components/Header.tsx (VERSI UPGRADE)

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { LogIn, LogOut, UserPlus, Menu, X, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  // Efek untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek untuk memantau status login
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getInitialSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Refresh halaman untuk memastikan server tahu kita sudah logout
  };

  const NavLinks = () => (
    <>
     
    </>
  );

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
          LaporWarga
        </Link>
        
        {/* Navigasi Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* Tombol Auth Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative group">
              <button className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                {user.email?.charAt(0).toUpperCase()}
              </button>
              {/* Bagian Dropdown Desktop SESUDAH */}
<div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
  <div className="px-4 py-2">
      <p className="text-sm font-medium text-gray-900">Signed in as</p>
      <p className="text-sm text-gray-500 truncate">{user.email}</p>
  </div>
  <div className="my-1 h-px bg-gray-100"></div>
  {/* INI DIA LINK BARUNYA */}
  <Link href="/profil/laporan-saya" className="w-full text-left inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
    <LayoutDashboard className="h-4 w-4" />
    Laporan Saya
  </Link>
  {/* AKHIR DARI LINK BARU */}
  <div className="my-1 h-px bg-gray-100"></div>
  <button
    onClick={handleLogout}
    className="w-full text-left inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
  >
    <LogOut className="h-4 w-4" />
    Logout
  </button>
</div>
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Login
              </Link>
              <Link href="/signup" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Tombol Hamburger Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Tampilan Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-4">
          <div className="flex flex-col items-center gap-4">
            <NavLinks />
            <div className="my-2 h-px w-full bg-gray-200"></div>
             {user ? (
              <>
                <div className="w-full px-4">
    <div className="w-full text-center border-b pb-4 mb-4">
        <p className="text-sm font-medium text-gray-900">Signed in as</p>
        <p className="text-sm text-gray-500 truncate">{user.email}</p>
    </div>
    <div className="space-y-2">
        {/* INI DIA LINK BARUNYA */}
        <Link href="/profil/laporan-saya" className="w-full text-left inline-flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md">
            <LayoutDashboard className="h-5 w-5" />
            Laporan Saya
        </Link>
        <button
            onClick={handleLogout}
            className="w-full text-left inline-flex items-center gap-2 px-4 py-2 text-base text-red-600 hover:bg-red-50 rounded-md"
        >
            <LogOut className="h-5 w-5" />
            Logout
        </button>
    </div>
</div>
              </>
             ) : (
              <>
                <Link href="/login" className="w-full text-center rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  Login
                </Link>
                <Link href="/signup" className="w-full text-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
             )}
          </div>
        </div>
      )}
    </header>
  );
}