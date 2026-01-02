import type { PlayerProfileResponse, PlayerProfileError } from "@/utils";
import { API_PLAYERS_RPG } from "astro:env/server";
import * as Sentry from "@sentry/astro";

export interface ProfileResult {
  success: true;
  data: PlayerProfileResponse["data"];
  cached: boolean;
}

export interface ProfileError {
  success: false;
  error: PlayerProfileError;
}

export type GetProfileResult = ProfileResult | ProfileError;

/**
 * Fetches a player profile from the API
 * 
 * Caching strategy:
 * - Relies on Vercel CDN caching via Cache-Control headers set on the page
 * - API upstream has its own caching (X-Cache-Status header)
 * - No in-memory cache (not reliable in serverless/edge environments)
 * 
 * @param identifier - Player UUID or username
 * @returns Player profile data or error
 */
export async function getPlayerProfile(
  identifier: string
): Promise<GetProfileResult> {
  try {
    const baseUrl = API_PLAYERS_RPG;
    const url = `${baseUrl}/${encodeURIComponent(identifier)}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });

    // Check for cache status from upstream API
    const cacheStatus = response.headers.get("X-Cache-Status");
    const apiCached = cacheStatus === "HIT";

    if (!response.ok) {
      const errorData: PlayerProfileError = await response.json();
      
      return {
        success: false,
        error: {
          statusCode: response.status,
          error: errorData.error || "Unknown Error",
          message: errorData.message || `Player "${identifier}" not found`,
        },
      };
    }

    const responseData: PlayerProfileResponse = await response.json();

    return {
      success: true,
      data: responseData.data,
      cached: apiCached,
    };
  } catch (error) {
    Sentry.captureException(error);
    
    return {
      success: false,
      error: {
        statusCode: 500,
        error: "Network Error",
        message: "No se pudo conectar con el servidor. Intenta de nuevo más tarde.",
      },
    };
  }
}

/**
 * Validates if a player exists without fetching full profile
 * 
 * @param identifier - Player UUID or username
 * @returns boolean indicating if player exists
 */
export async function playerExists(identifier: string): Promise<boolean> {
  const result = await getPlayerProfile(identifier);
  return result.success;
}
