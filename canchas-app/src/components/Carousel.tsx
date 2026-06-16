import { useRef, useState } from "react";
import { CourtPhoto } from "./CourtPhoto";

type Fam = "futbol" | "padel" | "tenis";

export function Carousel({ sport }: { sport: Fam }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const go = (n: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * n, behavior: "smooth" });
  };
  return (
    <>
      <div className="vt-car" ref={ref} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {[0, 1, 2].map((s) => <div className="vt-slide" key={s}><CourtPhoto sport={sport} idx={s} /></div>)}
      </div>
      <button className="vt-arrow prev" onClick={() => go(Math.max(0, i - 1))} aria-label="Anterior">‹</button>
      <button className="vt-arrow next" onClick={() => go(Math.min(2, i + 1))} aria-label="Siguiente">›</button>
      <div className="vt-dots">{[0, 1, 2].map((d) => <i key={d} className={i === d ? "on" : ""} />)}</div>
    </>
  );
}
