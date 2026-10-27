const S = '#5F7150'
const SL = '#7C906C'
const SP = '#A7B89B'
const PK = '#AE7882'
const PL = '#C9A2A9'

function Pot({ y = 102, w = 40, narrow = true }) {
  const x = 50 - w / 2
  const bx = narrow ? 6 : 4
  return (
    <>
      <path d={`M${x} ${y + 5} L${x + w} ${y + 5} L${x + w - bx} ${y + 24} L${x + bx} ${y + 24}Z`} fill="#F0E8DE" stroke="#E2D8CC" strokeWidth="0.8" />
      <rect x={x - 2} y={y} width={w + 4} height={5.5} rx="2" fill="#E2D8CC" stroke="#D6CCBE" strokeWidth="0.5" />
    </>
  )
}

function WidePot({ y = 105 }) {
  return (
    <>
      <path d="M25 110 L75 110 L71 126 L29 126Z" fill="#F0E8DE" stroke="#E2D8CC" strokeWidth="0.8" />
      <rect x="22" y={y} width="56" height="5.5" rx="2.5" fill="#E2D8CC" stroke="#D6CCBE" strokeWidth="0.5" />
    </>
  )
}

function HangPot({ y = 58 }) {
  return (
    <>
      <path d={`M32 ${y + 5} L68 ${y + 5} L65 ${y + 18} L35 ${y + 18}Z`} fill="#F0E8DE" stroke="#E2D8CC" strokeWidth="0.8" />
      <rect x="29" y={y} width="42" height="5.5" rx="2.5" fill="#E2D8CC" stroke="#D6CCBE" strokeWidth="0.5" />
      <path d={`M35 ${y} L50 ${y - 14} L65 ${y}`} stroke="#E2D8CC" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </>
  )
}


/* ─── Lavender ─── */
export function Lavender() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot />
      {/* Bushy base leaves */}
      <ellipse cx="50" cy="100" rx="18" ry="6" fill={SL} opacity="0.2" />
      {[36, 43, 50, 57, 64].map((x, i) => {
        const h = [55, 38, 30, 42, 52][i]
        const lean = [-3, -1, 0, 1, 2][i]
        return (
          <g key={i}>
            {/* Stem */}
            <path d={`M${x} 100 C${x + lean} ${h + 20}, ${x + lean * 1.5} ${h + 10}, ${x + lean * 2} ${h}`} stroke={S} strokeWidth="1" strokeLinecap="round" />
            {/* Flower cluster */}
            {[0, 4, 8, 12, 16].map((dy, j) => (
              <ellipse key={j} cx={x + lean * 2 + (j % 2 === 0 ? -1 : 1)} cy={h + dy} rx="3" ry="2.2" fill={PK} opacity={0.4 + j * 0.05} stroke={PK} strokeWidth="0.4" />
            ))}
          </g>
        )
      })}
      {/* Base leaves */}
      <path d="M50 100 C44 92, 34 90, 30 94" stroke={SL} strokeWidth="0.7" fill={SL} opacity="0.2" />
      <path d="M50 100 C56 92, 66 90, 70 94" stroke={SL} strokeWidth="0.7" fill={SL} opacity="0.2" />
    </svg>
  )
}


/* ─── Aloe Vera ─── */
export function AloeVera() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <WidePot />
      {/* Thick pointed leaves radiating from center */}
      {[
        { d: 'M50 105 C48 80, 42 55, 22 28', s: S, o: 0.5 },
        { d: 'M50 105 C52 80, 58 55, 78 28', s: S, o: 0.5 },
        { d: 'M50 105 C46 75, 36 50, 16 40', s: SL, o: 0.4 },
        { d: 'M50 105 C54 75, 64 50, 84 40', s: SL, o: 0.4 },
        { d: 'M50 105 C49 78, 44 55, 30 20', s: S, o: 0.45 },
        { d: 'M50 105 C51 78, 56 55, 70 20', s: S, o: 0.45 },
        { d: 'M50 105 C50 70, 50 45, 50 15', s: SL, o: 0.5 },
      ].map(({ d, s, o }, i) => (
        <path key={i} d={d} stroke={s} strokeWidth="3.5" strokeLinecap="round" opacity={o} fill="none" />
      ))}
      {/* Leaf edge teeth (subtle dots) */}
      {[30, 40, 50, 60, 70].map((y, i) => (
        <g key={i}>
          <circle cx={48 - (100 - y) * 0.12} cy={y} r="0.6" fill={S} opacity="0.3" />
          <circle cx={52 + (100 - y) * 0.12} cy={y} r="0.6" fill={S} opacity="0.3" />
        </g>
      ))}
    </svg>
  )
}


