import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import type { FieldSummary } from "@/lib/homepage-data";
import { TIPE_LABEL } from "@/lib/homepage-data";
import { describeTimestamp } from "@/lib/datetime";

export function SummaryBlocks({
  fields,
  lastUpdated,
  now,
}: {
  fields: FieldSummary[];
  lastUpdated: string | null;
  now: Date;
}) {
  const updated = describeTimestamp(lastUpdated, now);

  let dateStr = "Belum tersedia";
  let timeStr = "";
  if (lastUpdated) {
    try {
      const d = new Date(lastUpdated);
      if (!isNaN(d.getTime())) {
        dateStr = d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        timeStr =
          d.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB";
      } else {
        dateStr = updated.text || "Belum tersedia";
      }
    } catch {
      dateStr = updated.text || "Belum tersedia";
    }
  }

  const fieldMap: Record<string, FieldSummary> = {};
  for (const f of fields) {
    fieldMap[f.tipe] = f;
  }
  const order = ["hidrologi", "hidrometeorologi", "hidrogeologi"] as const;

  return (
    <div data-reveal className="relative z-10 -mt-11">
      <Container>
        <div className="grid grid-cols-1 divide-y divide-[#E4E8EE] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 rounded-[8px] border border-[#D5DBE3] bg-white shadow-[0_2px_10px_rgba(14,42,78,0.08)]">
          {order.map((key) => {
            const field = fieldMap[key];
            const posCount = field?.posCount ?? 0;
            const agencyCount = field?.agencyCount ?? 0;
            const label = TIPE_LABEL[key] ?? key;

            return (
              <Link
                key={key}
                href={`/${key}`}
                className="group flex flex-col justify-between p-5 transition-colors hover:bg-[#F8FAFC]"
              >
                <div>
                  <div className="text-[13px] text-[#5B6675] group-hover:text-[#14396A]">
                    {label}
                  </div>
                  <div className="mt-1 text-[30px] font-semibold leading-[1.1] text-[#14396A]">
                    {posCount}
                  </div>
                </div>
                <div className="mt-2 text-[13px] text-[#5B6675]">
                  pos &middot; {agencyCount} walidata
                </div>
              </Link>
            );
          })}

          {/* Kolom 4: Pembaruan data terakhir */}
          <div className="flex flex-col justify-between p-5">
            <div>
              <div className="text-[13px] text-[#5B6675]">
                Pembaruan data terakhir
              </div>
              <div className="mt-2 text-[17px] font-semibold text-[#1B2430]">
                {dateStr}
              </div>
            </div>
            <div className="mt-2 text-[13px] text-[#5B6675]">
              {timeStr || (updated.ageText ? `(${updated.ageText})` : "")}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default SummaryBlocks;
