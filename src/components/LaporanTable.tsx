"use client";

import { Laporan } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, MouseEvent, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { updateLaporanStatus, deleteLaporan } from "@/app/actions";

// Komponen untuk Badge Status yang konsisten
const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses =
    "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
  let colorClasses = "";
  switch (status) {
    case "Dilaporkan":
      colorClasses = "bg-yellow-100 text-yellow-800";
      break;
    case "Dikerjakan":
      colorClasses = "bg-blue-100 text-blue-800";
      break;
    case "Selesai":
      colorClasses = "bg-green-100 text-green-800";
      break;
    case "Ditolak":
      colorClasses = "bg-red-100 text-red-800";
      break;
    default:
      colorClasses = "bg-gray-100 text-gray-800";
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

// Komponen Portal (Pintu Ajaib)
function DropdownPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Pastikan document ada sebelum createPortal, untuk menghindari error SSR
  return mounted
    ? createPortal(children, document.getElementById("dropdown-portal")!)
    : null;
}

// Tipe Props untuk komponen tabel kita (dengan tambahan paginasi)
type LaporanTableProps = {
  laporans: (Laporan & { profiles: { full_name: string | null } | null })[];
  currentPage: number;
  totalPages: number;
};

export default function LaporanTable({
  laporans,
  currentPage,
  totalPages,
}: LaporanTableProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  

  // --- LOGIKA SEARCH & DEBOUNCING ---
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set('q', searchTerm);
      } else {
        params.delete('q');
      }
      // Selalu reset ke halaman 1 saat melakukan pencarian baru
      params.set('page', '1');
      router.replace(`${pathname}?${params.toString()}`);
    }, 500); // Tunggu 500ms setelah user berhenti mengetik

    return () => clearTimeout(timer); // Bersihkan timer jika user mengetik lagi
  }, [searchTerm, pathname, router, searchParams]);

  const handleStatusUpdate = async (id: string, status: string) => {
    setIsLoading(id);
    const result = await updateLaporanStatus(id, status);
    if (result?.error) {
      alert(`Error: ${result.error}`);
    }
    setIsLoading(null);
    setOpenDropdown(null);
  };

  const handleDelete = async (id: string) => {
    const confirmation = window.confirm(
      "Apakah Anda yakin ingin menghapus laporan ini secara permanen?"
    );
    if (confirmation) {
      setIsLoading(id);
      const result = await deleteLaporan(id);
      if (result?.error) {
        alert(`Error: ${result.error}`);
      }
      setIsLoading(null);
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      const button = buttonRefs.current[id];
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX - 224 + rect.width, // 224 = lebar dropdown (w-56)
        });
        setOpenDropdown(id);
      }
    }
  };

  useEffect(() => {
    const closeDropdown = () => setOpenDropdown(null);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Cari laporan berdasarkan kategori atau deskripsi..."
          className="w-full rounded-md border-gray-300 pl-10 pr-4 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

        {/* Tabel Laporan */}
        <div className="overflow-x-auto rounded-lg bg-white shadow ring-1 ring-gray ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Pelapor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Kategori
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {laporans?.map((laporan) => (
                <tr
                  key={laporan.id}
                  className={`transition-opacity ${
                    isLoading === laporan.id ? "opacity-40" : ""
                  }`}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {laporan.profiles?.full_name || "User Dihapus"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {laporan.kategori}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(laporan.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <StatusBadge status={laporan.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      ref={(el) => {
                        buttonRefs.current[laporan.id] = el;
                      }}
                      onClick={(e) => toggleDropdown(e, laporan.id)}
                      className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                      disabled={!!isLoading}
                    >
                      {isLoading === laporan.id ? (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                      ) : (
                        <MoreVertical className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginasi Dinamis */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
          <Link
            href={`/admin?page=${currentPage - 1}`}
            className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
              currentPage <= 1 ? "pointer-events-none opacity-50" : ""
            }`}
            aria-disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Link>
          <p className="text-sm text-gray-500">
            Halaman <strong>{currentPage}</strong> dari{" "}
            <strong>{totalPages || 1}</strong>
          </p>
          <Link
            href={`/admin?page=${currentPage + 1}`}
            className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Dropdown Portal */}
      {openDropdown && dropdownPos && (
        <DropdownPortal>
          <div
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              zIndex: 50,
            }}
            className="w-56 rounded-md shadow-lg bg-white ring-1 ring-gray ring-opacity-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              <Link
                href={`/lapor/${openDropdown}`}
                target="_blank"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Lihat Detail
              </Link>
              <div className="my-1 h-px bg-gray-200"></div>
              <button
                onClick={() => handleStatusUpdate(openDropdown, "Dikerjakan")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Set &apos;Dikerjakan&apos;
              </button>
              <button
                onClick={() => handleStatusUpdate(openDropdown, "Selesai")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Set &apos;Selesai&apos;
              </button>
              <button
                onClick={() => handleStatusUpdate(openDropdown, "Ditolak")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Set &apos;Ditolak&apos;
              </button>
              <div className="my-1 h-px bg-gray-200"></div>
              <button
                onClick={() => handleDelete(openDropdown)}
                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Hapus Laporan
              </button>
            </div>
          </div>
        </DropdownPortal>
      )}
    </>
  );
}
