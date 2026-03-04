import { getCharacter } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import CharacterSheet from "./CharacterSheet";
import { getDictionary } from "@/app/lib/dictionary";

interface PageProps {
    params: Promise<{
        ssid: string;
    }>;
}

export default async function CharacterPage({ params }: PageProps) {
    const { ssid } = await params;

    if (!ssid || ssid.length !== 6) {
        notFound();
    }

    const character = await getCharacter(ssid);

    if (!character) {
        notFound();
    }

    const dictionary = getDictionary("pl");

    return (
        <div className="container animate-fade-in" style={{ padding: "var(--spacing-xl) 0" }}>
            <CharacterSheet initialCharacter={character} dict={dictionary} />
        </div>
    );
}
