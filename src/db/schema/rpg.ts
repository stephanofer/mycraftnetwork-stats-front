import {
  bigint,
  decimal,
  int,
  mysqlTable,
  text,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

export const deluxeCombatPlayers = mysqlTable("DELUXECOMBAT_PLAYERLIST", {
  id: int("ID").primaryKey().autoincrement(),
  uuid: varchar("UUID", { length: 64 }),
  name: varchar("NAME", { length: 64 }),
});

export const deluxeCombatStats = mysqlTable("DELUXECOMBAT_STATS", {
  id: int("ID").notNull(),
  kills: int("KILLS"),
  deaths: int("DEATHS"),
  combatLogs: int("COMBATLOGS"),
  streak: int("STREAK"),
  maxStreak: int("MAX_STREAK"),
});

export const ajlbKothWins = mysqlTable("ajlb_zkothdata_total_wins", {
  id: varchar("id", { length: 36 }).primaryKey(),
  value: decimal("value", { precision: 65, scale: 2, mode: "number" }),
  dailyDelta: decimal("daily_delta", { precision: 65, scale: 2, mode: "number" }),
  weeklyDelta: decimal("weekly_delta", { precision: 65, scale: 2, mode: "number" }),
});

export const luckPermsPlayers = mysqlTable("luckperms_players", {
  uuid: varchar("uuid", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 16 }).notNull(),
  primaryGroup: varchar("primary_group", { length: 36 }).notNull(),
});

const permissionColumns = {
  id: int("id").primaryKey().autoincrement(),
  permission: varchar("permission", { length: 200 }).notNull(),
  value: tinyint("value").notNull(),
  server: varchar("server", { length: 36 }).notNull(),
  world: varchar("world", { length: 64 }).notNull(),
  expiry: bigint("expiry", { mode: "number" }).notNull(),
  contexts: varchar("contexts", { length: 200 }).notNull(),
};

export const luckPermsUserPermissions = mysqlTable("luckperms_user_permissions", {
  ...permissionColumns,
  uuid: varchar("uuid", { length: 36 }).notNull(),
});

export const luckPermsGroupPermissions = mysqlTable("luckperms_group_permissions", {
  ...permissionColumns,
  name: varchar("name", { length: 36 }).notNull(),
});

export const kothPlayers = mysqlTable("koth_players", {
  uuid: varchar("uuid", { length: 36 }).primaryKey(),
  lastSeen: timestamp("last_seen"),
});

export const kothStats = mysqlTable("koth_stats", {
  playerUuid: varchar("player_uuid", { length: 36 }).notNull(),
  kothName: varchar("koth_name", { length: 64 }).notNull(),
  wins: int("wins"),
});

export const duelPlayers = mysqlTable("duels_player_table", {
  uniqueId: varchar("UniqueId", { length: 255 }),
  lastTimePlayed: text("LastTimePlayed"),
  otherStats: text("OtherStats"),
});

export const duelHistory = mysqlTable("history_records_table", {
  uniqueId: varchar("UniqueId", { length: 255 }),
  arenaId: text("ArenaId"),
  modeId: text("ModeId"),
  matchType: text("MatchType"),
  kills: int("Kills"),
  deaths: int("Deaths"),
  status: int("Status"),
  createdAt: bigint("CreatedAt", { mode: "number" }),
});

export const clans = mysqlTable("clans", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }),
  leader: varchar("leader", { length: 50 }),
  totalMembers: tinyint("total_members").notNull(),
  kills: int("kills").notNull(),
  deaths: int("deaths").notNull(),
  level: int("level").notNull(),
  slots: int("slots").notNull(),
  prefix: varchar("prefix", { length: 255 }),
  privacy: varchar("privacy", { length: 50 }),
});

export const clanPlayers = mysqlTable("players", {
  uuid: varchar("uuid", { length: 50 }),
  name: varchar("name", { length: 50 }).notNull(),
  kills: int("kills").notNull(),
  deaths: int("deaths").notNull(),
  role: tinyint("ranks").notNull(),
  clanId: bigint("clan_id", { mode: "number" }).notNull(),
});

export const clanAllies = mysqlTable("clans_allies", {
  clanId: bigint("clan_id", { mode: "number" }).notNull(),
  allyId: bigint("ally_id", { mode: "number" }).notNull(),
});
