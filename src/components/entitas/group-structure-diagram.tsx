import type { EntityEntry } from '@/lib/content-types';

const WIDTH = 960;
const CORE_Y = 150;
const BOX_W = 190;
const BOX_H = 74;

export function GroupStructureDiagram({ entities }: { entities: EntityEntry[] }) {
  const core = entities.filter((entity) => entity.lini === 'inti').sort((a, b) => a.urutan - b.urutan);
  const supporting = entities.filter((entity) => entity.lini === 'penunjang');

  const gap = (WIDTH - core.length * BOX_W) / (core.length + 1);
  const coreX = core.map((_, index) => gap + index * (BOX_W + gap));
  const centerX = WIDTH / 2;
  const supportingY = CORE_Y + BOX_H + 70;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${supportingY + BOX_H + 20}`}
      className="h-auto w-full"
      role="img"
      aria-label="Diagram struktur grup: Environesia Group membawahi empat entitas layanan lingkungan, dengan satu unit penunjang di bawahnya"
    >
      <rect
        x={centerX - BOX_W / 2}
        y={20}
        width={BOX_W}
        height={48}
        rx={10}
        className="fill-forest"
      />
      <text
        x={centerX}
        y={49}
        textAnchor="middle"
        className="fill-paper text-[15px] font-medium"
      >
        Environesia Group
      </text>

      <line x1={centerX} y1={68} x2={centerX} y2={104} className="stroke-line" strokeWidth={1.5} />
      <line
        x1={coreX[0] + BOX_W / 2}
        y1={104}
        x2={coreX[core.length - 1] + BOX_W / 2}
        y2={104}
        className="stroke-line"
        strokeWidth={1.5}
      />

      {core.map((entity, index) => (
        <g key={entity.slug}>
          <line
            x1={coreX[index] + BOX_W / 2}
            y1={104}
            x2={coreX[index] + BOX_W / 2}
            y2={CORE_Y}
            className="stroke-line"
            strokeWidth={1.5}
          />
          <rect
            x={coreX[index]}
            y={CORE_Y}
            width={BOX_W}
            height={BOX_H}
            rx={10}
            className="fill-paper stroke-line"
            strokeWidth={1}
          />
          <rect x={coreX[index]} y={CORE_Y} width={4} height={BOX_H} rx={2} fill={entity.warnaAksen} />
          <text x={coreX[index] + 18} y={CORE_Y + 30} className="fill-ink text-[14px] font-medium">
            {entity.nama}
          </text>
          <text x={coreX[index] + 18} y={CORE_Y + 52} className="fill-slate text-[12px]">
            {entity.deskripsi}
          </text>
        </g>
      ))}

      {supporting.map((entity) => (
        <g key={entity.slug}>
          <line
            x1={centerX}
            y1={CORE_Y + BOX_H}
            x2={centerX}
            y2={supportingY}
            className="stroke-line"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <rect
            x={centerX - BOX_W / 2}
            y={supportingY}
            width={BOX_W}
            height={BOX_H}
            rx={10}
            className="fill-paper stroke-line"
            strokeWidth={1}
          />
          <rect
            x={centerX - BOX_W / 2}
            y={supportingY}
            width={4}
            height={BOX_H}
            rx={2}
            fill={entity.warnaAksen}
          />
          <text x={centerX - BOX_W / 2 + 18} y={supportingY + 26} className="fill-slate text-[10px] uppercase tracking-[0.08em]">
            Unit Penunjang
          </text>
          <text x={centerX - BOX_W / 2 + 18} y={supportingY + 46} className="fill-ink text-[13px] font-medium">
            {entity.nama}
          </text>
          <text x={centerX - BOX_W / 2 + 18} y={supportingY + 64} className="fill-slate text-[11px]">
            {entity.deskripsi}
          </text>
        </g>
      ))}
    </svg>
  );
}
