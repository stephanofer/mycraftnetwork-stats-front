export interface ResolvedSkin {
  renderId: string | null;
  variant: "classic" | "slim";
  fallback: boolean;
}

export interface SkinSelection {
  uuid: string;
  identifier: string | null;
  variant: string | null;
  type: string | null;
}

export interface StoredTexture {
  key: string;
  value: string;
}
