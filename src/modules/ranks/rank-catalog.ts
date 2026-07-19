export interface WebRank {
  id: string;
  label: string;
  shortLabel: string;
  category: "player" | "donor" | "creator" | "staff" | "special";
  theme: string;
  icon?: string;
}

const rank = (
  id: string,
  label: string,
  category: WebRank["category"],
  theme: string,
): WebRank => ({ id, label, shortLabel: label, category, theme });

export const WEB_RANKS: Readonly<Record<string, WebRank>> = {
  default: rank("default", "Player", "player", "neutral"),
  novato: rank("novice", "Novice", "player", "neutral"),
  escudero: rank("squire", "Squire", "player", "stone"),
  caballero: rank("knight", "Knight", "player", "steel"),
  guerrero: rank("warrior", "Warrior", "player", "red"),
  berserker: rank("berserker", "Berserker", "player", "red"),
  paladin: rank("paladin", "Paladin", "player", "gold"),
  campeon: rank("champion", "Champion", "player", "gold"),
  elegido: rank("chosen", "Chosen", "player", "purple"),
  heroe: rank("hero", "Hero", "player", "blue"),
  lord: rank("lord", "Lord", "player", "purple"),
  duque: rank("duke", "Duke", "player", "purple"),
  vip: rank("vip", "VIP", "donor", "green"),
  "vip-": rank("vip", "VIP", "donor", "green"),
  "vip+": rank("vip-plus", "VIP+", "donor", "green"),
  mvp: rank("mvp", "MVP", "donor", "aqua"),
  "mvp+": rank("ultra", "Ultra", "donor", "aqua"),
  ultra: rank("ultra", "Ultra", "donor", "aqua"),
  "mvp+tresme": rank("ultra-plus", "Ultra++", "donor", "aqua"),
  elite: rank("deluxe", "Deluxe", "donor", "gold"),
  deluxe: rank("deluxe", "Deluxe", "donor", "gold"),
  titan: rank("titan", "Titanium", "donor", "purple"),
  infernal: rank("infernal", "Infernal", "donor", "red"),
  prestige: rank("prestige", "Prestige", "donor", "purple"),
  ultimate: rank("ultimate", "Ultimate", "donor", "gold"),
  legend: rank("legend", "Legend", "donor", "purple"),
  infinity: rank("infinity", "Infinity", "donor", "aqua"),
  youtuber: rank("youtuber", "YouTuber", "creator", "red"),
  streamer: rank("streamer", "Streamer", "creator", "purple"),
  tiktok: rank("tiktok", "TikTok", "creator", "red"),
  miniyt: rank("miniyt", "Mini YT", "creator", "red"),
  aniver: rank("anniversary", "Anniversary", "special", "gold"),
  anivernuevo: rank("anniversary", "Anniversary", "special", "gold"),
  thebest: rank("the-best", "The Best", "special", "gold"),
  topdonador: rank("top-donor", "Top Donor", "special", "gold"),
  aprendiz: rank("apprentice", "Apprentice", "staff", "blue"),
  ayudante: rank("helper", "Helper", "staff", "blue"),
  moderador: rank("moderator", "Moderator", "staff", "blue"),
  smod: rank("senior-moderator", "Senior Moderator", "staff", "blue"),
  admin: rank("admin", "Admin", "staff", "red"),
  owner: rank("owner", "Owner", "staff", "dark-red"),
};

export function rankFromCatalog(group: string): WebRank {
  return WEB_RANKS[group] ?? WEB_RANKS.default;
}

export function isPublicRank(group: string): boolean {
  return Object.hasOwn(WEB_RANKS, group);
}
