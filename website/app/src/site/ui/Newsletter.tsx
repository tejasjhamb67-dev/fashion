import { useId, useState, type FormEvent } from "react";

import { subscribe } from "@/lib/api/store.functions";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; message: string } | { kind: "error"; message: string };

/** Newsletter sign-up, set like a hotel register line. */
export function Newsletter({ source = "footer", tone = "light" }: { source?: string; tone?: "light" | "dark" }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const id = useId();
  const dark = tone === "dark";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ kind: "error", message: "That address does not look complete." });
      return;
    }
    setState({ kind: "sending" });
    try {
      const res = await subscribe({ data: { email, source } });
      if (res.ok) {
        form.reset();
        setState({ kind: "done", message: res.message });
      } else {
        setState({ kind: "error", message: res.message });
      }
    } catch {
      setState({ kind: "error", message: "That did not go through. Please try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor={id} className={`pk-micro block ${dark ? "text-chalk/70" : "text-slate-ink"}`}>
        Enter your email to receive match dispatches
      </label>
      <div className={`mt-3 flex items-end border-b ${dark ? "border-chalk/40" : "border-navy"}`}>
        <span className={`pk-micro pb-3 pr-3 ${dark ? "text-chalk/50" : "text-slate-ink"}`} aria-hidden>
          No.
        </span>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="name@address.com"
          className={`h-12 min-w-0 flex-1 bg-transparent font-serif text-xl outline-none ${dark ? "placeholder:text-chalk/30" : "placeholder:text-slate-ink/40"}`}
          aria-describedby={`${id}-status`}
        />
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className={`pk-button-type h-12 px-2 transition-colors duration-[180ms] disabled:opacity-50 ${dark ? "hover:text-amber-faded" : "hover:text-cricket"}`}
        >
          {state.kind === "sending" ? "Signing" : "Sign in →"}
        </button>
      </div>
      <p id={`${id}-status`} role="status" className={`pk-micro mt-3 min-h-4 ${state.kind === "error" ? "text-stamp" : dark ? "text-chalk/70" : "text-cricket"}`}>
        {state.kind === "done" || state.kind === "error" ? state.message : ""}
      </p>
    </form>
  );
}
