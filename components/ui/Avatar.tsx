const PALETTE = [
  "bg-ink-800 text-gold-300",
  "bg-gold-600 text-ink-950",
  "bg-ink-600 text-white",
  "bg-gold-100 text-gold-800",
];

export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toLocaleUpperCase("tr");
  const idx =
    name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    PALETTE.length;
  const sizeCls =
    size === "sm"
      ? "h-7 w-7 text-[10px]"
      : size === "lg"
        ? "h-12 w-12 text-base"
        : "h-9 w-9 text-xs";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${PALETTE[idx]} ${sizeCls}`}
    >
      {initials}
    </span>
  );
}
