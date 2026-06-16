type Fam = "futbol" | "padel" | "tenis";

const THEMES: Record<Fam, { sky: [string, string]; grass: [string, string]; lights: number }[]> = {
  futbol: [
    { sky: ["#bfe6f7", "#7fb4dc"], grass: ["#2f7d49", "#1d5331"], lights: 0 },
    { sky: ["#f5a85a", "#5a3f7a"], grass: ["#266a3e", "#143f27"], lights: 0.55 },
    { sky: ["#0c1a28", "#0a2236"], grass: ["#1c5e38", "#0f3a23"], lights: 1 },
  ],
  padel: [
    { sky: ["#cfeefb", "#8ec9e8"], grass: ["#1c6e94", "#0f4f6e"], lights: 0 },
    { sky: ["#f5a85a", "#5a3f7a"], grass: ["#185f80", "#0c4760"], lights: 0.55 },
    { sky: ["#0c1a28", "#0a2236"], grass: ["#15688f", "#0c4760"], lights: 1 },
  ],
  tenis: [
    { sky: ["#bfe6f7", "#7fb4dc"], grass: ["#b35a32", "#8a3f20"], lights: 0 },
    { sky: ["#f5a85a", "#5a3f7a"], grass: ["#9c4a28", "#6e3018"], lights: 0.55 },
    { sky: ["#0c1a28", "#0a2236"], grass: ["#8a4324", "#5c2814"], lights: 1 },
  ],
};
const stripePts = (i: number) => {
  const tl = 72 + i * 44, tr = 72 + (i + 1) * 44, bl = i * 80, br = (i + 1) * 80;
  return `${bl},150 ${br},150 ${tr},72 ${tl},72`;
};

export function CourtPhoto({ sport, idx }: { sport: Fam; idx: number }) {
  const t = THEMES[sport][idx];
  const uid = sport + idx;
  const white = "rgba(255,255,255,.7)";
  return (
    <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={"sky" + uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.sky[0]} /><stop offset="1" stopColor={t.sky[1]} /></linearGradient>
        <linearGradient id={"gr" + uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.grass[0]} /><stop offset="1" stopColor={t.grass[1]} /></linearGradient>
        <radialGradient id={"gl" + uid}><stop offset="0" stopColor="#fff3c4" stopOpacity={t.lights} /><stop offset="1" stopColor="#fff3c4" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="80" fill={`url(#sky${uid})`} />
      {t.lights > 0 && <><circle cx="46" cy="34" r="42" fill={`url(#gl${uid})`} /><circle cx="274" cy="34" r="42" fill={`url(#gl${uid})`} /></>}
      <polygon points="0,150 320,150 248,72 72,72" fill={`url(#gr${uid})`} />
      {sport === "futbol" && [0, 1, 2, 3].map((i) => <polygon key={i} opacity="0.1" fill={i % 2 ? "#fff" : "#000"} points={stripePts(i)} />)}
      {sport === "futbol" ? (
        <>
          <line x1="160" y1="72" x2="160" y2="150" stroke={white} strokeWidth="1.4" />
          <ellipse cx="160" cy="116" rx="40" ry="15" stroke={white} strokeWidth="1.4" fill="none" />
          <rect x="150" y="64" width="20" height="9" stroke={white} strokeWidth="1.2" fill="none" />
          {idx === 2 && <circle cx="206" cy="132" r="6" fill="#fff" />}
        </>
      ) : sport === "padel" ? (
        <>
          <polygon points="72,72 248,72 250,69 70,69" fill="rgba(255,255,255,.15)" />
          <line x1="36" y1="150" x2="92" y2="72" stroke="rgba(255,255,255,.25)" strokeWidth="2" />
          <line x1="284" y1="150" x2="228" y2="72" stroke="rgba(255,255,255,.25)" strokeWidth="2" />
          <line x1="20" y1="118" x2="300" y2="118" stroke={white} strokeWidth="2" strokeDasharray="3 3" />
          <line x1="118" y1="72" x2="58" y2="150" stroke={white} strokeWidth="1.2" />
          <line x1="202" y1="72" x2="262" y2="150" stroke={white} strokeWidth="1.2" />
        </>
      ) : (
        <>
          <line x1="20" y1="118" x2="300" y2="118" stroke={white} strokeWidth="2" strokeDasharray="3 3" />
          <line x1="160" y1="72" x2="160" y2="118" stroke={white} strokeWidth="1.2" />
          <line x1="70" y1="100" x2="250" y2="100" stroke={white} strokeWidth="1.2" />
          <line x1="86" y1="72" x2="40" y2="150" stroke={white} strokeWidth="1.2" />
          <line x1="234" y1="72" x2="280" y2="150" stroke={white} strokeWidth="1.2" />
        </>
      )}
      {t.lights > 0 && (
        <>
          <line x1="46" y1="74" x2="46" y2="30" stroke="#2a3340" strokeWidth="3" /><rect x="38" y="25" width="16" height="7" rx="2" fill="#fff3c4" />
          <line x1="274" y1="74" x2="274" y2="30" stroke="#2a3340" strokeWidth="3" /><rect x="266" y="25" width="16" height="7" rx="2" fill="#fff3c4" />
        </>
      )}
    </svg>
  );
}
