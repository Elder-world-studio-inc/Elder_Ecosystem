"use client";

import { useRouter } from "next/navigation";
import styles from "../page.module.css";

type ForumThreadPreview = {
  id: string;
  title: string;
  category: string;
  summary: string;
};

const threadPreviews: ForumThreadPreview[] = [
  {
    id: "welcome-to-omnivael",
    title: "Welcome to the Omnivael Forums",
    category: "Announcements",
    summary: "Share feedback on the universe, report glitches, and help shape upcoming features.",
  },
  {
    id: "lore-theories",
    title: "Lore Theories: Vaelt and Beyond",
    category: "Lore",
    summary: "Speculate about the Naefellas, the Crystalund, and echoes that haven’t been written yet.",
  },
  {
    id: "creator-corner",
    title: "Creator Corner",
    category: "Creators",
    summary: "Discuss workflows, tools, and how to bring new threads into the Omnivael.",
  },
];

export default function ForumsPage() {
  const router = useRouter();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brandMark} />
          <div className={styles.brandText}>
            <span className={styles.brandPrimary}>Omnivael</span>
            <span className={styles.brandSecondary}>Forums</span>
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
              <h2 className={styles.sectionTitle}>Echo Threads</h2>
            </div>
            <div className={styles.tilesGrid}>
              {threadPreviews.map((thread) => (
                <div key={thread.id} className={styles.storyTile}>
                  <div className={styles.storyHeader}>
                    <span className={styles.storyTitle}>{thread.title}</span>
                    <span className={styles.badgeNew}>{thread.category}</span>
                  </div>
                  <div className={styles.storyMetaRow}>
                    <span className={styles.storyTime}>{thread.summary}</span>
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