/* ─── Ball Cactus ─── */
export function BallCactus() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot y={100} w={34} narrow={false} />
      {/* Body sphere */}
      <ellipse cx="50" cy="72" rx="28" ry="30" fill={SL} opacity="0.2" stroke={S} strokeWidth="0.8" />
      {/* Ribs */}
      {[-20, -12, -4, 4, 12, 20].map((ox, i) => (
        <path key={i} d={`M${50 + ox} 44 C${50 + ox + 1} 62, ${50 + ox + 1} 82, ${50 + ox} 100`} stroke={S} strokeWidth="0.6" opacity="0.3" />
      ))}
      {/* Spines */}
      {[48, 56, 64, 72, 80, 88].map((y, i) => (
        <g key={i}>
          {[-18, -10, -2, 6, 14].map((ox, j) => {
            const cx = 50 + ox + ((y + j) % 3 - 1) * 2
            const cy = y + (j % 2) * 2
            if (cy > 98 || Math.hypot(cx - 50, cy - 72) > 28) return null
            return <circle key={j} cx={cx} cy={cy} r="0.5" fill={S} opacity="0.5" />
          })}
        </g>
      ))}
      {/* Small flower on top */}
      <circle cx="50" cy="42" r="5" fill={PL} opacity="0.5" stroke={PK} strokeWidth="0.5" />
      <circle cx="50" cy="42" r="2" fill={PK} opacity="0.5" />
      <path d="M47 40 C48 37, 50 36, 50 36 C50 36, 52 37, 53 40" stroke={PK} strokeWidth="0.5" opacity="0.5" fill={PL} fillOpacity="0.3" />
    </svg>
  )
}


/* ─── Orchid ─── */
export function Orchid() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={36} />
      {/* Wide leaves at base */}
      <path d="M50 104 C40 90, 20 85, 14 92" stroke={S} strokeWidth="1.8" strokeLinecap="round" fill={S} fillOpacity="0.15" />
      <path d="M50 104 C60 90, 80 85, 86 92" stroke={S} strokeWidth="1.8" strokeLinecap="round" fill={S} fillOpacity="0.15" />
      <path d="M50 104 C44 88, 28 80, 20 86" stroke={SL} strokeWidth="1.5" strokeLinecap="round" fill={SL} fillOpacity="0.1" />
      <path d="M50 104 C56 88, 72 80, 80 86" stroke={SL} strokeWidth="1.5" strokeLinecap="round" fill={SL} fillOpacity="0.1" />
      {/* Support stake */}
      <line x1="50" y1="102" x2="50" y2="20" stroke="#D6CCBE" strokeWidth="0.8" />
      {/* Arching stem */}
      <path d="M50 100 C50 70, 52 45, 72 22" stroke={S} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Flowers along arch */}
      {[
        { cx: 72, cy: 22 },
        { cx: 68, cy: 32 },
        { cx: 62, cy: 42 },
        { cx: 56, cy: 54 },
      ].map(({ cx, cy }, i) => (
        <g key={i}>
          {/* Outer petals */}
          <ellipse cx={cx} cy={cy - 4} rx="4.5" ry="6" fill={PK} opacity={0.3 + i * 0.05} stroke={PK} strokeWidth="0.5" />
          <ellipse cx={cx - 4} cy={cy + 1} rx="5" ry="3.5" fill={PL} opacity={0.35} stroke={PK} strokeWidth="0.4" transform={`rotate(-20 ${cx - 4} ${cy + 1})`} />
          <ellipse cx={cx + 4} cy={cy + 1} rx="5" ry="3.5" fill={PL} opacity={0.35} stroke={PK} strokeWidth="0.4" transform={`rotate(20 ${cx + 4} ${cy + 1})`} />
          {/* Center */}
          <circle cx={cx} cy={cy} r="1.8" fill={PK} opacity="0.5" />
        </g>
      ))}
    </svg>
  )
}


