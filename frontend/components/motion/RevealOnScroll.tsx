"use client";

import { useEffect } from "react";

const REVEAL_DURATION = 520;
const REVEAL_EASING = "cubic-bezier(0.22, 0.61, 0.36, 1)";
/** Fraction of the viewport height an element must reach before it reveals. */
const TRIGGER_RATIO = 0.92;

/**
 * Reveals elements marked with `data-reveal` as they scroll into view.
 *
 * The animation runs through the Web Animations API instead of a class toggle,
 * so no attribute changes during hydration.
 *
 * A rAF-throttled sweep drives everything rather than an IntersectionObserver:
 * an observer never fires for an element that jumps from below the fold to
 * above it in one frame (fast wheel, scrollbar drag, anchor jump), and its
 * registrations go stale when React replaces list nodes.
 *
 * The sweep only walks a pending list, not the document, so a scroll frame
 * touches at most a handful of elements and costs nothing once the page has
 * been read through. The list is rebuilt only when React mounts new nodes.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pending: HTMLElement[] = [];
    const revealed = new WeakSet<Element>();

    const reveal = (element: HTMLElement) => {
      if (revealed.has(element)) return;
      revealed.add(element);

      const delay = Number.parseFloat(element.style.getPropertyValue("--reveal-delay"));

      // The end state is written as inline styles rather than kept via
      // `fill: "forwards"`: a finished animation with no JS reference can be
      // garbage collected, which drops the fill and snaps the element back to
      // the CSS `opacity: 0` rule.
      const settle = () => {
        element.style.opacity = "1";
        element.style.transform = "none";
      };

      const animation = element.animate(
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

      animation.finished.then(settle).catch(settle);
    };

    const sweep = () => {
      if (pending.length === 0) return;

      const limit = window.innerHeight * TRIGGER_RATIO;
      const next: HTMLElement[] = [];

      for (const element of pending) {
        // React may have replaced the node since the list was built.
        if (!element.isConnected) continue;
        if (element.getBoundingClientRect().top < limit) {
          reveal(element);
        } else {
          next.push(element);
        }
      }

      pending = next;
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sweep();
      });
    };

    /** Rebuilds the pending list; only runs when new nodes appear. */
    const collect = () => {
      pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
        (element) => !revealed.has(element)
      );
      schedule();
    };

    collect();

    // Content streamed in by Suspense, or re-rendered by a filter, mounts later.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length > 0) {
          collect();
          return;
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      mutations.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

export default RevealOnScroll;
