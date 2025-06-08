// File: src/app/login/page.tsx (VERSI FINAL & FUNGSIONAL)

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
// ... di dalam komponennya
const supabase = createClient();
import { LogIn, LoaderCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }
      
      // Jika login berhasil, arahkan ke halaman utama
      //router.push('/');
      router.push('/');

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan tak dikenal.');
      }
    }
    
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Selamat Datang Kembali
          </h1>
          <p className="mt-2 text-slate-600">
            Silakan masuk untuk melanjutkan.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Alamat Email
            </label>
            <div className="mt-1">
              <input
                id="email" name="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password" name="password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm text-slate-900" // <-- TAMBAHKAN DI SINI
              />
            </div>
          </div>

          <div>
            <button
              type="submit" disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isLoading ? (
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
          {error && (<div className="mt-4 rounded-md bg-red-50 p-3"><p className="text-sm font-medium text-red-700">{error}</p></div>)}
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}