/**
 * IndexNow Key Verification Endpoint
 *
 * Returns the IndexNow verification key as plain text.
 * Search engines (Bing, Yandex) use this to verify site ownership.
 *
 * The key is read from the INDEXNOW_KEY environment variable.
 *
 * Requirements: 7.4
 */

import type { APIRoute } from 'astro';

// Server-side only - do not prerender
export const prerender = false;

// Cache for 24 hours
const CACHE_MAX_AGE = 60 * 60 * 24;

/**
 * Validate IndexNow key format
 * Must be 8-128 hexadecimal characters
 */
function isValidIndexNowKey(key: string): boolean {
  return /^[a-f0-9]{8,128}$/i.test(key);
}

export const GET: APIRoute = async () => {
  try {
    // Get the IndexNow key from environment variable
    const indexNowKey = import.meta.env.INDEXNOW_KEY || process.env.INDEXNOW_KEY;

    if (!indexNowKey) {
      return new Response(
        JSON.stringify({ error: 'IndexNow key not configured' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate key format
    if (!isValidIndexNowKey(indexNowKey)) {
      return new Response(
        JSON.stringify({ error: 'Invalid IndexNow key format' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return the key as plain text (IndexNow verification requirement)
    return new Response(indexNowKey, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
      },
    });
  } catch (error) {
    console.error('IndexNow key endpoint error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
