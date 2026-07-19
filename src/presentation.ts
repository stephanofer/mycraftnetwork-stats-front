import type { RankingMetric } from "@/modules/rankings/ranking.types";

export const metricLabels: Record<RankingMetric, string> = {
  kills: "Kills",
  maxstreak: "Mejor racha",
  koth: "Victorias KOTH",
};

export const formatNumber = (value: number) => new Intl.NumberFormat("es-ES").format(value);

export const formatDate = (value: Date | null) => value
  ? new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(value)
  : "Sin actividad registrada";

export function slugify(value: string): string {
  const slug = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug || "clan";
}

export function labelDuelMode(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
