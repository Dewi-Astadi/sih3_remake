"use client";

import { useEffect } from "react";

const REVEAL_DURATION = 520;
const REVEAL_EASING = "cubic-bezier(0.22, 0.61, 0.36, 1)";

/**
 * Reveals elements marked with `data-reveal` as they scroll into view.
 *
 * The animation runs through the Web Animations API instead of a class toggle,
 * so no attribute changes during hydration. Streamed Suspense boundaries arrive
 * after mount, so a MutationObserver picks up elements that appear later.
 *
 * Each element is animated once and then released; nothing stays observed.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const done = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          if (done.has(element)) continue;
          done.add(element);

          const delay = Number.parseFloat(
            element.style.getPropertyValue("--reveal-delay")
          );

          element.animate(
            [
              { opacity: 0, transform: "translate3d(0, 18px, 0)" },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration: REVEAL_DURATION,
              delay: Number.isFinite(delay) ? delay : 0,
              easing: REVEAL_EASING,
              fill: "forwards",
            }
          );
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    const observeAll = (root: ParentNode) => {
      for (const element of root.querySelectorAll("[data-reveal]")) {
        if (!done.has(element)) observer.observe(element);
      }
    };

    observeAll(document);

    // Content streamed in by Suspense mounts after this effect runs.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.hasAttribute("data-reveal")) observer.observe(node);
          observeAll(node);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}

export default RevealOnScroll;
