"use server";

import prisma from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Generate a random 6-character alphanumeric SSID
function generateSSID(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ssid = "";
    for (let i = 0; i < 6; i++) {
        ssid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ssid;
}

export async function createCharacter() {
    let ssid = generateSSID();
    let isUnique = false;

    // Ensure SSID is unique
    while (!isUnique) {
        const existing = await prisma.character.findUnique({
            where: { ssid },
        });
        if (!existing) {
            isUnique = true;
        } else {
            ssid = generateSSID();
        }
    }

    // Create character with default values (handled by Prisma defaults)
    await prisma.character.create({
        data: {
            ssid,
        },
    });

    redirect(`/character/${ssid}`);
}

export async function loadCharacter(formData: FormData) {
    const ssidInput = formData.get("ssid")?.toString().toUpperCase().trim();

    if (!ssidInput || ssidInput.length !== 6) {
        redirect("/?error=" + encodeURIComponent("Kod musi składać się z 6 znaków."));
    }

    const character = await prisma.character.findUnique({
        where: { ssid: ssidInput },
    });

    if (!character) {
        redirect("/?error=" + encodeURIComponent("Nie znaleziono postaci o podanym kodzie."));
    }

    redirect(`/character/${ssidInput}`);
}

export async function getCharacter(ssid: string) {
    return await prisma.character.findUnique({
        where: { ssid },
    });
}

export async function updateCharacter(ssid: string, updateData: any) {
    try {
        await prisma.character.update({
            where: { ssid },
            data: updateData,
        });
        revalidatePath(`/character/${ssid}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating character:", error);
        return { error: "Nie udało się zapisać zmian." };
    }
}
