import { CharacterGallery } from "@/components/character/CharacterGallery";
import { SiteChrome } from "@/components/SiteChrome";
import { db } from "@/db";
import { characters } from "@/db/schema";
import { seedCharactersIfEmpty } from "@/lib/seedCharacters";
import { serializeCharacter } from "@/lib/serializeCharacter";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function CharactersPage() {
  await seedCharactersIfEmpty();
  const rows = await db.select().from(characters).orderBy(desc(characters.updatedAt));
  return (
    <SiteChrome>
      <CharacterGallery initial={rows.map(serializeCharacter)} />
    </SiteChrome>
  );
}
