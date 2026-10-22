import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import type { FieldSummary } from "@/lib/homepage-data";
import { TIPE_DEFINITION, TIPE_LABEL } from "@/lib/homepage-data";

const SUB_CATEGORIES: Record<string, string> = {
  hidrologi: "Duga Air · Kualitas Air",
  hidrometeorologi: "Curah Hujan · Klimatologi",
  hidrogeologi: "Muka Air Tanah",
};

export function FieldsSection({ fields }: { fields: FieldSummary[] }) {
  return (
    <section className="border-t border-b border-[#D5DBE3] bg-white py-14">
      <Container>
        <h2 className="text-[26px] font-semibold tracking-[-0.01em] text-[#1B2430] mb-1.5">
          Tiga bidang data SIH3
        </h2>
        <p className="text-[14px] text-[#5B6675] mb-6">
          Komponen siklus air yang dipantau di Wilayah Sungai Serayu Opak.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {fields.map((field, index) => {
            const label = TIPE_LABEL[field.tipe];
            const subCategory = SUB_CATEGORIES[field.tipe] || "";
            const definition = TIPE_DEFINITION[field.tipe];

            return (
              <article
                key={field.tipe}
                data-reveal
                style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                className="flex flex-col justify-between rounded-[8px] border border-[#D5DBE3] bg-white p-[22px] transition-shadow hover:shadow-[0_2px_10px_rgba(14,42,78,0.08)]"
              >
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1B2430]">
                    {label}
                  </h3>
                  <div className="mt-1 mb-3 text-[13px] text-[#5B6675]">
                    {subCategory}
                  </div>
                  <p className="text-[14px] leading-relaxed text-[#5B6675] mb-4">
                    {definition}
                  </p>
                </div>

                <Link
                  href={`/${field.tipe}`}
                  className="inline-flex items-center text-[15px] font-medium text-[#0B5CAD] hover:text-[#14396A]"
                >
                  Lihat data {label.toLowerCase()} &rarr;
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default FieldsSection;
