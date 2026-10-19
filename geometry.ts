import React from 'react';
import type { TomeRecord } from '../../library/types';

/** Tinted leather: the shared texture multiplied by the tome's own colour. */
export const leatherStyle = (tome: Pick<TomeRecord, 'leather'>): React.CSSProperties => ({
  backgroundColor: tome.leather,
  backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(255,226,170,.10), transparent 55%), url('/images/leather-texture.jpg')",
  backgroundSize: 'cover, 420px',
  backgroundBlendMode: 'normal, multiply'
});

/** Brass corner protector, drawn for the top-left corner and rotated for the others. */
export const Corner: React.FC<{ pos: 'tl' | 'tr' | 'bl' | 'br'; size?: number | string }> = ({ pos, size = 44 }) => {
  const rot = { tl: 0, tr: 90, br: 180, bl: 270 }[pos];
  const place: React.CSSProperties = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    br: { bottom: 0, right: 0 },
    bl: { bottom: 0, left: 0 }
  }[pos];
  return (
    <svg
      viewBox="0 0 60 60"
      aria-hidden
      className="absolute pointer-events-none"
      style={{ ...place, width: size, height: size, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.55))' }}
    >
      <defs>
        <linearGradient id={`brass-${pos}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d58b" />
          <stop offset=".45" stopColor="#b98a35" />
          <stop offset="1" stopColor="#6e4a17" />
        </linearGradient>
      </defs>
      <path d="M0 0 H58 Q46 6 40 14 Q30 12 22 22 Q12 30 14 40 Q6 46 0 58 Z" fill={`url(#brass-${pos})`} />
      <path d="M4 4 H44 Q36 9 32 15 Q24 14 18 20 Q12 26 14 32 Q8 36 4 44 Z" fill="none" stroke="rgba(255,240,200,.55)" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="3.4" fill="#5a3a10" stroke="#f7e2a8" strokeWidth="1" />
    </svg>
  );
};

/** Gilded double rule inside a board; `side` leaves the spine edge open. */
export const Tooling: React.FC<{ side?: 'full' | 'left' | 'right' }> = ({ side = 'full' }) => {
  const open = (s: 'left' | 'right'): React.CSSProperties =>
    side === s ? {} : side === 'full' ? {} : s === 'left' ? { borderRightWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 } : {};
  const outer: React.CSSProperties = {
    position: 'absolute',
    top: 7,
    bottom: 7,
    left: side === 'right' ? 0 : 7,
    right: side === 'left' ? 0 : 7,
    border: '1px solid rgba(226,184,104,.42)',
    borderRadius: 13,
    ...(side === 'left' ? { borderRightWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 } : {}),
    ...(side === 'right' ? { borderLeftWidth: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {}),
    ...open('left')
  };
  const inner: React.CSSProperties = {
    ...outer,
    top: 12,
    bottom: 12,
    left: side === 'right' ? 0 : 12,
    right: side === 'left' ? 0 : 12,
    border: '1px dashed rgba(226,184,104,.22)',
    ...(side === 'left' ? { borderRightWidth: 0 } : {}),
    ...(side === 'right' ? { borderLeftWidth: 0 } : {}),
    borderRadius: 9
  };
  return (
    <>
      <div className="pointer-events-none" style={outer} />
      <div className="pointer-events-none" style={inner} />
    </>
  );
};

/**
 * The front board. Sized by its container; typography uses container units so the very same
 * component reads correctly on the shelf (~170px) and in the reader (~600px).
 */
export const CoverArt: React.FC<{ tome: TomeRecord; className?: string; corners?: boolean }> = ({ tome, className = '', corners = true }) => (
  <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ containerType: 'inline-size', ...leatherStyle(tome) }}>
    <img src={tome.cover} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(180deg, rgba(10,6,3,.35) 0%, rgba(10,6,3,0) 30%, rgba(10,6,3,.35) 58%, rgba(10,6,3,.88) 100%)' }}
    />
    <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.6), inset 6cqw 0 8cqw -6cqw rgba(0,0,0,.6)' }} />
    <div className="absolute" style={{ inset: '4.5cqw', border: '0.45cqw solid rgba(226,184,104,.62)', borderRadius: '1.2cqw' }} />
    <div className="absolute" style={{ inset: '6.4cqw', border: '0.22cqw solid rgba(226,184,104,.38)', borderRadius: '0.8cqw' }} />
    {corners && (
      <>
        <Corner pos="tr" size="14cqw" />
        <Corner pos="br" size="14cqw" />
      </>
    )}
    <div className="absolute inset-x-0 text-center" style={{ bottom: '12cqw', padding: '0 10cqw' }}>
      <div
        className="font-fantasy text-amber-50"
        style={{ fontSize: '8.6cqw', lineHeight: 1.06, fontWeight: 800, textShadow: '0 0.6cqw 1.6cqw rgba(0,0,0,.95)' }}
      >
        {tome.title}
      </div>
      <div style={{ width: '28cqw', height: '0.4cqw', margin: '3.2cqw auto', background: 'linear-gradient(90deg, transparent, rgba(232,190,108,.95), transparent)' }} />
      <div className="font-book italic text-amber-100/85" style={{ fontSize: '4.6cqw', textShadow: '0 0.4cqw 1cqw rgba(0,0,0,.9)' }}>
        {tome.subtitle}
      </div>
    </div>
  </div>
);
