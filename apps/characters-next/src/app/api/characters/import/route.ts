import { db } from "@/db";
import { characters } from "@/db/schema";
import { readIncoming } from "@/lib/interchange";
import { serializeCharacter } from "@/lib/serializeCharacter";
import { buildLssEnvelope } from "@/lib/lss/format";

export const dynamic = "force-dynamic";

async function readBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (file instanceof File) {
      const text = await file.text();
      return JSON.parse(text) as unknown;
    }
    const raw = form.get("json");
    if (typeof raw === "string") return JSON.parse(raw) as unknown;
    throw new Error("В форме нет файла .json");
  }
  const text = await request.text();
  if (!text.trim()) throw new Error("Пустое тело запроса");
  return JSON.parse(text) as unknown;
}

/** POST /api/characters/import?preview=1 — dry run that returns the field mapping. */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const preview = url.searchParams.get("preview") === "1";

  try {
    const body = await readBody(request);
    const { kind, payload, report } = readIncoming(body);

    if (preview) {
      return Response.json({
        ok: true,
        kind,
        payload,
        report,
        lss: buildLssEnvelope({
          id: "preview",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...payload,
        }),
      });
    }

    const [created] = await db
      .insert(characters)
      .values({
        name: payload.name,
        playerName: payload.playerName,
        race: payload.race,
        subrace: payload.subrace,
        className: payload.className,
        background: payload.background,
        alignment: payload.alignment,
        level: payload.level,
        experience: payload.experience,
        sheet: payload.sheet,
      })
      .returning();

    if (!created) throw new Error("Не удалось записать персонажа");
    return Response.json({ ok: true, kind, report, character: serializeCharacter(created) }, { status: 201 });
  } catch (error) {
    const message = error instanceof SyntaxError ? "Это не корректный JSON" : error instanceof Error ? error.message : "Ошибка импорта";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
