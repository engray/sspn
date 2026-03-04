import styles from "./page.module.css";
import { createCharacter, loadCharacter } from "./lib/actions";

export default function Home() {
  return (
    <main className="container animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Stary Świat</h1>
        <p className={styles.subtitle}>
          Nieoficjalna Karta Postaci do Genesys
        </p>
      </header>

      <div className={styles.cardContainer}>
        <form action={createCharacter} className={`glass-panel ${styles.card}`}>
          <h2>Stwórz Bohatera</h2>
          <p>Wygeneruj nową postać i otrzymaj unikalny kod dostępu do swojej karty.</p>
          <button type="submit" className={styles.primaryButton}>Nowa Karta Postaci</button>
        </form>

        <form action={loadCharacter} className={`glass-panel ${styles.card}`}>
          <h2>Wczytaj Postać</h2>
          <p>Podaj swój 6-znakowy kod, aby wrócić do gry.</p>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="ssid"
              placeholder="np. X8K2M9"
              maxLength={6}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.secondaryButton}>Wczytaj</button>
          </div>
        </form>
      </div>
    </main>
  );
}
