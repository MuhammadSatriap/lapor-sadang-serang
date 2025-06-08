// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-white border-t border-gray-200 ">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} LaporWarga. Semua hak dilindungi.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              
              <a href="https://github.com/MuhammadSatriap" className="hover:text-blue-600 transition">
                152021208 - Muhammad Satria
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  