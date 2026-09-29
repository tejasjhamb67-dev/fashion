import { useId, useMemo, useState, type FormEvent, type InputHTMLAttributes } from "react";

import { submitReview, type Review } from "@/lib/api/store.functions";
import { formatDate, pad } from "../format";

const FITS = ["Runs small", "True to size", "Runs large", "One size fits"] as const;

function Stars({ value, label }: { value: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label ?? `${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 12 12" className={`size-3 ${n <= Math.round(value) ? "text-navy" : "text-stone-deep"}`} aria-hidden>
          <rect x="1" y="1" width="10" height="10" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

export function RatingSummary({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return <span className="pk-micro text-slate-ink">No reviews yet</span>;
  const real = reviews.filter((r) => !r.isSample);
  if (real.length === 0) {
    return (
      <a href="#reviews" className="pk-micro pk-link inline-flex text-slate-ink">
        Pre-launch // {pad(reviews.length)} sample {reviews.length === 1 ? "review" : "reviews"}
      </a>
    );
  }
  const avg = real.reduce((s, r) => s + r.rating, 0) / real.length;
  return (
    <a href="#reviews" className="pk-micro pk-link inline-flex items-center gap-2 text-slate-ink">
      <Stars value={avg} />
      <span>
        {avg.toFixed(1)} // {pad(real.length)} {real.length === 1 ? "review" : "reviews"}
      </span>
    </a>
  );
}

type FormState = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string } | { kind: "done" };

export function Reviews({ slug, productName, initial, available }: { slug: string; productName: string; initial: Review[]; available: boolean }) {
  const [reviews, setReviews] = useState(initial);
  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<FormState>({ kind: "idle" });
  const formId = useId();

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const fit = new Map<string, number>();
    for (const r of reviews) if (r.fit) fit.set(r.fit, (fit.get(r.fit) ?? 0) + 1);
    const topFit = [...fit.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    return { total, avg, topFit, samples: reviews.filter((r) => r.isSample).length };
  }, [reviews]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (rating < 1) {
      setState({ kind: "error", message: "Choose a rating from one to five." });
      return;
    }
    const payload = {
      slug,
      author: String(fd.get("author") ?? "").trim(),
      city: String(fd.get("city") ?? "").trim(),
      rating,
      fit: String(fd.get("fit") ?? "True to size") as (typeof FITS)[number],
      title: String(fd.get("title") ?? "").trim(),
      body: String(fd.get("body") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
    };
    if (payload.author.length < 2 || payload.title.length < 3 || payload.body.length < 20) {
      setState({ kind: "error", message: "Add your name, a title, and at least a couple of sentences." });
      return;
    }
    setState({ kind: "sending" });
    try {
      const res = await submitReview({ data: payload });
      if (!res.ok) {
        setState({ kind: "error", message: res.error });
        return;
      }
      setReviews((prev) => [res.review, ...prev]);
      form.reset();
      setRating(0);
      setState({ kind: "done" });
      setWriting(false);
    } catch {
      setState({ kind: "error", message: "Your review did not save. Please check the fields and try again." });
    }
  }

  return (
    <section id="reviews" aria-labelledby={`${formId}-h`} className="scroll-mt-24">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16">
        <div>
          <p className="pk-micro text-slate-ink">Match report // {productName}</p>
          <h2 id={`${formId}-h`} className="pk-h1 mt-3">
            Reviews
          </h2>
          <dl className="mt-8 grid grid-cols-3 border-l border-t border-stone">
            <div className="border-b border-r border-stone p-3">
              <dt className="pk-micro text-slate-ink">Average</dt>
              <dd className="pk-h2 mt-1">{stats.total ? stats.avg.toFixed(1) : "0.0"}</dd>
            </div>
            <div className="border-b border-r border-stone p-3">
              <dt className="pk-micro text-slate-ink">Reviews</dt>
              <dd className="pk-h2 mt-1">{pad(stats.total)}</dd>
            </div>
            <div className="border-b border-r border-stone p-3">
              <dt className="pk-micro text-slate-ink">Fit</dt>
              <dd className="mt-2 text-sm">{stats.topFit ?? "Unscored"}</dd>
            </div>
          </dl>
          {stats.samples > 0 ? (
            <p className="pk-micro mt-4 border border-stone bg-cream p-3 text-slate-ink">
              Pre-launch: reviews marked Sample are placeholders written by the studio, not customers. They disappear when real reviews arrive.
            </p>
          ) : null}
          {available ? (
            <button
              type="button"
              onClick={() => {
                setWriting((w) => !w);
                setState({ kind: "idle" });
              }}
              aria-expanded={writing}
              aria-controls={`${formId}-form`}
              className="pk-button-type mt-6 flex h-12 w-full items-center justify-center border border-navy transition-colors duration-[180ms] hover:bg-navy hover:text-chalk"
            >
              {writing ? "Close the form" : "Write a review"}
            </button>
          ) : (
            <p className="pk-micro mt-6 text-slate-ink">Reviews are resting for a moment. Check back shortly.</p>
          )}
          {state.kind === "done" ? (
            <p role="status" className="pk-micro mt-3 text-cricket">
              Thank you. Your review is now on the scorecard.
            </p>
          ) : null}
        </div>

        <div>
          {writing ? (
            <form id={`${formId}-form`} onSubmit={onSubmit} noValidate className="pk-fade mb-10 space-y-5 border border-stone bg-cream p-5 md:p-6">
              <fieldset>
                <legend className="pk-micro mb-2 text-slate-ink">Your rating</legend>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} of 5`}
                      onClick={() => setRating(n)}
                      className={`pk-price flex size-12 items-center justify-center border transition-colors ${
                        n <= rating ? "border-navy bg-navy text-chalk" : "border-stone bg-chalk hover:border-navy"
                      }`}
                    >
                      {pad(n)}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" name="author" autoComplete="given-name" required maxLength={40} />
                <Field label="City (optional)" name="city" autoComplete="address-level2" maxLength={40} />
              </div>
              <label className="block">
                <span className="pk-micro text-slate-ink">Fit</span>
                <select name="fit" defaultValue="True to size" className="mt-2 h-12 w-full border border-stone bg-chalk px-3 text-sm">
                  {FITS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </label>
              <Field label="Title" name="title" required maxLength={80} />
              <label className="block">
                <span className="pk-micro text-slate-ink">Review</span>
                <textarea
                  name="body"
                  required
                  minLength={20}
                  maxLength={1200}
                  rows={5}
                  className="mt-2 w-full border border-stone bg-chalk p-3 text-sm outline-none focus:border-navy"
                />
              </label>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              {state.kind === "error" ? (
                <p role="alert" className="pk-micro border border-stone bg-chalk p-3 text-stamp">
                  {state.message}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={state.kind === "sending"}
                className="pk-button-type flex h-12 w-full items-center justify-center bg-navy text-chalk transition-colors duration-[180ms] hover:bg-cricket disabled:opacity-60"
              >
                {state.kind === "sending" ? "Filing your report" : "Submit review"}
              </button>
            </form>
          ) : null}

          {reviews.length === 0 ? (
            <div className="border border-dashed border-stone-deep p-8">
              <p className="pk-h3">No reports filed yet.</p>
              <p className="mt-2 text-sm text-slate-ink">Own this already? Be the first to say how it wears.</p>
            </div>
          ) : (
            <ol className="divide-y divide-stone border-y border-stone">
              {reviews.map((r, i) => (
                <li key={r.id} className="grid gap-4 py-6 md:grid-cols-[9rem_1fr]">
                  <div className="space-y-1.5">
                    <p className="pk-micro text-slate-ink">No. {pad(reviews.length - i)}</p>
                    <Stars value={r.rating} />
                    <p className="pk-micro">{r.author}</p>
                    {r.city ? <p className="pk-micro text-slate-ink">{r.city}</p> : null}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="pk-utility">{r.title}</h3>
                      {r.isSample ? <span className="pk-stamp pk-stamp--red pk-micro">Sample</span> : null}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{r.body}</p>
                    <p className="pk-micro mt-3 text-slate-ink">
                      {r.fit ? `Fit: ${r.fit} // ` : ""}
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...input }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="pk-micro text-slate-ink">{label}</span>
      <input {...input} className="mt-2 h-12 w-full border border-stone bg-chalk px-3 text-sm outline-none focus:border-navy" />
    </label>
  );
}
