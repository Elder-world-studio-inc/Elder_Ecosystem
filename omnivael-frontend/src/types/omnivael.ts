export type OmnivaelAssetType = "Book" | "Comic" | "Story";

export interface OmnivaelAsset {
  id: string;
  title: string;
  author: string;
  type: OmnivaelAssetType;
  cover: string;
  description: string;
  price: number;
}

export interface OmnivaelLibraryResponse {
  message: string;
  count: number;
  items: OmnivaelAsset[];
}

export interface OmnivaelUser {
  shard_balance: number;
  nexus_level: number;
  nexus_xp: number;
  is_elite: boolean;
}
