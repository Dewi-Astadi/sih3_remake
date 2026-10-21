import { NextResponse } from "next/server";

/**
 * Same-origin CSV download for one pos.
 *
 * The homepage links here instead of pointing at the backend, so the public
 * HTML never exposes the internal API host. The request is proxied server-side
 * to `GET /pos/{id}/export?format=csv`.
 */

const API_BASE_URL =
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { success: false, message: "ID pos tidak valid." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${API_BASE_URL}/pos/${id}/export?format=csv`, {
      headers: { Accept: "text/csv, application/json" },
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") ?? "";

    if (!upstream.ok || contentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Berkas CSV untuk pos ini tidak tersedia pada server data.",
        },
        { status: upstream.status === 404 ? 404 : 502 }
      );
    }

    const disposition = upstream.headers.get("content-disposition");

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        ...(disposition ? { "Content-Disposition": disposition } : {}),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(`[export] Gagal mengunduh CSV pos #${id}:`, error);
    return NextResponse.json(
      { success: false, message: "Gagal menghubungi server data." },
      { status: 502 }
    );
  }
}
