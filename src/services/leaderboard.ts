import { type LeaderBoardParams, type LeaderboardResponse } from "@/utils";
import { API_RPG, API_SURVI } from "astro:env/server";

import * as Sentry from "@sentry/astro";

export async function getLeaderboard({
  mode,
  type,
  limit = 150,
  offset = 0,
}: LeaderBoardParams): Promise<LeaderboardResponse> {
  try {
    const baseUrl = mode === "rpg" ? API_RPG : API_SURVI;
    const url = new URL(baseUrl);

    url.searchParams.append("type", type);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());

    const response = await fetch(url);
    const result: LeaderboardResponse = await response.json();

    return result;
  } catch (error ) {
    Sentry.captureException(error);
    return {
      success: false,
      data: [],
      count: 0,
      timestamp: new Date().toISOString(),
    };
  }
}
