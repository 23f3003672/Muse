"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [, startTransition] = useTransition();

  // Reset/Complete progress bar on navigation completion
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept internal link clicks for 0ms instantaneous feedback
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, mailto, tel, downloads, or same-page anchor tags (#)
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's an internal route
      const isInternal =
        href.startsWith("/") ||
        href.startsWith(window.location.origin);

      if (isInternal) {
        // Compare target path with current path
        const currentUrl = window.location.pathname + window.location.search;
        const targetUrl = href.replace(window.location.origin, "");

        if (currentUrl === targetUrl) return;

        // Start progress immediately
        setVisible(true);
        setProgress(28);

        startTransition(() => {
          setTimeout(() => setProgress(65), 100);
          setTimeout(() => setProgress(85), 300);
        });
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        opacity: visible ? 1 : 0,
        background: "linear-gradient(90deg, #c87355 0%, #f4ccaf 50%, #5f3f33 100%)",
        boxShadow: "0 0 10px rgba(200, 115, 85, 0.6), 0 0 4px rgba(244, 204, 175, 0.8)",
      }}
    >
      {/* Glowing tip */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#f4ccaf] blur-[2px] opacity-90" />
    </div>
  );
}

export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressContent />
    </Suspense>
  );
}
