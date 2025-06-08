// File: src/app/signup/page.tsx (Desain Konsisten)

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UserPlus, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok!');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        setSuccess('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Buat Akun Baru
          </h1>
          <p className="mt-2 text-slate-600">
            Daftar untuk mulai melaporkan masalah di lingkungan Anda.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <div className="mt-1">
              <input id="full-name" name="full-name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full rounded-md border-gray-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Alamat Email</label>
            <div className="mt-1">
              <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-gray-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <div className="mt-1">
              <input id="password" name="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border-gray-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">Konfirmasi Password</label>
            <div className="mt-1">
              <input id="confirm-password" name="confirm-password" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-md border-gray-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
          </div>

          <div>
            <button
              type="submit" disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isLoading ? (<LoaderCircle className="mr-2 h-5 w-5 animate-spin" />) : (<UserPlus className="mr-2 h-5 w-5" />)}
              {isLoading ? 'Mendaftarkan...' : 'Daftar'}
            </button>
          </div>
          {error && (<div className="rounded-md bg-red-50 p-4"><p className="text-sm font-medium text-red-800">{error}</p></div>)}
          {success && (<div className="rounded-md bg-green-50 p-4"><p className="text-sm font-medium text-green-800">{success}</p></div>)}
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}