"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useWallet } from "../../WalletProvider";
import { useGuest } from "../../GuestProvider";
import styles from "../../page.module.css";
import { ComicReader } from "../../../components/ComicReader";
import { ProseReader } from "../../../components/ProseReader";

type ContentKind = "comic" | "prose";

type Content = {
  slug: string;
  title: string;
  kind: ContentKind;
  priceShards: number;
  isMature: boolean;
  preview: string;
  body: string;
  cover?: string;
  pages?: string[];
};

const UNLOCK_STORAGE_PREFIX = "omnivael_unlocked_";

function useContent(slugParam: string | string[] | undefined) {
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const normalizedSlug = useMemo(() => {
    if (!slug) return undefined;
    return decodeURIComponent(slug);
  }, [slug]);

  const [content, setContent] = useState<Content | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!normalizedSlug) {
      setContent(undefined);
      return;
    }

    let isCancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/content?slug=${encodeURIComponent(normalizedSlug)}`);
        if (!response.ok) {
          setContent(undefined);
          return;
        }
        const data = (await response.json()) as Content;
        if (!isCancelled) {
          setContent(data);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isCancelled = true;
    };
  }, [normalizedSlug]);

  return { content, isLoading };
}

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { spendShards, addShards } = useWallet();
  const { guestId } = useGuest();
  const { content, isLoading } = useContent(params?.slug);
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined" || !guestId || !params?.slug) return false;
    const slugParam = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const normalizedSlug = decodeURIComponent(slugParam);
    const key = `${UNLOCK_STORAGE_PREFIX}${guestId}_${normalizedSlug}`;
    const stored = window.localStorage.getItem(key);
    return stored === "true";
  });

  useEffect(() => {
    if (!content || typeof window === "undefined" || !guestId) return;
    const key = `${UNLOCK_STORAGE_PREFIX}${guestId}_${content.slug}`;
    window.localStorage.setItem(key, unlocked ? "true" : "false");
  }, [content, guestId, unlocked]);

  if (isLoading || !content) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.main}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{isLoading ? "Tuning the echo…" : "Signal Lost"}</h2>
            </div>
            <p>{isLoading ? "Pulling this thread from the Omnivael archive." : "Nothing was found for this thread of the Omnivael."}</p>
            <button className={styles.resumeButton} type="button" onClick={() => router.push("/")}>
              Return to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleUnlock = async () => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/unlock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: content.slug,
            priceShards: content.priceShards,
          }),
        });
        if (!response.ok) {
          return;
        }
        addShards(-content.priceShards);
        setUnlocked(true);
        return;
      } catch {
        return;
      }
    }

    const success = spendShards(content.priceShards);
    if (success) {
      setUnlocked(true);
    }
  };

  const isLocked = content.priceShards > 0 && !unlocked;

  // Render Comic Reader if it's a comic and unlocked
  if (!isLocked && content.kind === "comic" && content.pages && content.pages.length > 0) {
      return <ComicReader pages={content.pages} title={content.title} onExit={() => router.push("/")} />;
  }

  // Render Prose Reader if it's prose and unlocked
  if (!isLocked && content.kind === "prose") {
      return <ProseReader title={content.title} content={content.body} onExit={() => router.push("/")} />;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{content.title}</h2>
            <button className={styles.exitButton} type="button" onClick={() => router.push("/")}>
              Exit
            </button>
          </div>
          <div className={styles.featuredCard}>
            <div className={styles.featuredImageWrapper}>
              <div className={styles.featuredImageFrame}>
                <Image 
                    src={content.cover || "/window.svg"} 
                    alt={content.title} 
                    fill 
                    className={styles.featuredImage} 
                    style={{objectFit: 'cover'}}
                />
              </div>
            </div>
            <div className={styles.featuredContent}>
              {isLocked ? (
                <>
                  <p className={styles.featuredBody}>{content.preview}</p>
                  <p className={styles.featuredBody}>
                    Unlock this {content.kind === "comic" ? "comic" : "story"} to experience the full thread.
                  </p>
                  <button className={styles.resumeButton} type="button" onClick={handleUnlock}>
                    Unlock for {content.priceShards} Shards
                  </button>
                </>
              ) : (
                <>
                  <p className={styles.featuredBody}>{content.body}</p>
                  {content.kind === "prose" && (
                    <p className={styles.featuredBody}>
                        [Full Prose Reader Implementation Pending]
                    </p>
                  )}
                  {content.kind === "comic" && !content.pages?.length && (
                    <p className={styles.featuredBody}>
                        Error: No pages found for this comic.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
