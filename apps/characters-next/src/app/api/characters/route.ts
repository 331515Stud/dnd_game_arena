import { db } from "@/db";
import { characters } from "@/db/schema";
import { parseCharacterPayload } from "@/lib/character";
import { serializeCharacter } from "@/lib/serializeCharacter";
import { seedCharactersIfEmpty } from "@/lib/seedCharacters";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await seedCharactersIfEmpty();
    const rows = await db.select().from(characters).orderBy(desc(characters.updatedAt));
    return Response.json(rows.map(serializeCharacter));
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Не удалось загрузить персонажей" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = parseCharacterPayload(body);
    if (!parsed.ok) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }
    const [created] = await db
      .insert(characters)
      .values({
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
      })
      .returning();
    if (!created) {
      return Response.json({ error: "Не удалось сохранить персонажа" }, { status: 500 });
    }
    return Response.json(serializeCharacter(created), { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Не удалось сохранить персонажа" }, { status: 500 });
  }
}
