"use client";

import { useState } from "react";
import styles from "./CharacterSheet.module.css";
import { updateCharacter } from "@/app/lib/actions";
import { Dictionary } from "@/app/lib/dictionary/index";

export default function CharacterSheet({
    initialCharacter,
    dict,
}: {
    initialCharacter: any;
    dict: Dictionary;
}) {
    const [character, setCharacter] = useState(initialCharacter);
    const [isSaving, setIsSaving] = useState(false);

    // General handler for all inputs
    const handleChange = (field: string, value: any) => {
        setCharacter((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Destructure out unneeded fields or fields that shouldn't be overridden
        const { id, ssid, createdAt, updatedAt, ...updateData } = character;
        // ensure number fields are numbers
        const parsedData = {
            ...updateData,
            brawn: Number(updateData.brawn) || 0,
            agility: Number(updateData.agility) || 0,
            intellect: Number(updateData.intellect) || 0,
            cunning: Number(updateData.cunning) || 0,
            willpower: Number(updateData.willpower) || 0,
            presence: Number(updateData.presence) || 0,
            soak: Number(updateData.soak) || 0,
            woundsThreshold: Number(updateData.woundsThreshold) || 0,
            woundsCurrent: Number(updateData.woundsCurrent) || 0,
            strainThreshold: Number(updateData.strainThreshold) || 0,
            strainCurrent: Number(updateData.strainCurrent) || 0,
            defenseMelee: Number(updateData.defenseMelee) || 0,
            defenseRanged: Number(updateData.defenseRanged) || 0,
            experienceTotal: Number(updateData.experienceTotal) || 0,
            experienceAvailable: Number(updateData.experienceAvailable) || 0,
        };

        await updateCharacter(character.ssid, parsedData);
        setIsSaving(false);
    };

    return (
        <div className={styles.sheet}>
            {/* HEADER */}
            <div className={styles.header}>
                <div style={{ flexGrow: 1 }}>
                    <input
                        className={`${styles.input} ${styles.headerTitle}`}
                        value={character.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder={dict.character.name}
                        style={{ background: "transparent", border: "none", width: "100%" }}
                    />
                </div>
                <div className={styles.headerSsid}>SSID: {character.ssid}</div>
            </div>

            <div className={styles.grid}>
                {/* PROFILE */}
                <div className={`glass-panel ${styles.section}`}>
                    <h2 className={styles.sectionTitle}>Profil</h2>
                    <div className={styles.inputRow}>
                        <label>{dict.character.species}</label>
                        <input
                            className={styles.input}
                            value={character.species}
                            onChange={(e) => handleChange("species", e.target.value)}
                        />
                    </div>
                    <div className={styles.inputRow}>
                        <label>{dict.character.career}</label>
                        <input
                            className={styles.input}
                            value={character.career}
                            onChange={(e) => handleChange("career", e.target.value)}
                        />
                    </div>
                </div>

                {/* ATTRIBUTES */}
                <div className={`glass-panel ${styles.section}`}>
                    <h2 className={styles.sectionTitle}>{dict.character.attributes}</h2>
                    <div className={styles.statsGrid}>
                        {[
                            { key: "brawn", label: dict.attributes.brawn },
                            { key: "agility", label: dict.attributes.agility },
                            { key: "intellect", label: dict.attributes.intellect },
                            { key: "cunning", label: dict.attributes.cunning },
                            { key: "willpower", label: dict.attributes.willpower },
                            { key: "presence", label: dict.attributes.presence },
                        ].map((attr) => (
                            <div key={attr.key} className={styles.statBox}>
                                <label>{attr.label}</label>
                                <input
                                    type="number"
                                    className={styles.statInput}
                                    value={character[attr.key]}
                                    onChange={(e) => handleChange(attr.key, parseInt(e.target.value) || 0)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* DERIVED STATS */}
                <div className={`glass-panel ${styles.section}`}>
                    <h2 className={styles.sectionTitle}>{dict.character.derivedStats}</h2>
                    <div className={styles.derivedGrid}>
                        <div className={styles.statBox}>
                            <label>{dict.derived.soak}</label>
                            <input
                                type="number"
                                className={styles.statInput}
                                value={character.soak}
                                onChange={(e) => handleChange("soak", parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className={styles.statBox}>
                            <label>{dict.derived.woundsThreshold}</label>
                            <input
                                type="number"
                                className={styles.statInput}
                                value={character.woundsThreshold}
                                onChange={(e) => handleChange("woundsThreshold", parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className={styles.statBox}>
                            <label>{dict.derived.strainThreshold}</label>
                            <input
                                type="number"
                                className={styles.statInput}
                                value={character.strainThreshold}
                                onChange={(e) => handleChange("strainThreshold", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <div className={styles.inputRow} style={{ flex: 1 }}>
                            <label>{dict.derived.woundsCurrent}</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={character.woundsCurrent}
                                onChange={(e) => handleChange("woundsCurrent", parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className={styles.inputRow} style={{ flex: 1 }}>
                            <label>{dict.derived.strainCurrent}</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={character.strainCurrent}
                                onChange={(e) => handleChange("strainCurrent", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>

                {/* EXPERIENCE */}
                <div className={`glass-panel ${styles.section}`}>
                    <h2 className={styles.sectionTitle}>{dict.character.experience}</h2>
                    <div className={styles.derivedGrid}>
                        <div className={styles.inputRow}>
                            <label>{dict.experience.available}</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={character.experienceAvailable}
                                onChange={(e) => handleChange("experienceAvailable", parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.experience.total}</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={character.experienceTotal}
                                onChange={(e) => handleChange("experienceTotal", parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>

                {/* TEXT AREAS for JSON fields - MVP implementation */}
                <div className={`glass-panel ${styles.section}`} style={{ gridColumn: '1 / -1' }}>
                    <h2 className={styles.sectionTitle}>{dict.character.skills} & {dict.character.talents}</h2>
                    <div className={styles.grid}>
                        <div className={styles.inputRow}>
                            <label>{dict.character.skills}</label>
                            <textarea
                                className={styles.input}
                                rows={4}
                                value={character.skills}
                                onChange={(e) => handleChange("skills", e.target.value)}
                                placeholder="Atletyka (Cia) - 2&#10;Zastraszanie (Cia) - 1..."
                            />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.talents}</label>
                            <textarea
                                className={styles.input}
                                rows={4}
                                value={character.talents}
                                onChange={(e) => handleChange("talents", e.target.value)}
                                placeholder="Krzepki (Otrzymuje +2 do Wyparowań)..."
                            />
                        </div>
                    </div>
                </div>

                <div className={`glass-panel ${styles.section}`} style={{ gridColumn: '1 / -1' }}>
                    <h2 className={styles.sectionTitle}>{dict.character.weapons} & {dict.character.gear}</h2>
                    <div className={styles.grid}>
                        <div className={styles.inputRow}>
                            <label>{dict.character.weapons}</label>
                            <textarea
                                className={styles.input}
                                rows={4}
                                value={character.weapons}
                                onChange={(e) => handleChange("weapons", e.target.value)}
                                placeholder="Miecz (Obrażenia +3, Kryt 3, Zasięg: Zwarcie)..."
                            />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.gear}</label>
                            <textarea
                                className={styles.input}
                                rows={4}
                                value={character.gear}
                                onChange={(e) => handleChange("gear", e.target.value)}
                                placeholder="Lina (10 metrów)&#10;Prowiant..."
                            />
                        </div>
                    </div>
                </div>

            </div>

            <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={isSaving}
            >
                {isSaving ? dict.common.loading : dict.common.save}
            </button>
        </div>
    );
}
