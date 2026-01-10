"use client";

import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function AgeGatePage() {
  const router = useRouter();

  return (
    <div className={styles.dashboard}>
      <div className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Age Restricted</h2>
          </div>
          <p className={styles.sectionBody}>
            This thread of the Omnivael is reserved for mature readers.
          </p>
          <button className={styles.resumeButton} type="button" onClick={() => router.push("/")}>
            Return to Library
          </button>
        </section>
      </div>
    </div>
  );
}

