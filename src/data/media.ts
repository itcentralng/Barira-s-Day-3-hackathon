import catalog from "./photos.generated.json";

type AssetPointer = { url: string; original_filename: string };

// Every uploaded exhibition asset lives as a CDN pointer under src/assets/archive.
const pointers = import.meta.glob<AssetPointer>("../assets/archive/**/*.asset.json", {
  eager: true,
  import: "default",
});

const urlByKey: Record<string, string> = {};
for (const [path, pointer] of Object.entries(pointers)) {
  const key = path.replace("../assets/archive/", "").replace(/\.asset\.json$/, "");
  urlByKey[key] = pointer.url;
}

/** Resolve an archive asset (e.g. "aircraft/a-29.jpg") to its URL. Throws if missing. */
export function assetUrl(key: string): string {
  const url = urlByKey[key];
  if (!url) throw new Error(`Missing exhibition asset: ${key}`);
  return url;
}

export type PhotoCategory = "historic" | "chiefs" | "bases" | "aircraft" | "college" | "air-warfare" | "records";

export type Photo = {
  id: string;
  key: string;
  category: PhotoCategory;
  title: string;
  subtitle: string;
  note: string;
  w: number;
  h: number;
  lowRes: boolean;
  /** Image illustrates a topic rather than documenting the dated event itself. */
  context: boolean;
  src: string;
};

export const photos: Photo[] = (catalog as Omit<Photo, "src">[]).map((p) => ({
  ...p,
  category: p.category as PhotoCategory,
  src: assetUrl(p.key),
}));

const byId = new Map(photos.map((p) => [p.id, p]));

export function photo(id: string): Photo {
  const p = byId.get(id);
  if (!p) throw new Error(`Unknown photo id: ${id}`);
  return p;
}

export function photosIn(category: PhotoCategory): Photo[] {
  return photos.filter((p) => p.category === category);
}

export const brand = {
  logo: assetUrl("brand/afcsc-logo.png"),
  crest: assetUrl("college/afcsc-crest.png"),
  flightCutout: assetUrl("brand/a29-flight-cutout.png"),
};

export const film = {
  src: assetUrl("video/birth.mp4"),
  poster: assetUrl("video/birth-poster.jpg"),
  chapterThumb: (n: number) => assetUrl(`video/birth-chapter-${n}.jpg`),
};
