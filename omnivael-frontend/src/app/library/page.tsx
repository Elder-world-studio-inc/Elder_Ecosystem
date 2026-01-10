"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWallet } from "../WalletProvider";
import { useGuest } from "../GuestProvider";
import styles from "./page.module.css";

type ContentKind = "comic" | "prose";

type ContentSummary = {
  id: string;
  slug: string;
  title: string;
  kind: ContentKind;
  priceShards: number;
  preview: string;
  cover?: string;
  author?: string;
};

const UNLOCK_STORAGE_PREFIX = "omnivael_unlocked_";

export default function LibraryPage() {
  const router = useRouter();
  const { balance } = useWallet();
  const { data: session, status } = useSession();
  const { guestId } = useGuest();
  const [libraryContent, setLibraryContent] = useState<ContentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch all content first (to map slugs to details)
        const contentRes = await fetch("/api/content");
        if (!contentRes.ok) throw new Error("Failed to fetch content");
        const allContent: ContentSummary[] = await contentRes.json();

        let unlockedSlugs: string[] = [];

        // 2. Get unlocked slugs based on auth status
        if (status === "authenticated") {
          const libraryRes = await fetch("/api/library");
          if (libraryRes.ok) {
            const data = await libraryRes.json();
            unlockedSlugs = data.slugs || [];
          }
        } else if (guestId && typeof window !== "undefined") {
          // Scan localStorage for guest unlocks
          Object.keys(window.localStorage).forEach((key) => {
            if (key.startsWith(`${UNLOCK_STORAGE_PREFIX}${guestId}_`)) {
              if (window.localStorage.getItem(key) === "true") {
                const slug = key.replace(`${UNLOCK_STORAGE_PREFIX}${guestId}_`, "");
                unlockedSlugs.push(slug);
              }
            }
          });
        }

        // 3. Filter content
        const unlockedItems = allContent.filter(item => 
          unlockedSlugs.includes(item.slug) || unlockedSlugs.includes(decodeURIComponent(item.slug))
        );
        
        setLibraryContent(unlockedItems);
      } catch (error) {
        console.error("Failed to load library", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadLibrary();
  }, [status, guestId]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft} onClick={() => router.push("/")}>
          <div className={styles.brandMark} />
          <div className={styles.brandText}>
            <span className={styles.brandPrimary}>Omnivael</span>
            <span className={styles.brandSecondary}>Universe</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.walletBadge}>
            <span className={styles.walletLabel}>Shards</span>
            <span className={styles.walletValue}>{balance}</span>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <span className={styles.sidebarBrand}>My Collection</span>
          </div>
          
          <nav className={styles.sidebarNav}>
             <button
              type="button"
              className={styles.navItem}
              onClick={() => router.push("/")}
            >
              <span className={styles.navIconCircle} />
              <span>Storefront</span>
            </button>
            <button
              type="button"
              className={`${styles.navItem} ${styles.navItemActive}`}
            >
              <span className={styles.navIconCircle} />
              <span>Library</span>
            </button>
          </nav>
        </aside>

        <main className={styles.main}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Unlocked Content</h2>
            </div>
            
            {isLoading ? (
               <div className={styles.emptyState}>Syncing neural archives...</div>
            ) : libraryContent.length === 0 ? (
               <div className={styles.emptyState}>
                 Your library is empty. Unlock content from the Storefront to see it here.
               </div>
            ) : (
              <div className={styles.tilesGrid}>
                {libraryContent.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.kind === "comic" ? styles.comicTile : styles.storyTile}
                    onClick={() => router.push(`/reader/${encodeURIComponent(item.slug)}`)}
                  >
                    {item.kind === "comic" ? (
                      <>
                        <div className={styles.comicCover}>
                            {item.cover && (
                                <Image 
                                    src={item.cover} 
                                    alt={item.title} 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{objectFit: 'cover'}}
                                />
                            )}
                        </div>
                        <div className={styles.comicText}>
                          <span className={styles.comicTitle}>{item.title}</span>
                          {item.author && <span className={styles.comicSubtitle}>{item.author}</span>}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.storyHeader}>
                          <span className={styles.storyTitle}>{item.title}</span>
                        </div>
                        <div className={styles.storyMetaRow}>
                          <span className={styles.storyTime}>{item.preview.slice(0, 60)}...</span>
                        </div>
                         <div className={styles.storyMetaRow}>
                            {item.author && <span>{item.author}</span>}
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
