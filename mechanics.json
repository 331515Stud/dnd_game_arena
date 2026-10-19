import wasmUrl from '@dimforge/rapier3d-compat/rapier_wasm3d_bg.wasm?url';
import { init } from '@dimforge/rapier3d-compat';

let pending: Promise<void> | null = null;

/**
 * Rapier's default init() looks for a sibling .wasm file. The app is served as a
 * single HTML file, so we point init at the inlined asset before the physics world mounts.
 */
export function ensureRapier() {
  if (!pending) {
    const start = init as unknown as (options: { module_or_path: string }) => Promise<unknown>;
    pending = start({ module_or_path: wasmUrl }).then(() => undefined);
  }
  return pending;
}
