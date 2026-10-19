import { ArenaApp } from "@/components/arena/ArenaApp";
import { db } from "@/db";
import { characters } from "@/db/schema";
import { seedCharactersIfEmpty } from "@/lib/seedCharacters";
import { serializeCharacter } from "@/lib/serializeCharacter";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await seedCharactersIfEmpty();
  const rows = await db.select().from(characters).orderBy(desc(characters.updatedAt));
  return <ArenaApp characters={rows.map(serializeCharacter)} />;
}
