"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useWallet } from "./WalletProvider";
import styles from "./page.module.css";

type ContentType = "comics" | "stories";

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

type ReaderTheme = "prev" | "dark" | "sepia";

export default function Home() {
  const router = useRouter();
  const { balance } = useWallet();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<ContentType>("comics");
  const [ambientOn, setAmbientOn] = useState(true);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("dark");
  const [content, setContent] = useState<ContentSummary[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingContent(true);
        const response = await fetch("/api/content");
        if (!response.ok) {
          setContent([]);
          return;
        }
        const data = (await response.json()) as ContentSummary[];
        setContent(data);
      } finally {
        setIsLoadingContent(false);
      }
    };

    void load();
  }, []);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
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
          <div className={styles.userGreeting}>
            <div className={styles.avatar}>
              <Image src="/file.svg" alt="User avatar" width={28} height={28} />
            </div>
            <span className={styles.welcomeText}>
              {status === "authenticated"
                ? `Welcome, ${session?.user?.name ?? "Veryfinder"}`
                : "Welcome, Veryfinder"}
            </span>
          </div>
          <div className={styles.headerIcons}>
            {status === "unauthenticated" && (
                <>
                    <button onClick={() => signIn()} className={styles.authButton} type="button">Sign In</button>
                    <button onClick={() => signIn()} className={styles.authButton} type="button">Join</button>
                </>
            )}
            <button className={styles.iconButton} aria-label="Search (coming soon)" type="button">
              <span className={styles.iconSearch} />
            </button>
            <button className={styles.iconButton} aria-label="Notifications (coming soon)" type="button">
              <span className={styles.iconBell} />
            </button>
            <button className={styles.iconButton} aria-label="Bookmarks (coming soon)" type="button">
              <span className={styles.iconBookmark} />
            </button>
            {status === "authenticated" && (
                <button
                className={styles.iconButton}
                type="button"
                onClick={() => signOut()}
                aria-label="Sign Out"
                >
                <span className={styles.iconSettings} />
                </button>
            )}
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <span className={styles.sidebarBrand}>Omnivael Universe</span>
          </div>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabelRow}>
              <span className={styles.sidebarLabel}>Library</span>
              <span className={styles.sidebarPercent}>75%</span>
            </div>
            <div className={styles.sidebarProgressTrack}>
              <div className={styles.sidebarProgressFill} />
            </div>
          </div>
          <nav className={styles.sidebarNav}>
            <button
              type="button"
              className={`${styles.navItem}`}
              onClick={() => router.push("/library")}
            >
              <span className={styles.navIconCircle} />
              <span>Library</span>
            </button>
            <button
              type="button"
              className={`${styles.navItem} ${styles.navItemActive}`}
              onClick={() => setActiveTab("comics")}
            >
              <span className={styles.navIconCircle} />
              <span>Comics</span>
            </button>
            <button
              type="button"
              className={styles.navItem}
              onClick={() => setActiveTab("stories")}
            >
              <span className={styles.navIconCircle} />
              <span>Short Stories</span>
            </button>
            <button
              type="button"
              className={styles.navItem}
              onClick={() => router.push("/world-lore")}
            >
              <span className={styles.navIconCircle} />
              <span>World Lore</span>
            </button>
            <button
              type="button"
              className={styles.navItem}
              onClick={() => router.push("/forums")}
            >
              <span className={styles.navIconCircle} />
              <span>Forums</span>
            </button>
          </nav>
        </aside>

        <main className={styles.main}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Continue Your Journey</h2>
            </div>
            <div className={styles.continueCard}>
              <div className={styles.continueLeft}>
                <div className={styles.continueLabelRow}>
                  <span className={styles.contentType}>Comic:</span>
                  <span className={styles.contentTitle}>AEON’S ECHO – Nebula Curse</span>
                </div>
                <button
                  className={styles.resumeButton}
                  type="button"
                  onClick={() => router.push(`/reader/${encodeURIComponent("aeon’s-echo")}`)}
                >
                  Resume Reading
                </button>
              </div>
              <div className={styles.continueRight}>
                <div className={styles.progressRow}>
                  <span className={styles.progressText}>45%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} />
                </div>
              </div>
              <button className={styles.kebabButton} aria-label="More options">
                <span />
                <span />
                <span />
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.tabsHeader}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${
                    activeTab === "comics" ? styles.tabActive : ""
                  }`}
                  onClick={() => setActiveTab("comics")}
                >
                  Comics
                </button>
                <button
                  className={`${styles.tab} ${
                    activeTab === "stories" ? styles.tabActive : ""
                  }`}
                  onClick={() => setActiveTab("stories")}
                >
                  Short Stories
                </button>
              </div>
            </div>
            <div className={styles.tilesGrid}>
              {isLoadingContent && <div className={styles.storyTime}>Loading threads…</div>}
              {!isLoadingContent &&
                (content.length === 0 ? (
                  <div className={styles.storyTime}>No threads have been published yet.</div>
                ) : (
                  content
                    .filter((item) => (activeTab === "comics" ? item.kind === "comic" : item.kind === "prose"))
                    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={activeTab === "comics" ? styles.comicTile : styles.storyTile}
                        onClick={() =>
                          router.push(
                            `/reader/${encodeURIComponent(item.slug)}`,
                          )
                        }
                      >
                        {activeTab === "comics" ? (
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
                              <span className={styles.comicSubtitle}>{item.priceShards} Shards</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.storyHeader}>
                              <span className={styles.storyTitle}>{item.title}</span>
                              <span className={styles.badgeNew}>New</span>
                            </div>
                            <div className={styles.storyMetaRow}>
                              <span className={styles.storyTime}>{item.preview}</span>
                            </div>
                            <div className={styles.storyMetaRow}>
                                {item.author && <span>{item.author}</span>}
                                <span>{item.priceShards} Shards</span>
                            </div>
                          </>
                        )}
                      </button>
                    ))
                ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Newest Arrivals</h2>
            </div>
            <div className={styles.featuredCard}>
              <button
                className={styles.exitButton}
                type="button"
                onClick={() => router.push("/")}
              >
                Exit
              </button>
              <div className={styles.featuredImageWrapper}>
                <div className={styles.featuredImageFrame}>
                  <Image
                    src="/window.svg"
                    alt="AEON’S ECHO cover"
                    fill
                    className={styles.featuredImage}
                  />
                </div>
              </div>
              <div className={styles.featuredContent}>
                <h3 className={styles.featuredTitle}>AEON’S ECHO – Nebula Curse</h3>
                <p className={styles.featuredBody}>
                  The air shimmered around the Vaelt Crystalund, its facets catching raw victonium. Temporal
                  energy braided through the streets as distant engines whispered against the evernight sky. The
                  echo that reached the library tonight carried more than a story—it carried a choice.
                </p>
                <div className={styles.featuredInline}>
                  <span className={styles.badgeNew}>New</span>
                  <span className={styles.loreKeyword}>VAS-OPTHALE</span>
                </div>
                <button
                  className={styles.seeMoreButton}
                  type="button"
                  onClick={() => router.push(`/reader/${encodeURIComponent("aeon’s-echo")}`)}
                >
                  See more…
                </button>
              </div>

              <div className={styles.readerFooter}>
                <div className={styles.themeControls}>
                  <button
                    className={`${styles.themeButton} ${
                      readerTheme === "prev" ? styles.themeButtonActive : ""
                    }`}
                    onClick={() => setReaderTheme("prev")}
                  >
                    Prev
                  </button>
                  <button
                    className={`${styles.themeButton} ${
                      readerTheme === "dark" ? styles.themeButtonActive : ""
                    }`}
                    onClick={() => setReaderTheme("dark")}
                  >
                    Dark
                  </button>
                  <button
                    className={`${styles.themeButton} ${
                      readerTheme === "sepia" ? styles.themeButtonActive : ""
                    }`}
                    onClick={() => setReaderTheme("sepia")}
                  >
                    Sepia
                  </button>
                </div>

                <div className={styles.readerCenter}>
                  <button
                    className={`${styles.ambientToggle} ${
                      ambientOn ? styles.ambientToggleOn : ""
                    }`}
                    onClick={() => setAmbientOn((value) => !value)}
                  >
                    <span className={styles.waveIconLeft} />
                    <span className={styles.ambientText}>
                      Ambient Sound: {ambientOn ? "On" : "Off"}
                    </span>
                    <span className={styles.waveIconRight} />
                  </button>
                  <div className={styles.pagination}>3/25</div>
                </div>

                <div className={styles.readerRight}>
                  <span className={styles.soundscapeLabel}>
                    Reading Soundscape: Lo-fi Starship Hum
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
