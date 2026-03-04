"use server";

import prisma from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowMs = 1000 * 60 * 60; // 1 hour window
    const limit = 10; // Max 10 characters per hour per IP

    let timestamps = rateLimitMap.get(ip) || [];
    timestamps = timestamps.filter(t => now - t < windowMs);

    if (timestamps.length >= limit) {
        return false;
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    return true;
}

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
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    if (ip !== "unknown" && !checkRateLimit(ip)) {
        redirect("/?error=" + encodeURIComponent("Przekroczono limit tworzenia postaci (maks. 10 na godzinę). Spróbuj ponownie później."));
    }

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
        const allowedFields = [
            "name", "species", "age", "gender", "height", "hair", "eyes", "distinguishingMarks", "socialClass",
            "profession", "career", "specialization", "virtue", "flaw", "desire", "fear",
            "brawn", "agility", "intellect", "cunning", "willpower", "presence",
            "soak", "woundsThreshold", "woundsCurrent", "strainThreshold", "strainCurrent",
            "corruptionThreshold", "corruptionCurrent", "defenseMelee", "defenseRanged",
            "skills", "talents", "weapons", "gear", "criticalInjuries", "mutations",
            "experienceTotal", "experienceAvailable", "gold", "silver", "copper"
        ];

        const safeData: any = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                safeData[field] = updateData[field];
            }
        }

        await prisma.character.update({
            where: { ssid },
            data: safeData,
        });
        revalidatePath(`/character/${ssid}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating character:", error);
        return { error: "Nie udało się zapisać zmian." };
    }
}
