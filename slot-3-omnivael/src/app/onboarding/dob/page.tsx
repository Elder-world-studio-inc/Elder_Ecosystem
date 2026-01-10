"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../page.module.css";

export default function DobOnboardingPage() {
  const router = useRouter();
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!dob) {
      setError("Please select your date of birth.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/profile/dob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dob }),
      });
      if (!response.ok) {
        setError("Unable to save your birth date. Please try again.");
        return;
      }
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Confirm Your Age</h2>
          </div>
          <p className={styles.sectionBody}>
            The Omnivael archives include mature threads. Enter your date of birth to continue.
          </p>
          <form className={styles.metaGrid} onSubmit={handleSubmit}>
            <div className={styles.metaFieldWide}>
              <label className={styles.metaLabel}>Date of Birth</label>
              <input
                className={styles.metaInput}
                type="date"
                value={dob}
                onChange={(event) => setDob(event.target.value)}
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <div className={styles.metaFooterRow}>
              <button className={styles.resumeButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Calibrating…" : "Continue"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

