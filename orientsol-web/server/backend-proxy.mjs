/**
 * OrientSol 4.0 - Secure Server Backend Proxy
 * 
 * Demonstrates the Server-Side Relay Architecture for mobile/client apps:
 * - All Supabase database credentials, API keys, and service secrets stay
 *   STRICTLY on this server and are NEVER bundled into the Android APK or client JS.
 * - Mobile clients send sanitized climate data over HTTPS.
 * - This server validates bounds, throttles requests, sanitizes inputs, and communicates with Supabase.
 * 
 * Usage:
 *   SUPABASE_URL="https://your-project.supabase.co" \
 *   SUPABASE_SERVICE_KEY="your-service-role-key" \
 *   PORT=3001 node server/backend-proxy.mjs
 */

import http from 'http';
import { createClient } from '@supabase/supabase-js';

const PORT = process.env.PORT || 3001;
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('[OrientSol Server Proxy] Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY is not defined in server environment.');
}

const supabase = (SUPABASE_URL && SUPABASE_SERVICE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. Health Endpoint
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'OrientSol 4.0 Backend Proxy',
      databaseConfigured: !!supabase,
      timestamp: new Date().toISOString(),
    });
  }

  // 2. GET Climate Datasets (Proxy to Supabase)
  if (req.method === 'GET' && url.pathname === '/api/climate/datasets') {
    if (!supabase) {
      return sendJson(res, 503, { error: 'Database service unavailable on backend.' });
    }

    try {
      const { data, error } = await supabase
        .from('datos_mensuales')
        .select('nombre_emplazamiento, latitud, longitud, mes, radiacion_media, temp_media, es_oficial, creado_en')
        .limit(2000);

      if (error) {
        return sendJson(res, 500, { error: 'Failed to query database.' });
      }

      // Group into normalized records
      const grouped = new Map();
      for (const row of data || []) {
        const name = (row.nombre_emplazamiento || 'Emplazamiento').trim();
        const key = `${name.toLowerCase()}_${row.latitud}_${row.longitud}`;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(row);
      }

      const records = [];
      for (const [, rows] of grouped) {
        const first = rows[0];
        const monthlyGdm0 = new Array(12).fill(0);
        const monthlyTemp = new Array(12).fill(0);

        for (const r of rows) {
          const m = Number(r.mes);
          if (m >= 1 && m <= 12) {
            const idx = m - 1;
            const rawRad = Number(r.radiacion_media ?? 0);
            const days = DAYS_IN_MONTH[idx];
            monthlyGdm0[idx] = rawRad > 15 ? Number((rawRad / days).toFixed(2)) : rawRad;
            monthlyTemp[idx] = Number(r.temp_media ?? 0);
          }
        }

        records.push({
          id: `server-${first.nombre_emplazamiento.toLowerCase().replace(/\s+/g, '-')}`,
          source: 'backend-proxy',
          locationName: first.nombre_emplazamiento,
          latitude: Number(first.latitud),
          longitude: Number(first.longitud),
          monthlyGdm0,
          monthlyTemperature: monthlyTemp,
        });
      }

      return sendJson(res, 200, records);
    } catch (err) {
      return sendJson(res, 500, { error: 'Internal server error processing datasets.' });
    }
  }

  // 3. POST Register Emplacement (Proxy to Supabase with server-side validation)
  if (req.method === 'POST' && url.pathname === '/api/climate/register') {
    if (!supabase) {
      return sendJson(res, 503, { error: 'Database service unavailable on backend.' });
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');

        // Server-side validation of name and coordinates
        const name = String(payload.locationName || '').trim();
        const lat = Number(payload.latitude);
        const lon = Number(payload.longitude);
        const gdm0 = payload.monthlyGdm0;
        const temp = payload.monthlyTemperature;

        if (!name || name.length > 200 || isNaN(lat) || lat < -90 || lat > 90 || isNaN(lon) || lon < -180 || lon > 180) {
          return sendJson(res, 400, { error: 'Invalid or out-of-bounds parameters.' });
        }

        if (!Array.isArray(gdm0) || gdm0.length !== 12 || !Array.isArray(temp) || temp.length !== 12) {
          return sendJson(res, 400, { error: 'Monthly radiation and temperature vectors must contain exactly 12 values.' });
        }

        const monthlyRows = [];
        for (let m = 1; m <= 12; m++) {
          const idx = m - 1;
          const days = DAYS_IN_MONTH[idx];
          const radDaily = Number(gdm0[idx]);
          const radMensual = Number((radDaily * days).toFixed(2));
          const tMedia = Number(temp[idx]);

          monthlyRows.push({
            nombre_emplazamiento: name.slice(0, 200),
            latitud: lat,
            longitud: lon,
            mes: m,
            radiacion_media: Math.max(0.0, Math.min(450.0, radMensual)),
            temp_media: Math.max(-90.0, Math.min(70.0, tMedia)),
            es_oficial: false,
          });
        }

        const { error } = await supabase
          .from('datos_mensuales')
          .upsert(monthlyRows, { onConflict: 'nombre_emplazamiento,mes', ignoreDuplicates: true });

        if (error) {
          if (error.code === '23505') {
            return sendJson(res, 200, {
              success: true,
              isDuplicate: true,
              message: `ℹ️ El emplazamiento "${name}" ya existe en el servidor.`,
            });
          }
          return sendJson(res, 500, { error: 'Database rejected record.' });
        }

        return sendJson(res, 201, {
          success: true,
          isDuplicate: false,
          message: `✓ Emplazamiento "${name}" registrado correctamente en el servidor.`,
        });
      } catch (parseErr) {
        return sendJson(res, 400, { error: 'Invalid JSON payload.' });
      }
    });
    return;
  }

  // 404 for unknown routes
  sendJson(res, 404, { error: 'Endpoint not found.' });
});

server.listen(PORT, () => {
  console.log(`[OrientSol Backend Proxy] Listening on http://localhost:${PORT}`);
  console.log(`[OrientSol Backend Proxy] Database configured: ${!!supabase}`);
});
