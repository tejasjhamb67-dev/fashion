"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function Newsletter({ dark }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const { error } = await supabase.from("subscribers").insert({ email: email.trim().toLowerCase() });
    if (error && error.code !== "23505") {
      setState("error");
      setMsg("That did not go through. Check the address and try again.");
      return;
    }
    setState("done");
    setMsg("You're on the list. Welcome to the club.");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className={`flex items-center border-b ${dark ? "border-paper/40" : "border-ink/30"}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          disabled={state === "done"}
          className={`h-12 flex-1 bg-transparent text-[15px] outline-none ${dark ? "placeholder:text-paper/50" : "placeholder:text-muted"}`}
        />
        <button disabled={state === "busy" || state === "done"} className="label link-u py-2">
          {state === "busy" ? "Joining" : state === "done" ? "Joined" : "Join"}
        </button>
      </div>
      <p aria-live="polite" className={`mt-3 min-h-5 text-[13px] ${dark ? "text-paper/70" : "text-muted"}`}>
        {msg}
      </p>
    </form>
  );
}
