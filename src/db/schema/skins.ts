import { bigint, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const skinPlayers = mysqlTable("sr_players", {
  uuid: varchar("uuid", { length: 36 }).primaryKey(),
  identifier: varchar("skin_identifier", { length: 2083 }),
  variant: varchar("skin_variant", { length: 20 }),
  type: varchar("skin_type", { length: 20 }),
});

export const playerSkins = mysqlTable("sr_player_skins", {
  uuid: varchar("uuid", { length: 36 }).primaryKey(),
  value: text("value").notNull(),
  timestamp: bigint("timestamp", { mode: "number" }).notNull(),
});

export const urlSkins = mysqlTable("sr_url_skins", {
  url: varchar("url", { length: 266 }).primaryKey(),
  value: text("value").notNull(),
  variant: varchar("skin_variant", { length: 20 }),
});
