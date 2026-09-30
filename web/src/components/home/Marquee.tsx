const items = ["Good clothes. Longer days.", "PICKLE Athletic Club", "Free shipping over ₹3,000", "Bombay — 19°04′N", "No particular talent required", "SS25 Collection"];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line bg-paper py-4">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="display text-[26px] italic">{t}</span>
            <span className="text-brass">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
