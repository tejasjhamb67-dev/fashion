import { useEffect, useRef, type ReactNode } from "react";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right" | "bottom";
  children: ReactNode;
  footer?: ReactNode;
  widthClass?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Slide-over sheet with real modal behaviour: focus moves in, Tab is trapped,
 * Escape and the veil close it, focus returns to the opener, page scroll locks.
 * Stays mounted so the 350ms slide can play both ways.
 */
export function Drawer({ open, onClose, title, side = "right", children, footer, widthClass = "w-full sm:w-[400px]" }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("pk-scroll-lock");
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("pk-scroll-lock");
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const position =
    side === "right"
      ? `right-0 top-0 h-dvh ${widthClass} border-l ${open ? "translate-x-0" : "translate-x-full"}`
      : side === "left"
        ? `left-0 top-0 h-dvh ${widthClass} border-r ${open ? "translate-x-0" : "-translate-x-full"}`
        : `inset-x-0 bottom-0 max-h-[85dvh] border-t ${open ? "translate-y-0" : "translate-y-full"}`;

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-navy/20 transition-opacity duration-300 ease-[var(--ease-pickle)] motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        inert={!open}
        className={`absolute flex flex-col border-stone bg-chalk shadow-none outline-none transition-transform duration-[350ms] ease-[var(--ease-pickle)] motion-reduce:transition-none ${position}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone px-5">
          <h2 className="pk-utility">{title}</h2>
          <button type="button" onClick={onClose} className="pk-micro pk-ink-hover -mr-3 flex h-12 min-w-12 items-center justify-center px-3">
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? <div className="shrink-0 border-t border-stone">{footer}</div> : null}
      </div>
    </div>
  );
}
