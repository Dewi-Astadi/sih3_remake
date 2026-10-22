"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dokumen } from "@/lib/types";
import { getDokumenDownloadUrl } from "@/lib/api";
import {
  ExternalLink,
  Download,
  FileText,
  Calendar,
  HardDrive,
  DownloadCloud,
} from "lucide-react";
import { toast } from "sonner";

export interface PdfViewerDialogProps {
  dokumen: Dokumen | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (dokumen: Dokumen) => void;
}

/**
 * Format ukuran berkas dalam byte menjadi format yang mudah dibaca (KB / MB)
 */
export function formatFileSize(bytes?: number | string | null): string {
  if (bytes === null || bytes === undefined || bytes === "") return "-";

  // The API sometimes returns a preformatted size ("6.2 MB") instead of a byte
  // count, so pass those through rather than failing on arithmetic.
  if (typeof bytes === "string") {
    const trimmed = bytes.trim();
    if (!/^\d+(\.\d+)?$/.test(trimmed)) return trimmed;
    bytes = Number(trimmed);
  }

  if (!bytes || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

/**
 * Format label dan warna badge kategori publikasi
 */
export function getCategoryBadgeProps(kategori?: string) {
  const cat = (kategori || "").toLowerCase();
  switch (cat) {
    case "regulasi":
      return {
        label: "Regulasi",
        className: "bg-slate-900 text-white border-transparent hover:bg-slate-800",
      };
    case "sop":
      return {
        label: "SOP Teknis",
        className: "bg-amber-100 text-amber-900 border-amber-300 font-medium hover:bg-amber-200",
      };
    case "buletin":
      return {
        label: "Buletin",
        className: "bg-emerald-100 text-emerald-900 border-emerald-300 font-medium hover:bg-emerald-200",
      };
    case "laporan":
      return {
        label: "Laporan",
        className: "bg-sky-100 text-sky-900 border-sky-300 font-medium hover:bg-sky-200",
      };
    default:
      return {
        label: kategori || "Dokumen",
        className: "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200",
      };
  }
}

export function PdfViewerDialog({
  dokumen,
  open,
  onOpenChange,
  onDownload,
}: PdfViewerDialogProps) {
  // Menghitung URL dokumen PDF untuk embed dan download
  const pdfUrl = useMemo(() => {
    if (!dokumen) return "";
    if (
      dokumen.file_path &&
      (dokumen.file_path.startsWith("http://") ||
        dokumen.file_path.startsWith("https://") ||
        dokumen.file_path.startsWith("/"))
    ) {
      return dokumen.file_path;
    }
    return getDokumenDownloadUrl(dokumen.id);
  }, [dokumen]);

  // Handler unduh berkas
  const handleDownloadClick = () => {
    if (!dokumen) return;

    if (onDownload) {
      onDownload(dokumen);
      return;
    }

    toast.success(`Mengunduh dokumen: ${dokumen.judul}`, {
      description: `Ukuran: ${formatFileSize(dokumen.file_size)} • Format: PDF`,
    });

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${dokumen.nomor_dokumen || "dokumen"}-${dokumen.judul}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!dokumen) return null;

  const categoryBadge = getCategoryBadgeProps(dokumen.kategori);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-4xl w-full p-4 sm:p-6 max-h-[94vh] flex flex-col gap-4">
        {/* 1. Header: Judul Dokumen, Badge Kategori, & Tombol Buka Tab Baru */}
        <DialogHeader className="mb-1 space-y-2 border-b border-slate-100 pb-3 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={categoryBadge.className}>
              {categoryBadge.label}
            </Badge>

            {dokumen.nomor_dokumen && (
              <Badge variant="outline" className="text-slate-600 bg-slate-50 font-mono text-xs">
                {dokumen.nomor_dokumen}
              </Badge>
            )}

            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Tahun {dokumen.tahun}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-950 leading-snug line-clamp-2">
              {dokumen.judul}
            </DialogTitle>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors shrink-0 w-fit"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Tab Baru</span>
            </a>
          </div>
        </DialogHeader>

        {/* 2. Body: Viewer PDF interaktif menggunakan <object> dengan fallback link unduh */}
        <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-[65vh] rounded-md block bg-white"
            aria-label={`Pratinjau PDF ${dokumen.judul}`}
          >
            {/* Fallback bila peramban tidak mendukung embed PDF native */}
            <div className="flex flex-col items-center justify-center h-[65vh] p-6 text-center space-y-4 bg-slate-50">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h4 className="text-base font-bold text-slate-900">
                  Pratinjau PDF Tidak Tersedia di Browser Ini
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Peramban Anda tidak mendukung penayangan dokumen PDF interaktif secara langsung di halaman. Anda tetap dapat membaca dokumen ini dengan membukanya di tab baru atau mengunduhnya ke perangkat.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka di Tab Baru
                </a>
                <Button
                  onClick={handleDownloadClick}
                  className="gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" />
                  Unduh Dokumen PDF
                </Button>
              </div>
            </div>
          </object>
        </div>

        {/* 3. Footer: Keterangan ukuran berkas, tombol unduh langsung, & tombol tutup */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              Ukuran berkas: <strong className="text-slate-800">{formatFileSize(dokumen.file_size)}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1">
              Format: <strong className="text-slate-800 uppercase">{dokumen.file_extension || "pdf"}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1">
              <DownloadCloud className="w-3.5 h-3.5 text-slate-400" />
              Diunduh: <strong className="text-slate-800">{dokumen.download_count ?? 0}x</strong>
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs sm:text-sm"
            >
              Tutup
            </Button>
            <Button
              type="button"
              onClick={handleDownloadClick}
              className="gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm shadow-sm"
            >
              <Download className="w-4 h-4" />
              Unduh PDF Langsung
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
