"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { getExportUrl, getPosTimeseries } from "@/lib/api";
import type { Pengukuran, Pos } from "@/lib/types";

type Format = "csv" | "xlsx";
type Preset = "7d" | "30d" | "90d" | "all";

const PRESETS: Array<{ id: Preset; label: string; days: number | null }> = [
  { id: "7d", label: "7 hari", days: 7 },
  { id: "30d", label: "30 hari", days: 30 },
  { id: "90d", label: "90 hari", days: 90 },
  { id: "all", label: "Semua", days: null },
];

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function rangeFor(preset: Preset): { start_date?: string; end_date?: string } {
  const days = PRESETS.find((p) => p.id === preset)?.days;
  if (!days) return {};
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 3600 * 1000);
  return { start_date: isoDate(start), end_date: isoDate(end) };
}

/**
 * Download panel for one pos. It shows the period, the number of rows that will
 * be exported, and a small preview, so nobody downloads blind — the previous UI
 * fired a request straight from a dropdown and always exported the full series.
 */
export function DownloadDrawer({
  pos,
  onClose,
}: {
  pos: Pos | null;
  onClose: () => void;
}) {
  const [preset, setPreset] = useState<Preset>("all");
  const [format, setFormat] = useState<Format>("csv");
  const [rowCount, setRowCount] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const open = pos !== null;

  // Escape closes; focus moves into the panel when it opens.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const periodLabel = useMemo(() => {
    if (preset === "all") return "Seluruh rekaman tersedia";
    const range = rangeFor(preset);
    const fmt = (value?: string) =>
      value
        ? new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "—";
    return `${fmt(range.start_date)} – ${fmt(range.end_date)}`;
  }, [preset]);

  function handleDownload() {
    if (!pos) return;
    const url = getExportUrl(pos.id, format, rangeFor(preset));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${pos.kode_pos}_${preset}.${format}`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0A2140]/35 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-drawer-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-[#D5DBE3] bg-white transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Head */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E4E8EE] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B5CAD]">
              Unduh data
            </p>
            <h2
              id="download-drawer-title"
              className="mt-1 truncate text-[17px] font-semibold text-[#1B2430]"
            >
              {pos?.nama ?? "—"}
            </h2>
            <p className="mt-0.5 truncate text-[12px] text-[#5B6675]">
              {[pos?.kode_pos, pos?.das].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[#5B6675] hover:bg-[#F0F3F7] hover:text-[#1B2430]"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Tutup</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Period */}
          <p className="text-[13px] font-medium text-[#1B2430]">Periode</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRESETS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPreset(option.id)}
                aria-pressed={preset === option.id}
                className={`h-8 rounded-full border px-3 text-[13px] font-medium transition-colors ${
                  preset === option.id
                    ? "border-[#14396A] bg-[#14396A] text-white"
                    : "border-[#AEB8C5] bg-white text-[#1B2430] hover:bg-[#F0F3F7]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-[#5B6675]">{periodLabel}</p>

          {/* Row count + preview; remounts per period to refetch cleanly. */}
          {pos && (
            <PreviewPanel
              key={pos.id}
              posId={pos.id}
              preset={preset}
              onCountChange={setRowCount}
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-[#E4E8EE] px-5 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={rowCount === 0}
              onClick={() => {
                setFormat("csv");
                handleDownload();
              }}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[6px] bg-[#14396A] text-[13px] font-semibold text-white hover:bg-[#0E2A4E] disabled:opacity-40"
            >
              <FileText aria-hidden="true" className="h-4 w-4" />
              Unduh CSV
            </button>
            <button
              type="button"
              disabled={rowCount === 0}
              onClick={() => {
                setFormat("xlsx");
                handleDownload();
              }}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[6px] border border-[#AEB8C5] bg-white text-[13px] font-semibold text-[#1B2430] hover:bg-[#F0F3F7] disabled:opacity-40"
            >
              <FileSpreadsheet aria-hidden="true" className="h-4 w-4" />
              Unduh Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/**
 * Loads the full series once, then filters locally per period.
 *
 * Fetching per period would cost a request on every preset change, and it hides
 * a real trap: the archive may end months before today, so a "last 30 days"
 * window can be legitimately empty. Holding the whole series lets the panel
 * report the actual available range and the exact row count for any period.
 */
function PreviewPanel({
  posId,
  preset,
  onCountChange,
}: {
  posId: number;
  preset: Preset;
  onCountChange: (count: number | null) => void;
}) {
  const [series, setSeries] = useState<{ rows: Pengukuran[]; nowMs: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getPosTimeseries(posId, {})
      .then((res) => {
        // The clock is read once, when the data lands: reading it during render
        // would make the component impure and produce a different result on
        // every pass.
        if (active) setSeries({ rows: res.data ?? [], nowMs: Date.now() });
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [posId]);

  const filtered = useMemo(() => {
    if (!series) return [];
    const days = PRESETS.find((p) => p.id === preset)?.days;
    if (!days) return series.rows;
    const cutoff = series.nowMs - days * 24 * 3600 * 1000;
    return series.rows.filter((row) => new Date(row.recorded_at).getTime() >= cutoff);
  }, [series, preset]);

  useEffect(() => {
    onCountChange(series === null ? null : filtered.length);
  }, [series, filtered.length, onCountChange]);

  const preview = useMemo(() => {
    return [...filtered]
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
      .slice(0, 5);
  }, [filtered]);

  const available = useMemo(() => {
    if (!series || series.rows.length === 0) return null;
    const times = series.rows
      .map((row) => new Date(row.recorded_at).getTime())
      .filter((value) => Number.isFinite(value));
    if (times.length === 0) return null;
    const fmt = (ms: number) =>
      new Date(ms).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      });
    return { first: fmt(Math.min(...times)), last: fmt(Math.max(...times)) };
  }, [series]);

  return (
    <div className="mt-5 border-t border-[#E4E8EE] pt-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-medium text-[#1B2430]">Pratinjau</p>
        <span className="text-[12px] text-[#5B6675]">
          {series === null ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 aria-hidden="true" className="h-3 w-3 animate-spin" />
              memuat
            </span>
          ) : failed ? (
            "gagal dimuat"
          ) : (
            <>
              <strong className="font-semibold text-[#1B2430]">{filtered.length}</strong>{" "}
              baris
            </>
          )}
        </span>
      </div>

      {preview.length > 0 ? (
        <div className="mt-2 overflow-hidden rounded-[6px] border border-[#D5DBE3]">
          <table className="w-full text-[12px]">
            <caption className="sr-only">
              Lima rekaman terbaru pada periode terpilih
            </caption>
            <thead>
              <tr className="border-b border-[#D5DBE3] bg-[#F5F7FA] text-left text-[11px] uppercase tracking-wide text-[#5B6675]">
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Waktu (WIB)
                </th>
                <th scope="col" className="px-2 py-1.5 text-right font-semibold">
                  Nilai
                </th>
              </tr>
            </thead>
            <tbody>
              {preview.map((row) => (
                <tr key={row.id} className="border-b border-[#E4E8EE] last:border-b-0">
                  <td className="px-2 py-1.5 text-[#1B2430]">
                    {new Date(row.recorded_at).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Jakarta",
                    })}
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono tabular-nums text-[#14396A]">
                    {row.nilai !== null ? Number(row.nilai).toFixed(2) : "—"}{" "}
                    <span className="text-[#5B6675]">{row.satuan}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-2 rounded-[6px] border border-[#E4E8EE] bg-[#F5F7FA] px-3 py-4 text-center">
          <p className="text-[12px] text-[#5B6675]">
            {series === null
              ? "Memuat pratinjau…"
              : "Tidak ada rekaman pada periode ini."}
          </p>
          {available && (
            <p className="mt-1 text-[11px] text-[#8A96A6]">
              Data tersedia {available.first} – {available.last}. Pilih{" "}
              <strong className="font-semibold">Semua</strong> atau rentang yang
              mencakup tanggal tersebut.
            </p>
          )}
        </div>
      )}

      <p className="mt-2 text-[11px] leading-relaxed text-[#8A96A6]">
        {available
          ? `Tersedia ${available.first} – ${available.last}. Berkas memuat seluruh rekaman pada periode terpilih.`
          : "Berkas memuat seluruh rekaman pada periode terpilih."}
      </p>
    </div>
  );
}

export default DownloadDrawer;
