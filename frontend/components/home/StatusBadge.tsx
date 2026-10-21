import React from "react";
import type { StatusResult, StatusTone } from "@/lib/status";

const TONE_CLASSES: Record<StatusTone, { badge: string; dot: string }> = {
  good: {
    badge: "bg-[#E6F4EA] text-[#14532D] border-[#86C79B]",
    dot: "rounded-full",
  },
  watch: {
    badge: "bg-[#FEF6D8] text-[#6B4E00] border-[#E5C34D]",
    dot: "rotate-45",
  },
  warning: {
    badge: "bg-[#FDEAD7] text-[#8A3B00] border-[#F0A15E]",
    dot: "rotate-45",
  },
  danger: {
    badge: "bg-[#FBE3E1] text-[#8B1A12] border-[#E88B84]",
    dot: "rounded-none",
  },
  neutral: {
    badge: "bg-[#EEF1F5] text-[#3D4756] border-[#C5CDD8]",
    dot: "h-[2px] w-[8px]",
  },
  "rain-light": {
    badge: "bg-[#E6F0FB] text-[#12467A] border-[#A9C8EC]",
    dot: "rounded-full",
  },
  "rain-moderate": {
    badge: "bg-[#CFE3F8] text-[#0E3A66] border-[#86B2E0]",
    dot: "rounded-full",
  },
  "rain-heavy": {
    badge: "bg-[#0E3A66] text-white border-[#0E3A66]",
    dot: "rounded-full",
  },
};

export function StatusBadge({ status }: { status: StatusResult }) {
  const style = TONE_CLASSES[status.tone] ?? TONE_CLASSES.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] border px-2 py-0.5 text-[13px] font-medium leading-tight ${style.badge}`}
    >
      <i
        aria-hidden="true"
        className={`inline-block h-2 w-2 shrink-0 bg-currentColor ${style.dot}`}
      />
      <span>{status.label}</span>
    </span>
  );
}

export default StatusBadge;
