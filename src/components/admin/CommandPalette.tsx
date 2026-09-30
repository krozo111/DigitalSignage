"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MediaIcon, PlaylistIcon, ScreenIcon, DashboardIcon, CloseIcon } from "@/components/icons";

const ACTIONS = [
  { label: "Go to Home", hint: "Overview", href: "/admin", icon: DashboardIcon },
  { label: "Upload media", hint: "Add images or videos", href: "/admin/media", icon: MediaIcon },
  { label: "New playlist", hint: "Build a playback sequence", href: "/admin/playlists?view=create", icon: PlaylistIcon },
  { label: "Pair screen", hint: "Connect a Smart TV", href: "/admin/screens", icon: ScreenIcon },
  { label: "Manage screens", hint: "View status and assignments", href: "/admin/screens", icon: ScreenIcon },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? ACTIONS.filter((action) => `${action.label} ${action.hint}`.toLowerCase().includes(normalized)) : ACTIONS;
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setActiveIndex(0);
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const run = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      run(results[activeIndex].href);
    }
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button, input")).filter((element) => !element.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button type="button" onClick={() => { setActiveIndex(0); setOpen(true); }} className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-md border border-surface-border bg-surface-sunken px-3 text-left lg:flex" aria-label="Open command palette">
        <span className="text-meta text-ink-soft" aria-hidden="true">⌕</span>
        <span className="h-8 min-w-0 flex-1 py-1.5 text-label text-ink-soft">Search actions…</span>
        <kbd className="text-meta text-ink-soft">⌘K</kbd>
      </button>
      <button type="button" onClick={() => { setActiveIndex(0); setOpen(true); }} className="rounded-md p-2 text-ink-muted hover:bg-surface-hover hover:text-ink lg:hidden" aria-label="Open search and actions">⌕</button>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-midnight-violet/35 px-4 pt-[12vh]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div className="w-full max-w-xl overflow-hidden rounded-lg border border-surface-border bg-surface-card shadow-[0_24px_70px_-24px_rgba(26,23,38,0.5)]" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={handleDialogKeyDown}>
            <div className="flex items-center gap-3 border-b border-surface-border px-4">
              <span className="text-ink-soft" aria-hidden="true">⌕</span>
              <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} onKeyDown={handleInputKeyDown} placeholder="Search actions…" className="h-12 min-w-0 flex-1 bg-transparent text-label text-ink outline-none placeholder:text-ink-soft" aria-label="Search actions" />
              <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1 text-ink-soft hover:bg-surface-hover hover:text-ink" aria-label="Close command palette"><CloseIcon size={16} /></button>
            </div>
            <div className="p-2" role="listbox" aria-label="Actions">
              {results.length === 0 ? <p className="px-3 py-8 text-center text-meta text-ink-muted">No actions match your search.</p> : results.map((action, index) => { const Icon = action.icon; return <button key={`${action.label}-${action.href}`} type="button" role="option" aria-selected={index === activeIndex} onMouseEnter={() => setActiveIndex(index)} onClick={() => run(action.href)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${index === activeIndex ? "bg-signal-mint/12 text-ink" : "text-ink-muted hover:bg-surface-hover"}`}><span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-sunken text-mint-ink"><Icon size={17} /></span><span className="min-w-0"><span className="block text-label">{action.label}</span><span className="block text-meta text-ink-soft">{action.hint}</span></span></button>; })}
            </div>
            <div className="border-t border-surface-border px-4 py-2 text-meta text-ink-soft">Use ↑ ↓ to navigate · Enter to open · Esc to close</div>
          </div>
        </div>
      )}
    </>
  );
}
