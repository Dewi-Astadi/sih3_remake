"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@bbwsserayuopak.id");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast.success("Login berhasil! Mengalihkan ke Panel Admin...");
      router.push("/admin");
    } else {
      setErrorMsg(res.message || "Gagal masuk. Periksa kembali email dan password Anda.");
      toast.error(res.message || "Gagal masuk.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F4F6F9]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-[#D5DBE3]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#0A2140]/10 flex items-center justify-center text-[#0A2140]">
              <ShieldCheck className="w-9 h-9 text-[#14396A]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0E2A4E]">
            Masuk Panel Admin SIH3
          </h2>
          <p className="mt-2 text-sm text-[#5B6675]">
            Sistem Informasi Hidrologi, Hidrometeorologi, & Hidrogeologi
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-3.5 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">{errorMsg}</div>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-[#1B2430] mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email Anda"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#14396A] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B2430] mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi Anda"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#14396A] focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0E2A4E] hover:bg-[#14396A] text-white text-sm font-semibold shadow-md transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs text-[#5B6675] hover:text-[#0E2A4E] hover:underline"
          >
            &larr; Kembali ke Beranda SIH3
          </Link>
        </div>
      </div>
    </div>
  );
}

