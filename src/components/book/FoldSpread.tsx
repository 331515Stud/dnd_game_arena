import React from 'react';
import { computeFold, toClipPath, type Sign, type Vec } from './fold';

interface FoldSpreadProps {
  W: number;
  H: number;
  sign: Sign;
  cy: number;
  P: Vec;
  front: React.ReactNode;
  back: React.ReactNode;
}

/**
 * Overlay that draws the sheet being turned: the still-flat part of the page,
 * the mirrored flap showing the back side, and the shading along the crease.
 * Sits on top of the base spread; pointer-events disabled so dragging passes through.
 */
export const FoldSpread: React.FC<FoldSpreadProps> = ({ W, H, sign, cy, P, front, back }) => {
  const fold = computeFold(W, H, sign, cy, P);
  if (W <= 0 || H <= 0) return null;
  if (!fold) {
    return (
      <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 30 }}>
        <div className="absolute top-0 bottom-0 overflow-hidden" style={{ left: sign > 0 ? W : 0, width: W }}>
          {front}
        </div>
      </div>
    );
  }

  const { M, angleDeg, k, matrix, flatPoly, flapPoly } = fold;
  const mx = M.x + W;
  const my = M.y;
  const L = Math.hypot(W * 2, H) * 2;
  const curlW = 36 + 150 * k;
  const flapW = 28 + 120 * k;
  const curlAlpha = 0.22 + 0.4 * k;
  const flapAlpha = 0.3 + 0.42 * k;

  const pageLeft = sign > 0 ? W : 0;
  const restLeft = sign > 0 ? 0 : W;
  const [a, b, c, d, e, f] = matrix;

  return (
    <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 30 }}>
      {/* remaining flat part of the turning page */}
      <div className="absolute inset-0" style={{ clipPath: toClipPath(flatPoly, W) }}>
        <div className="absolute top-0 bottom-0" style={{ left: pageLeft, width: W }}>
          {front}
        </div>
        <div
          className="absolute"
          style={{
            left: mx,
            top: my,
            width: curlW,
            height: L,
            transformOrigin: '0 0',
            transform: `rotate(${angleDeg}deg) translateY(${-L / 2}px)`,
            background: `linear-gradient(90deg, rgba(28,14,4,${curlAlpha}) 0%, rgba(28,14,4,${curlAlpha * 0.45}) 28%, rgba(28,14,4,0) 100%)`
          }}
        />
      </div>

      {/* the flap: back side of the sheet, mirrored across the crease */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ clipPath: toClipPath(flapPoly, W) }}>
          <div
            className="absolute inset-0"
            style={{
              transformOrigin: `${W}px 0px`,
              transform: `matrix(${a},${b},${c},${d},${e},${f}) matrix(-1,0,0,1,0,0)`
            }}
          >
            <div className="absolute top-0 bottom-0" style={{ left: restLeft, width: W }}>
              {back}
            </div>
          </div>
          {/* paper tint on the back side */}
          <div className="absolute inset-0" style={{ background: `rgba(70, 42, 14, ${0.05 + 0.07 * k})` }} />
          {/* crease shading on the flap */}
          <div
            className="absolute"
            style={{
              left: mx,
              top: my,
              width: flapW,
              height: L,
              transformOrigin: '0 0',
              transform: `rotate(${angleDeg + 180}deg) translateY(${-L / 2}px)`,
              background: `linear-gradient(90deg, rgba(24,12,4,${flapAlpha}) 0%, rgba(255,246,226,${0.12 + 0.18 * k}) 14%, rgba(255,246,226,0) 40%, rgba(24,12,4,0) 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};
