import { db } from "@/db";
import { characters } from "@/db/schema";
import { parseCharacterPayload } from "@/lib/character";
import { serializeCharacter } from "@/lib/serializeCharacter";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const [row] = await db.select().from(characters).where(eq(characters.id, id)).limit(1);
  if (!row) return Response.json({ error: "Персонаж не найден" }, { status: 404 });
  return Response.json(serializeCharacter(row));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const body: unknown = await request.json();
    const parsed = parseCharacterPayload(body);
    if (!parsed.ok) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }
    const [updated] = await db
      .update(characters)
      .set({
        name: parsed.data.name,
        playerName: parsed.data.playerName,
        race: parsed.data.race,
        subrace: parsed.data.subrace,
        className: parsed.data.className,
        background: parsed.data.background,
        alignment: parsed.data.alignment,
        level: parsed.data.level,
        experience: parsed.data.experience,
        sheet: parsed.data.sheet,
        updatedAt: new Date(),
      })
      .where(eq(characters.id, id))
      .returning();
    if (!updated) return Response.json({ error: "Персонаж не найден" }, { status: 404 });
    return Response.json(serializeCharacter(updated));
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Не удалось обновить персонажа" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await db.delete(characters).where(eq(characters.id, id)).returning({ id: characters.id });
  if (deleted.length === 0) return Response.json({ error: "Персонаж не найден" }, { status: 404 });
  return Response.json({ ok: true });
}
