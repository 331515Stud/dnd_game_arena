import { db } from "@/db";
import { characters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { buildLssEnvelope } from "@/lib/lss/format";
import { ARENA_FORMAT, ARENA_VERSION, type ArenaEnvelope } from "@/lib/interchange";
import { serializeCharacter } from "@/lib/serializeCharacter";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
};

/** Header values must be ASCII, so the real (Cyrillic) name travels RFC 5987-encoded. */
function contentDisposition(name: string, suffix: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => TRANSLIT[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const fallback = `${slug || "character"}.${suffix}`;
  const utf8 = `${name.trim() || "character"}.${suffix}`.replace(/["\\]/g, "");
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(utf8)}`;
}

function download(body: unknown, name: string, suffix: string) {
  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": contentDisposition(name, suffix),
      "Cache-Control": "no-store",
    },
  });
}

/**
 * GET /api/characters/:id/export?format=lss|arena|both
 * `lss`   → a file you can drop straight into «Мои персонажи» → «Загрузить .json»
 * `arena` → canonical arena file (contains the LSS envelope inside)
 * `both`  → an object with both documents for the transfer panel
 */
export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const format = new URL(request.url).searchParams.get("format") ?? "lss";

  const [row] = await db.select().from(characters).where(eq(characters.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: "Персонаж не найден" }, { status: 404 });
  const character = serializeCharacter(row);

  if (format === "arena") {
    const envelope: ArenaEnvelope = {
      format: ARENA_FORMAT,
      version: ARENA_VERSION,
      exportedAt: new Date().toISOString(),
      character: {
        name: character.name,
        playerName: character.playerName,
        race: character.race,
        subrace: character.subrace,
        className: character.className,
        background: character.background,
        alignment: character.alignment,
        level: character.level,
        experience: character.experience,
        sheet: character.sheet,
      },
      lss: buildLssEnvelope(character),
    };
    return download(envelope, `${character.name}-arena`, "json");
  }

  if (format === "both") {
    return NextResponse.json({
      format: ARENA_FORMAT,
      version: ARENA_VERSION,
      exportedAt: new Date().toISOString(),
      character,
      lss: buildLssEnvelope(character),
    });
  }

  // LSS expects `data` to be a JSON *string* inside the envelope — exactly what buildLssEnvelope returns.
  return download(buildLssEnvelope(character), `${character.name}-lss`, "json");
}
