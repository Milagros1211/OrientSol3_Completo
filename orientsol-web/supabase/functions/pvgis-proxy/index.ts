// @ts-nocheck
// Supabase Edge Function: pvgis-proxy
// Secure server-side proxy for European Commission JRC PVGIS API
// Provides CORS headers, parameter validation, rate-limiting resilience, and 24h caching.

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use GET." }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    const rawLat = url.searchParams.get("lat");
    const rawLon = url.searchParams.get("lon");

    if (!rawLat || !rawLon) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: lat and lon." }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const lat = parseFloat(rawLat);
    const lon = parseFloat(rawLon);

    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lon) || lon < -180 || lon > 180) {
      return new Response(
        JSON.stringify({ error: "Coordinates out of physical bounds (lat: [-90, 90], lon: [-180, 180])." }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const roundedLat = Math.round(lat * 10000) / 10000;
    const roundedLon = Math.round(lon * 10000) / 10000;

    const jrcUrl = `https://re.jrc.ec.europa.eu/api/v5_3/MRcalc?lat=${roundedLat}&lon=${roundedLon}&horirrad=1&avtemp=1&outputformat=json`;

    // Fetch JRC with 8-second timeout and 1 retry on 429/529
    let jrcResp: Response | null = null;
    let attempts = 0;
    while (attempts < 2) {
      attempts++;
      jrcResp = await fetch(jrcUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });

      if (jrcResp.status === 429 || jrcResp.status === 529) {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      break;
    }

    if (!jrcResp || !jrcResp.ok) {
      return new Response(
        JSON.stringify({
          error: `PVGIS upstream error: ${jrcResp?.status || 500} ${jrcResp?.statusText || "Service unavailable"}`,
        }),
        {
          status: jrcResp?.status || 502,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    const data = await jrcResp.text();

    return new Response(data, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, s-maxage=86400", // 24-hour cache
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Internal server error in pvgis-proxy" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
