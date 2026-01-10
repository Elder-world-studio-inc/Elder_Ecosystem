import { NextRequest, NextResponse } from "next/server";
import { OmnivaelLibraryResponse } from "@/types/omnivael";

type ContentKind = "comic" | "prose";

const DUMMY_PROSE_BODY = `
The air shimmered around the Vaelt Crystalund, its facets catching raw victonium. Temporal energy braided through the streets as distant engines whispered against the evernight sky. The echo that reached the library tonight carried more than a story—it carried a choice.

Joren adjusted the lens of his ocular implant, zooming in on the script etched into the crystal's surface. It was old dialect, Pre-Fracture. "To bind the shadow," he murmured, translating slowly, "one must first become the light that casts it."

He sat back, the heavy wooden chair groaning under his weight. The Archives were silent, save for the low hum of the stasis fields protecting the rarest tomes. He wasn't supposed to be here. The High Council had forbidden access to the Section of Whispers three cycles ago, after the incident with the Novice and the Void-Mirror. But Joren had never been one for rules, especially when the fate of his sister hung in the balance.

"Light that casts it..." he repeated. He stood up and paced the narrow aisle between the towering shelves. The smell of ozone and old parchment filled his nostrils—the scent of forbidden knowledge.

A soft chime echoed from his wrist comm. It was Kael. "Joren, the patrols are shifting. You have five minutes before the sentinels sweep the sector. Get out of there."

"I haven't found it yet, Kael," Joren whispered back, his eyes darting to the chronometer on the wall. "The cipher is incomplete. If I leave now, we lose the trail forever."

"If you stay, you lose your life," Kael’s voice was tense, clipped. "And I’m not dragging your carcass out of the containment brig again."

Joren smirked, though fear was a cold knot in his stomach. He turned back to the crystal. There was something he was missing. A pattern. He traced the glowing lines with a gloved finger. The energy pulsed warm against his skin, rhythmic, almost like a heartbeat.

And then he saw it. Not in the text, but in the space between the glyphs. A negative space map of the City of Glass.

"I found it," Joren breathed. "It's not a spell. It's a coordinate."

"Three minutes, Joren!"

He grabbed his datapad and scanned the crystal face, the blue light washing over his determined features. "Uploading now. Prepare the jump-skiff. We're going to the Spires."

As the download bar hit 100%, the lights in the archive flickered and turned a deep, warning red. A mechanical voice boomed from the ceiling: "UNAUTHORIZED BIO-SIGN DETECTED. SECTOR LOCKDOWN INITIATED."

"Run," Kael shouted over the comms.

Joren didn't need telling twice. He sprinted towards the service hatch, the heavy blast doors beginning to grind shut behind him. The adventure was just beginning.
`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const apiUrl = `${baseUrl}/api/omnivael/library`;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 0 }, // No cache for fresh data
    });

    if (!res.ok) {
      console.error("Failed to fetch from Admin Engine:", res.status, res.statusText);
      // Fallback to empty array or error
      return NextResponse.json([], { status: res.status });
    }

    const data: OmnivaelLibraryResponse = await res.json();

    const mappedContent = data.items.map((item) => ({
      id: item.id,
      // Create a URL-friendly slug from the ID or Title. 
      // Using ID is safer if unique, but title is better for SEO. 
      // For now, let's use the ID to ensure we can find it back easily.
      slug: item.id, 
      title: item.title,
      kind: item.type === "Comic" ? "comic" : "prose",
      priceShards: item.price,
      isMature: false, // Default as not provided by API
      preview: item.description,
      body: item.type === "Comic" ? item.description : (item.description + "\n\n" + DUMMY_PROSE_BODY + "\n\n" + DUMMY_PROSE_BODY + "\n\n" + DUMMY_PROSE_BODY), // Inject dummy body for prose
      cover: item.cover,
      author: item.author,
      pages: item.type === "Comic" ? [
          item.cover, // Cover as page 1
          "https://placehold.co/800x1200/1a1a1a/cyan?text=Page+2",
          "https://placehold.co/800x1200/1a1a1a/cyan?text=Page+3",
          "https://placehold.co/800x1200/1a1a1a/cyan?text=End+of+Preview"
      ] : [],
    }));

    if (slug) {
      // Find by ID (which we mapped to slug)
      const item = mappedContent.find(
        (entry) => entry.slug === slug || entry.title.toLowerCase().replace(/\s+/g, "-") === slug
      );
      if (!item) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    return NextResponse.json(mappedContent);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