/* ─── Boston Fern ─── */
export function BostonFern() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={38} />
      {/* Fronds arching outward and down */}
      {[
        { path: 'M50 98 C46 70, 30 50, 10 55', color: S },
        { path: 'M50 98 C54 70, 70 50, 90 55', color: S },
        { path: 'M50 98 C44 65, 25 40, 5 48', color: SL },
        { path: 'M50 98 C56 65, 75 40, 95 48', color: SL },
        { path: 'M50 98 C48 60, 35 35, 18 30', color: S },
        { path: 'M50 98 C52 60, 65 35, 82 30', color: S },
        { path: 'M50 98 C50 55, 45 25, 35 15', color: SL },
        { path: 'M50 98 C50 55, 55 25, 65 15', color: SL },
        { path: 'M50 98 C49 50, 48 20, 50 8', color: S },
      ].map(({ path, color }, i) => (
        <g key={i}>
          <path d={path} stroke={color} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.5" />
          {/* Leaflets along frond — simplified */}
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((t, j) => {
            const pts = path.match(/[\d.]+/g).map(Number)
            const x = pts[0] * (1 - t) ** 3 + 3 * pts[2] * (1 - t) ** 2 * t + 3 * pts[4] * (1 - t) * t ** 2 + pts[6] * t ** 3
            const y = pts[1] * (1 - t) ** 3 + 3 * pts[3] * (1 - t) ** 2 * t + 3 * pts[5] * (1 - t) * t ** 2 + pts[7] * t ** 3
            return (
              <g key={j}>
                <line x1={x} y1={y} x2={x - 3 + (i % 2) * 6} y2={y - 3} stroke={color} strokeWidth="0.5" opacity="0.4" />
                <line x1={x} y1={y} x2={x + 3 - (i % 2) * 6} y2={y - 2} stroke={color} strokeWidth="0.5" opacity="0.35" />
              </g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}


/* ─── Pothos (trailing) ─── */
export function Pothos() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <HangPot y={20} />
      {/* Upward leaves from pot */}
      <path d="M45 20 C43 14, 38 8, 36 5" stroke={S} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M36 5 C33 3, 30 5, 32 9 C34 7, 36 5, 36 5Z" fill={S} opacity="0.4" stroke={S} strokeWidth="0.5" />
      <path d="M55 20 C57 14, 62 8, 64 5" stroke={SL} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M64 5 C67 3, 70 5, 68 9 C66 7, 64 5, 64 5Z" fill={SL} opacity="0.35" stroke={SL} strokeWidth="0.5" />
      {/* Trailing vines */}
      {[
        { vine: 'M40 38 C36 55, 28 75, 20 100', leaves: [[36, 50], [30, 65], [22, 82], [18, 95]], color: S },
        { vine: 'M50 38 C52 60, 48 85, 50 115', leaves: [[52, 55], [49, 72], [50, 90], [50, 108]], color: SL },
        { vine: 'M60 38 C64 55, 72 75, 80 100', leaves: [[64, 50], [70, 65], [76, 82], [80, 95]], color: S },
      ].map(({ vine, leaves, color }, i) => (
        <g key={i}>
          <path d={vine} stroke={color} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.5" />
          {leaves.map(([lx, ly], j) => {
            const side = (j + i) % 2 === 0 ? -1 : 1
            return (
              <path
                key={j}
                d={`M${lx} ${ly} C${lx + side * 6} ${ly - 4}, ${lx + side * 8} ${ly - 2}, ${lx + side * 5} ${ly + 3} C${lx + side * 3} ${ly + 5}, ${lx + side * 1} ${ly + 2}, ${lx} ${ly}Z`}
                fill={j === 2 && i === 1 ? SP : color}
                opacity={0.35 + j * 0.04}
                stroke={color}
                strokeWidth="0.5"
              />
            )
          })}
        </g>
      ))}
    </svg>
  )
}


/* ─── Rosemary ─── */
export function Rosemary() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={34} />
      {/* Woody stems */}
      {[
        { d: 'M50 102 C48 80, 42 55, 38 25', lean: -2 },
        { d: 'M50 102 C50 75, 50 45, 50 18', lean: 0 },
        { d: 'M50 102 C52 80, 58 55, 62 25', lean: 2 },
      ].map(({ d, lean }, i) => (
        <g key={i}>
          <path d={d} stroke="#8B7E6A" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
          {/* Needle leaves along stem */}
          {[30, 40, 50, 60, 70, 80, 90].map((y, j) => {
            const x = 50 + lean * (102 - y) / 30
            return (
              <g key={j}>
                <line x1={x} y1={y} x2={x - 5} y2={y - 3} stroke={S} strokeWidth="0.7" opacity="0.5" />
                <line x1={x} y1={y} x2={x + 5} y2={y - 3} stroke={S} strokeWidth="0.7" opacity="0.5" />
                <line x1={x} y1={y - 4} x2={x - 4} y2={y - 7} stroke={SL} strokeWidth="0.5" opacity="0.4" />
                <line x1={x} y1={y - 4} x2={x + 4} y2={y - 7} stroke={SL} strokeWidth="0.5" opacity="0.4" />
                {/* Small pink flowers on upper stems */}
                {y <= 40 && j % 2 === 0 && (
                  <circle cx={x + (j % 2 === 0 ? -4 : 4)} cy={y - 5} r="1.5" fill={PK} opacity="0.4" />
                )}
              </g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}


/* ─── Basil ─── */
export function Basil() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={34} />
      {/* Main stem */}
      <path d="M50 102 C50 80, 50 55, 50 25" stroke={S} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      {/* Branch stems */}
      <path d="M50 85 C44 78, 36 75, 30 76" stroke={S} strokeWidth="0.8" opacity="0.4" />
      <path d="M50 85 C56 78, 64 75, 70 76" stroke={S} strokeWidth="0.8" opacity="0.4" />
      <path d="M50 65 C44 58, 38 55, 32 58" stroke={S} strokeWidth="0.8" opacity="0.4" />
      <path d="M50 65 C56 58, 62 55, 68 58" stroke={S} strokeWidth="0.8" opacity="0.4" />
      {/* Broad oval leaves — paired */}
      {[
        [30, 76, -1], [70, 76, 1],
        [32, 58, -1], [68, 58, 1],
        [36, 45, -1], [64, 45, 1],
        [42, 32, -1], [58, 32, 1],
        [50, 22, 0],
      ].map(([lx, ly, side], i) => (
        <ellipse
          key={i}
          cx={lx + side * 4}
          cy={ly}
          rx="9"
          ry="6"
          fill={i % 3 === 0 ? S : SL}
          opacity={0.3 + (i % 2) * 0.1}
          stroke={S}
          strokeWidth="0.5"
          transform={`rotate(${side * 25} ${lx + side * 4} ${ly})`}
        />
      ))}
      {/* Tiny pink flower buds at top */}
      <path d="M50 22 C50 18, 49 14, 50 10" stroke={S} strokeWidth="0.7" opacity="0.4" strokeLinecap="round" />
      <circle cx="50" cy="9" r="2" fill={PK} opacity="0.45" />
      <circle cx="48" cy="7.5" r="1.2" fill={PL} opacity="0.35" />
      <circle cx="52" cy="7.5" r="1.2" fill={PL} opacity="0.35" />
    </svg>
  )
}


/* ─── Monstera ─── */
export function Monstera() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot />
      <path d="M50 102 C50 80, 49 55, 50 30" stroke={S} strokeWidth="1.5" strokeLinecap="round" />
      {/* Large split leaves */}
      <path d="M50 65 C38 55, 18 50, 12 58 C8 64, 20 72, 50 65Z" fill={S} opacity="0.4" stroke={S} strokeWidth="0.7" />
      <path d="M28 58 L32 64" stroke="#FEFCF9" strokeWidth="1" opacity="0.5" />
      <path d="M50 50 C62 38, 82 32, 88 42 C92 50, 78 56, 50 50Z" fill={SL} opacity="0.38" stroke={SL} strokeWidth="0.7" />
      <path d="M74 38 L70 45" stroke="#FEFCF9" strokeWidth="1" opacity="0.5" />
      <path d="M50 78 C60 72, 78 66, 82 74 C86 80, 72 84, 50 78Z" fill={S} opacity="0.35" stroke={S} strokeWidth="0.7" />
      <path d="M50 40 C40 28, 22 22, 18 32 C16 40, 34 42, 50 40Z" fill={SL} opacity="0.35" stroke={SL} strokeWidth="0.7" />
      <path d="M50 32 C56 20, 68 14, 72 22 C74 28, 62 32, 50 32Z" fill={S} opacity="0.4" stroke={S} strokeWidth="0.7" />
    </svg>
  )
}


/* ─── Snake Plant ─── */
export function SnakePlant() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={36} />
      {/* Tall upright sword leaves */}
      {[
        { x: 38, tip: 15, lean: -4 },
        { x: 44, tip: 8, lean: -1 },
        { x: 50, tip: 5, lean: 0 },
        { x: 56, tip: 10, lean: 1 },
        { x: 62, tip: 18, lean: 4 },
      ].map(({ x, tip, lean }, i) => (
        <g key={i}>
          <path
            d={`M${x} 102 C${x + lean * 0.3} 70, ${x + lean * 0.5} 40, ${x + lean} ${tip} L${x + lean + 0.5} ${tip - 2} L${x + lean + 3} ${tip + 3} C${x + lean + 3} 40, ${x + 3} 70, ${x + 3} 102Z`}
            fill={i % 2 === 0 ? S : SL}
            opacity={0.35 + (i === 2 ? 0.1 : 0)}
            stroke={S}
            strokeWidth="0.6"
          />
          {/* Horizontal bands */}
          {[30, 50, 70, 85].map((y, j) => (
            <line key={j} x1={x + lean * (102 - y) / 102} y1={y} x2={x + 3 + lean * (102 - y) / 102} y2={y} stroke={SP} strokeWidth="1.5" opacity="0.3" />
          ))}
        </g>
      ))}
      {/* Delicate flower spray from center */}
      <path d="M52 12 C54 6, 58 2, 62 0" stroke={S} strokeWidth="0.6" opacity="0.35" strokeLinecap="round" />
      <circle cx="62" cy="0" r="1.8" fill={PK} opacity="0.4" />
      <circle cx="59" cy="2" r="1.2" fill={PL} opacity="0.35" />
      <circle cx="64" cy="2.5" r="1" fill={PL} opacity="0.3" />
    </svg>
  )
}


/* ─── Peace Lily ─── */
export function PeaceLily() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot />
      {/* Leaves */}
      <path d="M50 102 C48 85, 40 65, 22 45 C18 52, 32 75, 50 102Z" fill={S} opacity="0.4" stroke={S} strokeWidth="0.7" />
      <path d="M50 102 C52 85, 60 65, 78 45 C82 52, 68 75, 50 102Z" fill={S} opacity="0.4" stroke={S} strokeWidth="0.7" />
      <path d="M50 102 C46 80, 32 55, 15 38 C12 46, 30 72, 50 102Z" fill={SL} opacity="0.35" stroke={SL} strokeWidth="0.7" />
      <path d="M50 102 C54 80, 68 55, 85 38 C88 46, 70 72, 50 102Z" fill={SL} opacity="0.35" stroke={SL} strokeWidth="0.7" />
      <path d="M50 102 C50 75, 50 50, 50 28" stroke={S} strokeWidth="1" strokeLinecap="round" />
      {/* White spathe flower */}
      <path d="M50 32 C42 22, 36 14, 40 8 C44 4, 50 10, 50 18 C50 10, 56 4, 60 8 C64 14, 58 22, 50 32Z" fill="#FAF6F1" opacity="0.7" stroke={SP} strokeWidth="0.8" />
      {/* Spadix */}
      <path d="M50 30 C50 24, 50 18, 50 12" stroke={PK} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <circle cx="50" cy="11" r="1.5" fill={PK} opacity="0.5" />
    </svg>
  )
}


/* ─── Succulent / Echeveria ─── */
export function Succulent() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <WidePot y={95} />
      {/* Rosette petals — outer ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 50 + Math.cos(rad) * 22
        const cy = 78 + Math.sin(rad) * 12
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="12"
            ry="7"
            fill={i % 2 === 0 ? SL : SP}
            opacity="0.35"
            stroke={S}
            strokeWidth="0.5"
            transform={`rotate(${angle + 90} ${cx} ${cy})`}
          />
        )
      })}
      {/* Inner ring */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 50 + Math.cos(rad) * 10
        const cy = 78 + Math.sin(rad) * 6
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="8"
            ry="5"
            fill={i % 2 === 0 ? S : SL}
            opacity="0.35"
            stroke={S}
            strokeWidth="0.5"
            transform={`rotate(${angle + 90} ${cx} ${cy})`}
          />
        )
      })}
      {/* Center */}
      <circle cx="50" cy="78" r="5" fill={S} opacity="0.3" stroke={S} strokeWidth="0.5" />
      {/* Pink tips on petals */}
      <circle cx="50" cy="64" r="2" fill={PK} opacity="0.4" />
      <circle cx="66" cy="72" r="1.8" fill={PK} opacity="0.35" />
      <circle cx="34" cy="72" r="1.8" fill={PK} opacity="0.35" />
      <circle cx="72" cy="80" r="1.5" fill={PL} opacity="0.3" />
      <circle cx="28" cy="80" r="1.5" fill={PL} opacity="0.3" />
    </svg>
  )
}


