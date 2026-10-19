import { CharacterSheet } from "@/components/character/CharacterSheet";
import { SiteChrome } from "@/components/SiteChrome";
import { db } from "@/db";
import { characters } from "@/db/schema";
import { serializeCharacter } from "@/lib/serializeCharacter";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select().from(characters).where(eq(characters.id, id)).limit(1);
  if (!row) notFound();
  return (
    <SiteChrome>
      <CharacterSheet character={serializeCharacter(row)} />
    </SiteChrome>
  );
}
