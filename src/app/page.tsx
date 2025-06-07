// File: src/app/page.tsx

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-5xl font-extrabold text-blue-600">
        WORKSHOP LAPOR WARGA!
      </h1>
      <p className="mt-4 text-xl text-gray-700">
        Aplikasi ini sudah online berkat Vercel & GitHub!
        <br />
        (Update ini dilakukan pada pukul {new Date().toLocaleTimeString('id-ID')} WIB)
      </p>
    </main>
  );
}