/* ─── Fiddle Leaf Fig ─── */
export function FiddleLeaf() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={32} />
      {/* Trunk */}
      <path d="M50 102 C50 80, 50 55, 50 25" stroke="#8B7E6A" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Large rounded/fiddle leaves */}
      <path d="M50 35 C38 25, 22 18, 18 28 C14 38, 28 44, 50 35Z" fill={S} opacity="0.45" stroke={S} strokeWidth="0.7" />
      <path d="M50 35 C62 25, 78 18, 82 28 C86 38, 72 44, 50 35Z" fill={S} opacity="0.4" stroke={S} strokeWidth="0.7" />
      <path d="M50 55 C36 48, 18 42, 14 52 C10 62, 30 64, 50 55Z" fill={SL} opacity="0.4" stroke={SL} strokeWidth="0.7" />
      <path d="M50 55 C64 48, 82 42, 86 52 C90 62, 70 64, 50 55Z" fill={SL} opacity="0.38" stroke={SL} strokeWidth="0.7" />
      <path d="M50 75 C38 68, 24 64, 20 72 C16 80, 34 80, 50 75Z" fill={S} opacity="0.35" stroke={S} strokeWidth="0.7" />
      <path d="M50 75 C62 68, 76 64, 80 72 C84 80, 66 80, 50 75Z" fill={S} opacity="0.35" stroke={S} strokeWidth="0.7" />
    </svg>
  )
}


