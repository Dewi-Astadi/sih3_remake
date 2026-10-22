import React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";

/**
 * Hero for the dataset and flood-routing pages. Same treatment as the homepage
 * hero (photo + dark tint) so the pages read as one product. The height is
 * fixed so a shorter description does not produce a visibly shorter hero.
 */
export function DatasetHero({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative flex min-h-[320px] items-center overflow-hidden bg-[#3A6EA5] py-12 sm:min-h-[330px] sm:py-16">
      <Image
        src="/images/hero-bendungan.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none select-none object-cover"
      />
      <div className="absolute inset-0 bg-[#0A2140]/78" />

      <Container className="relative">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F2A900]">
            {kicker}
          </p>
          <h1 className="mt-2 text-[28px] font-semibold leading-[1.2] tracking-[-0.015em] text-white sm:text-[36px] lg:text-[40px]">
            {title}
          </h1>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 mb-4 h-[3px] w-12 rounded-full bg-[#F2A900]"
          />
          <p className="mx-auto max-w-[620px] text-[14px] leading-relaxed text-[#C9D6E8] sm:text-[15px]">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}

export default DatasetHero;
