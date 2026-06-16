import { STAR } from "./icons";

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <span className="vt-stars" style={{ ["--s" as any]: size + "px" }}>
      <span className="base">{stars.map((i) => <svg key={i} viewBox="0 0 20 20"><path d={STAR} /></svg>)}</span>
      <span className="fill" style={{ width: (value / 5) * 100 + "%" }}>
        {stars.map((i) => <svg key={i} viewBox="0 0 20 20"><path d={STAR} /></svg>)}
      </span>
    </span>
  );
}