/* ─── String of Pearls (trailing) ─── */
export function StringOfPearls() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <HangPot y={18} />
      {/* Short leaves on top */}
      <path d="M46 18 C44 12, 40 8, 38 10" stroke={SL} strokeWidth="0.8" opacity="0.4" />
      <path d="M54 18 C56 12, 60 8, 62 10" stroke={SL} strokeWidth="0.8" opacity="0.4" />
      {/* Trailing strings with pearl beads */}
      {[
        { path: 'M38 36 C34 55, 26 80, 18 110', pearls: [42, 52, 62, 72, 82, 92, 102] },
        { path: 'M45 36 C43 58, 38 85, 35 118', pearls: [44, 55, 66, 77, 88, 99, 110] },
        { path: 'M50 36 C50 60, 50 90, 50 125', pearls: [45, 56, 67, 78, 89, 100, 112] },
        { path: 'M55 36 C57 58, 62 85, 65 118', pearls: [44, 55, 66, 77, 88, 99, 110] },
        { path: 'M62 36 C66 55, 74 80, 82 110', pearls: [42, 52, 62, 72, 82, 92, 102] },
      ].map(({ path, pearls }, i) => {
        const pts = path.match(/[\d.]+/g).map(Number)
        return (
          <g key={i}>
            <path d={path} stroke={S} strokeWidth="0.6" fill="none" opacity="0.3" />
            {pearls.map((t_y, j) => {
              const t = (t_y - pts[1]) / (pts[7] - pts[1])
              const x = pts[0] * (1 - t) ** 3 + 3 * pts[2] * (1 - t) ** 2 * t + 3 * pts[4] * (1 - t) * t ** 2 + pts[6] * t ** 3
              return (
                <circle
                  key={j}
                  cx={x}
                  cy={t_y}
                  r={2.2 + (j % 2) * 0.3}
                  fill={j % 5 === 0 ? SL : S}
                  opacity={0.35 + j * 0.02}
                  stroke={S}
                  strokeWidth="0.4"
                />
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}


/* ─── Spider Plant ─── */
export function SpiderPlant() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={36} />
      {/* Central tuft of long arching leaves */}
      {[
        'M50 100 C42 70, 15 50, 5 58',
        'M50 100 C58 70, 85 50, 95 58',
        'M50 100 C44 65, 20 35, 10 42',
        'M50 100 C56 65, 80 35, 90 42',
        'M50 100 C48 60, 30 25, 22 28',
        'M50 100 C52 60, 70 25, 78 28',
        'M50 100 C50 55, 42 20, 40 14',
        'M50 100 C50 55, 58 20, 60 14',
      ].map((d, i) => (
        <path key={i} d={d} stroke={i % 2 === 0 ? S : SL} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={0.4 + (i < 4 ? 0.05 : 0)} />
      ))}
      {/* White stripe on center leaves */}
      {['M50 100 C49 65, 40 30, 38 18', 'M50 100 C51 65, 60 30, 62 18'].map((d, i) => (
        <path key={i} d={d} stroke={SP} strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.35" />
      ))}
      {/* Small plantlet on a runner */}
      <path d="M10 58 C8 65, 6 72, 10 78" stroke={S} strokeWidth="0.6" opacity="0.35" />
      <circle cx="10" cy="78" r="3" fill={SL} opacity="0.25" stroke={S} strokeWidth="0.4" />
      {/* Tiny pink flowers on runner */}
      <circle cx="8" cy="68" r="1.3" fill={PK} opacity="0.4" />
      <circle cx="12" cy="72" r="1" fill={PL} opacity="0.35" />
    </svg>
  )
}


/* ─── ZZ Plant ─── */
export function ZZPlant() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={36} />
      {/* Upright stems with paired glossy leaves */}
      {[
        { sx: 38, lean: -6, leaves: [90, 78, 66, 54, 42, 30] },
        { sx: 50, lean: 0, leaves: [88, 74, 60, 46, 32, 20] },
        { sx: 62, lean: 6, leaves: [90, 78, 66, 54, 42, 30] },
      ].map(({ sx, lean, leaves }, i) => (
        <g key={i}>
          <path d={`M${sx} 102 C${sx + lean * 0.3} 70, ${sx + lean * 0.6} 40, ${sx + lean} ${leaves[leaves.length - 1] - 5}`} stroke={S} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
          {leaves.map((ly, j) => {
            const lx = sx + lean * (102 - ly) / 102
            return (
              <g key={j}>
                <ellipse cx={lx - 5} cy={ly} rx="6" ry="3.5" fill={j % 2 === 0 ? S : SL} opacity="0.35" stroke={S} strokeWidth="0.4" transform={`rotate(-15 ${lx - 5} ${ly})`} />
                <ellipse cx={lx + 5} cy={ly} rx="6" ry="3.5" fill={j % 2 === 0 ? SL : S} opacity="0.35" stroke={S} strokeWidth="0.4" transform={`rotate(15 ${lx + 5} ${ly})`} />
              </g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}


/* ─── Rubber Plant (Ficus Elastica) ─── */
export function RubberPlant() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={34} />
      <path d="M50 102 C50 78, 50 50, 50 22" stroke="#8B7E6A" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      {/* Large oval dark leaves */}
      {[
        { y: 30, side: -1, color: S },
        { y: 30, side: 1, color: S },
        { y: 48, side: -1, color: SL },
        { y: 48, side: 1, color: SL },
        { y: 66, side: -1, color: S },
        { y: 66, side: 1, color: S },
        { y: 82, side: -1, color: SL },
        { y: 82, side: 1, color: SL },
      ].map(({ y, side, color }, i) => (
        <ellipse
          key={i}
          cx={50 + side * 16}
          cy={y}
          rx="14"
          ry="8"
          fill={color}
          opacity="0.38"
          stroke={color}
          strokeWidth="0.6"
          transform={`rotate(${side * 20} ${50 + side * 16} ${y})`}
        />
      ))}
      {/* New leaf (pink) unfurling at top */}
      <path d="M50 22 C48 16, 44 12, 46 8 C48 10, 50 14, 50 22Z" fill={PK} opacity="0.5" stroke={PK} strokeWidth="0.6" />
    </svg>
  )
}


/* ─── Jade Plant ─── */
export function JadePlant() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot w={34} />
      {/* Thick woody trunk */}
      <path d="M50 102 C50 85, 50 70, 50 55" stroke="#8B7E6A" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
      <path d="M50 55 C45 50, 38 45, 32 40" stroke="#8B7E6A" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M50 55 C55 50, 62 45, 68 40" stroke="#8B7E6A" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M50 70 C44 65, 36 60, 28 58" stroke="#8B7E6A" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <path d="M50 70 C56 65, 64 60, 72 58" stroke="#8B7E6A" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      {/* Thick oval succulent leaves at branch tips */}
      {[
        [32, 40], [28, 34], [36, 32], [24, 28],
        [68, 40], [72, 34], [64, 32], [76, 28],
        [28, 58], [22, 54], [32, 52],
        [72, 58], [78, 54], [68, 52],
        [50, 48], [46, 42], [54, 42],
      ].map(([lx, ly], i) => (
        <ellipse key={i} cx={lx} cy={ly} rx="5.5" ry="4" fill={i % 3 === 0 ? S : SL} opacity="0.4" stroke={S} strokeWidth="0.4" />
      ))}
      {/* Tiny pink star flowers at branch tips */}
      {[[24, 24], [76, 24], [50, 44]].map(([fx, fy], i) => (
        <g key={`f${i}`}>
          <circle cx={fx} cy={fy} r="2" fill={PK} opacity="0.45" />
          <circle cx={fx - 2.5} cy={fy - 1} r="1.2" fill={PL} opacity="0.4" />
          <circle cx={fx + 2.5} cy={fy - 1} r="1.2" fill={PL} opacity="0.4" />
          <circle cx={fx} cy={fy - 3} r="1.2" fill={PL} opacity="0.4" />
        </g>
      ))}
    </svg>
  )
}


/* ─── Default / Generic Plant ─── */
export function GenericPlant() {
  return (
    <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
      <Pot />
      <path d="M50 102 C50 75, 49 50, 50 25" stroke={S} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M50 70 C40 62, 24 58, 18 65 C14 72, 30 74, 50 70Z" fill={S} opacity="0.4" stroke={S} strokeWidth="0.7" />
      <path d="M50 55 C60 45, 78 40, 82 48 C86 56, 70 58, 50 55Z" fill={SL} opacity="0.38" stroke={SL} strokeWidth="0.7" />
      <path d="M50 82 C58 76, 72 72, 76 78 C80 84, 66 86, 50 82Z" fill={S} opacity="0.35" stroke={S} strokeWidth="0.7" />
      <path d="M50 42 C42 32, 28 26, 22 34 C18 42, 36 44, 50 42Z" fill={SL} opacity="0.35" stroke={SL} strokeWidth="0.7" />
      <path d="M50 32 C56 22, 66 16, 70 24 C72 30, 60 32, 50 32Z" fill={S} opacity="0.4" stroke={S} strokeWidth="0.7" />
      <path d="M50 28 C48 20, 44 14, 46 8 C48 12, 50 18, 50 28Z" fill={PK} opacity="0.4" stroke={PK} strokeWidth="0.5" />
    </svg>
  )
}


/* ─── Matcher ─── */

const PLANT_MAP = [
  { keys: ['lavender', 'לבנדר'], Comp: Lavender },
  { keys: ['aloe', 'אלוורה', 'אלו ורה'], Comp: AloeVera },
  { keys: ['cactus', 'קקטוס'], Comp: BallCactus },
  { keys: ['orchid', 'סחלב'], Comp: Orchid },
  { keys: ['fern', 'שרך', 'בוסטון'], Comp: BostonFern },
  { keys: ['pothos', 'פוטוס', 'photos'], Comp: Pothos },
  { keys: ['rosemary', 'רוזמרין'], Comp: Rosemary },
  { keys: ['basil', 'בזיליקום', 'ריחן'], Comp: Basil },
  { keys: ['monstera', 'מונסטרה'], Comp: Monstera },
  { keys: ['snake', 'סנסווירה', 'חרב'], Comp: SnakePlant },
  { keys: ['peace lily', 'ספטיפילום', 'שושן שלום'], Comp: PeaceLily },
  { keys: ['succulent', 'סוקולנט', 'אכוורה', 'echeveria'], Comp: Succulent },
  { keys: ['fiddle', 'פיקוס כינורי', 'לירטה'], Comp: FiddleLeaf },
  { keys: ['string of pearls', 'שרשרת פנינים', 'senecio'], Comp: StringOfPearls },
  { keys: ['spider', 'כלורופיטום', 'עכביש'], Comp: SpiderPlant },
  { keys: ['zz', 'zamioculcas', 'זמיוקולקס'], Comp: ZZPlant },
  { keys: ['rubber', 'פיקוס גומי', 'elastica'], Comp: RubberPlant },
  { keys: ['jade', 'קרסולה', 'crassula'], Comp: JadePlant },
]

export function getPlantIllustration(name) {
  const lower = (name || '').toLowerCase()
  const match = PLANT_MAP.find(({ keys }) => keys.some(k => lower.includes(k)))
  if (match) return <match.Comp />
  return <GenericPlant />
}
