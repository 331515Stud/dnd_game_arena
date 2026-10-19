import { TransferBridge } from "@/components/character/TransferBridge";
import { SiteChrome } from "@/components/SiteChrome";
import { db } from "@/db";
import { characters } from "@/db/schema";
import { seedCharactersIfEmpty } from "@/lib/seedCharacters";
import { serializeCharacter } from "@/lib/serializeCharacter";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function TransferPage() {
  await seedCharactersIfEmpty();
  const rows = await db.select().from(characters).orderBy(desc(characters.updatedAt));
  return (
    <SiteChrome>
      <TransferBridge roster={rows.map(serializeCharacter)} />
    </SiteChrome>
  );
}
