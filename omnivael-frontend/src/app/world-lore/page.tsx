"use client";

import { useRouter } from "next/navigation";
import styles from "../page.module.css";

type LoreEntry = {
  id: string;
  title: string;
  tag: string;
  excerpt: string;
};

const loreEntries: LoreEntry[] = [
  {
    id: "vaelt-crystalund",
    title: "Vaelt Crystalund",
    tag: "CRYSTALUND",
    excerpt:
      "A lattice of living crystal beneath Vaelt’s surface refracts time and starlight, shaping the city’s impossible skyline.",
  },
  {
    id: "naefellas-underlevels",
    title: "Naefellas Underlevels",
    tag: "NAEFELLAS",
    excerpt:
      "Whisper-marked tunnels where the Naefellas trade in secrets, favors, and memories carved out of stolen futures.",
  },
  {
    id: "vas-opthale",
    title: "VAS-OPTHALE",
    tag: "VAS-OPTHALE",
    excerpt:
      "An orbital shrine-city that orbits the Omnivael faultline, listening for echoes from timelines that never stabilized.",
  },
];

export default function WorldLorePage() {
  const router = useRouter();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brandMark} />
          <div className={styles.brandText}>
            <span className={styles.brandPrimary}>Omnivael</span>
            <span className={styles.brandSecondary}>World Lore</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.resumeButton} type="button" onClick={() => router.push("/")}>
            Back to Library
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <main className={styles.main}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Lore Archive</h2>
            </div>
            <div className={styles.tilesGrid}>
              {loreEntries.map((entry) => (
                <div key={entry.id} className={styles.storyTile}>
                  <div className={styles.storyHeader}>
                    <span className={styles.storyTitle}>{entry.title}</span>
                    <span className={styles.loreKeyword}>{entry.tag}</span>
                  </div>
                  <div className={styles.storyMetaRow}>
                    <span className={styles.storyTime}>{entry.excerpt}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

