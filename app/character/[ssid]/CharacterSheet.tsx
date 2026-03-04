"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
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
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [isOnline, setIsOnline] = useState(true);
    const [mounted, setMounted] = useState(false);
    const isFirstRender = useRef(true);

    // Network status listener
    useEffect(() => {
        setMounted(true);
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const handleChange = (field: string, value: any) => {
        setCharacter((prev: any) => ({ ...prev, [field]: value }));
        if (saveStatus === "saved" || saveStatus === "error") {
            setSaveStatus("idle");
        }
    };

    const performSave = useCallback(async (dataToSave: any) => {
        if (!navigator.onLine) {
            setSaveStatus("error");
            return;
        }

        setSaveStatus("saving");
        const { id, ssid, createdAt, updatedAt, ...updateData } = dataToSave;
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
            corruptionThreshold: Number(updateData.corruptionThreshold) || 0,
            corruptionCurrent: Number(updateData.corruptionCurrent) || 0,
            defenseMelee: Number(updateData.defenseMelee) || 0,
            defenseRanged: Number(updateData.defenseRanged) || 0,
            experienceTotal: Number(updateData.experienceTotal) || 0,
            experienceAvailable: Number(updateData.experienceAvailable) || 0,
            gold: Number(updateData.gold) || 0,
            silver: Number(updateData.silver) || 0,
            copper: Number(updateData.copper) || 0,
        };

        const result = await updateCharacter(dataToSave.ssid, parsedData);
        if (result?.error) {
            setSaveStatus("error");
        } else {
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 3000); // clear toast after 3s
        }
    }, []);

    // Autosave Debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            performSave(character);
        }, 1500); // Autosave after 1.5 seconds of inactivity

        return () => clearTimeout(timer);
    }, [character, performSave]);

    const handleManualSave = () => {
        performSave(character);
    };

    return (
        <div className={styles.sheet}>
            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.headerSsid}>SSID: {character.ssid}</div>
            </div>

            <div className={styles.grid}>
                {/* CHARAKTERYSTYKA */}
                <div className={`glass-panel ${styles.section}`}>
                    <h2 className={styles.sectionTitle}>Charakterystyka</h2>
                    <div className={styles.derivedGrid}>
                        <div className={styles.inputRow}>
                            <label>{dict.character.name}</label>
                            <input className={styles.input} value={character.name} onChange={(e) => handleChange("name", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.age}</label>
                            <input className={styles.input} value={character.age} onChange={(e) => handleChange("age", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.species}</label>
                            <input className={styles.input} value={character.species} onChange={(e) => handleChange("species", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.gender}</label>
                            <input className={styles.input} value={character.gender} onChange={(e) => handleChange("gender", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.hair}</label>
                            <input className={styles.input} value={character.hair} onChange={(e) => handleChange("hair", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.eyes}</label>
                            <input className={styles.input} value={character.eyes} onChange={(e) => handleChange("eyes", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.height}</label>
                            <input className={styles.input} value={character.height} onChange={(e) => handleChange("height", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.socialClass}</label>
                            <input className={styles.input} value={character.socialClass} onChange={(e) => handleChange("socialClass", e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.inputRow} style={{ marginTop: '0.5rem' }}>
                        <label>{dict.character.distinguishingMarks}</label>
                        <input className={styles.input} value={character.distinguishingMarks} onChange={(e) => handleChange("distinguishingMarks", e.target.value)} />
                    </div>
                </div>

                {/* POSTAĆ */}
                <div className={`glass-panel ${styles.section}`}>
                    <h2 className={styles.sectionTitle}>Postać</h2>
                    <div className={styles.derivedGrid}>
                        <div className={styles.inputRow}>
                            <label>{dict.character.profession}</label>
                            <input className={styles.input} value={character.profession} onChange={(e) => handleChange("profession", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.specialization}</label>
                            <input className={styles.input} value={character.specialization} onChange={(e) => handleChange("specialization", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.career}</label>
                            <input className={styles.input} value={character.career} onChange={(e) => handleChange("career", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.virtue}</label>
                            <input className={styles.input} value={character.virtue} onChange={(e) => handleChange("virtue", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.flaw}</label>
                            <input className={styles.input} value={character.flaw} onChange={(e) => handleChange("flaw", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.desire}</label>
                            <input className={styles.input} value={character.desire} onChange={(e) => handleChange("desire", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.fear}</label>
                            <input className={styles.input} value={character.fear} onChange={(e) => handleChange("fear", e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* ATTRIBUTES (Cechy) */}
                <div className={`glass-panel ${styles.section}`} style={{ gridColumn: '1 / -1' }}>
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

                {/* DERIVED STATS (Atrybuty) */}
                <div className={`glass-panel ${styles.section}`} style={{ gridColumn: '1 / -1' }}>
                    <h2 className={styles.sectionTitle}>{dict.character.derivedStats}</h2>
                    <div className={styles.grid}>
                        <div className={styles.statBox}>
                            <label>{dict.derived.soak}</label>
                            <input type="number" className={styles.statInput} value={character.soak} onChange={(e) => handleChange("soak", parseInt(e.target.value) || 0)} />
                        </div>
                        <div className={styles.derivedGrid}>
                            <div className={styles.statBox}>
                                <label>{dict.derived.defenseRanged}</label>
                                <input type="number" className={styles.statInput} value={character.defenseRanged} onChange={(e) => handleChange("defenseRanged", parseInt(e.target.value) || 0)} />
                            </div>
                            <div className={styles.statBox}>
                                <label>{dict.derived.defenseMelee}</label>
                                <input type="number" className={styles.statInput} value={character.defenseMelee} onChange={(e) => handleChange("defenseMelee", parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                        <div className={styles.derivedGrid}>
                            <div className={styles.statBox}>
                                <label>{dict.derived.wounds} ({dict.derived.woundsThreshold})</label>
                                <input type="number" className={styles.statInput} value={character.woundsThreshold} onChange={(e) => handleChange("woundsThreshold", parseInt(e.target.value) || 0)} />
                            </div>
                            <div className={styles.statBox} style={{ borderColor: 'var(--accent-danger)' }}>
                                <label>{dict.derived.wounds} ({dict.derived.woundsCurrent})</label>
                                <input type="number" className={styles.statInput} value={character.woundsCurrent} onChange={(e) => handleChange("woundsCurrent", parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                        <div className={styles.derivedGrid}>
                            <div className={styles.statBox}>
                                <label>{dict.derived.strain} ({dict.derived.strainThreshold})</label>
                                <input type="number" className={styles.statInput} value={character.strainThreshold} onChange={(e) => handleChange("strainThreshold", parseInt(e.target.value) || 0)} />
                            </div>
                            <div className={styles.statBox} style={{ borderColor: 'var(--accent-primary)' }}>
                                <label>{dict.derived.strain} ({dict.derived.strainCurrent})</label>
                                <input type="number" className={styles.statInput} value={character.strainCurrent} onChange={(e) => handleChange("strainCurrent", parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                        <div className={styles.derivedGrid}>
                            <div className={styles.statBox}>
                                <label>{dict.derived.corruption} ({dict.derived.corruptionThreshold})</label>
                                <input type="number" className={styles.statInput} value={character.corruptionThreshold} onChange={(e) => handleChange("corruptionThreshold", parseInt(e.target.value) || 0)} />
                            </div>
                            <div className={styles.statBox}>
                                <label>{dict.derived.corruption} ({dict.derived.corruptionCurrent})</label>
                                <input type="number" className={styles.statInput} value={character.corruptionCurrent} onChange={(e) => handleChange("corruptionCurrent", parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                        <div className={styles.derivedGrid}>
                            <div className={styles.inputRow}>
                                <label>{dict.experience.available}</label>
                                <input type="number" className={styles.input} value={character.experienceAvailable} onChange={(e) => handleChange("experienceAvailable", parseInt(e.target.value) || 0)} />
                            </div>
                            <div className={styles.inputRow}>
                                <label>{dict.experience.total}</label>
                                <input type="number" className={styles.input} value={character.experienceTotal} onChange={(e) => handleChange("experienceTotal", parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TEXT AREAS for JSON fields - MVP implementation */}
                <div className={`glass-panel ${styles.section}`} style={{ gridColumn: '1 / -1' }}>
                    <h2 className={styles.sectionTitle}>{dict.character.skills} & {dict.character.talents}</h2>
                    <div className={styles.grid}>
                        <div className={styles.inputRow}>
                            <label>{dict.character.skills}</label>
                            <textarea className={styles.input} rows={4} value={character.skills} onChange={(e) => handleChange("skills", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.talents}</label>
                            <textarea className={styles.input} rows={4} value={character.talents} onChange={(e) => handleChange("talents", e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className={`glass-panel ${styles.section}`} style={{ gridColumn: '1 / -1' }}>
                    <h2 className={styles.sectionTitle}>{dict.character.weapons} & {dict.character.gear}</h2>
                    <div className={styles.grid}>
                        <div className={styles.inputRow}>
                            <label>{dict.character.weapons}</label>
                            <textarea className={styles.input} rows={4} value={character.weapons} onChange={(e) => handleChange("weapons", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.gear}</label>
                            <textarea className={styles.input} rows={4} value={character.gear} onChange={(e) => handleChange("gear", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>Pieniądze (Złota, Srebrna, Miedziana)</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input title={dict.wealth.gold} type="number" className={styles.input} style={{ flex: 1 }} value={character.gold} onChange={(e) => handleChange("gold", parseInt(e.target.value) || 0)} />
                                <input title={dict.wealth.silver} type="number" className={styles.input} style={{ flex: 1 }} value={character.silver} onChange={(e) => handleChange("silver", parseInt(e.target.value) || 0)} />
                                <input title={dict.wealth.copper} type="number" className={styles.input} style={{ flex: 1 }} value={character.copper} onChange={(e) => handleChange("copper", parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`glass-panel ${styles.section}`} style={{ gridColumn: '1 / -1' }}>
                    <h2 className={styles.sectionTitle}>{dict.character.injuries} & {dict.character.mutations}</h2>
                    <div className={styles.grid}>
                        <div className={styles.inputRow}>
                            <label>{dict.character.injuries}</label>
                            <textarea className={styles.input} rows={4} value={character.criticalInjuries} onChange={(e) => handleChange("criticalInjuries", e.target.value)} />
                        </div>
                        <div className={styles.inputRow}>
                            <label>{dict.character.mutations}</label>
                            <textarea className={styles.input} rows={4} value={character.mutations} onChange={(e) => handleChange("mutations", e.target.value)} />
                        </div>
                    </div>
                </div>

            </div>

            {/* TOAST NOTIFICATIONS */}
            {mounted && createPortal(
                <div className={styles.toastContainer}>
                    {!isOnline && (
                        <div className={`${styles.toast} ${styles.toastError}`}>
                            Brak połączenia! Jesteś offline.
                        </div>
                    )}
                    {isOnline && saveStatus === "saving" && (
                        <div className={`${styles.toast} ${styles.toastInfo}`}>
                            {dict.common.loading || "Zapisywanie..."}
                        </div>
                    )}
                    {isOnline && saveStatus === "saved" && (
                        <div className={`${styles.toast} ${styles.toastSuccess}`}>
                            {dict.common.saved || "Zapisano!"}
                        </div>
                    )}
                    {isOnline && saveStatus === "error" && (
                        <div className={`${styles.toast} ${styles.toastError}`}>
                            {dict.common.error || "Błąd zapisu!"}
                        </div>
                    )}
                </div>,
                document.body
            )}

            <button className={styles.saveButton} onClick={handleManualSave} disabled={saveStatus === "saving" || !isOnline}>
                {saveStatus === "saving" ? dict.common.loading : dict.common.save}
            </button>
        </div>
    );
}
