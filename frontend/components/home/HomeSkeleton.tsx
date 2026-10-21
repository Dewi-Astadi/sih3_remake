import React from "react";
import { Container } from "@/components/layout/Container";

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">Memuat data pemantauan&hellip;</p>
      {/* Floating summary bar skeleton */}
      <div className="relative z-10 -mt-11">
        <Container>
          <div className="h-28 rounded-[8px] border border-[#D5DBE3] bg-white shadow-[0_2px_10px_rgba(14,42,78,0.08)]" />
        </Container>
      </div>

      {/* Monitoring cards skeleton */}
      <section className="py-14 bg-[#F5F7FA]">
        <Container>
          <div className="flex items-center justify-between mb-5">
            <div className="h-7 w-48 rounded bg-[#E4E8EE]" />
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-20 rounded-[6px] bg-[#E4E8EE]" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-64 rounded-[8px] border border-[#D5DBE3] bg-white p-5 animate-pulse"
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

export default HomeSkeleton;
