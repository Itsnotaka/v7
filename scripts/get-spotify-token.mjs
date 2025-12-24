#!/usr/bin/env node
/**
 * One-time script to get Spotify refresh token.
 * Run: node scripts/get-spotify-token.mjs
 *
 * Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env
 */

import http from "node:http";
import { execSync } from "node:child_process";
import { config } from "dotenv";

config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-modify-playback-state",
].join(" ");

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env");
  process.exit(1);
}

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("scope", SCOPES);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`<h1>Error: ${error}</h1>`);
      server.close();
      process.exit(1);
    }

    if (!code) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("<h1>No code received</h1>");
      return;
    }

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`<h1>Token Error: ${data.error}</h1><p>${data.error_description}</p>`);
      server.close();
      process.exit(1);
    }

    console.log("\n=== SUCCESS ===\n");
    console.log("Add this to your .env file:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
    console.log("\n===============\n");

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h1>Success!</h1>
      <p>Copy this refresh token to your .env file:</p>
      <pre style="background:#f0f0f0;padding:1rem;border-radius:4px">${data.refresh_token}</pre>
      <p>You can close this window.</p>
    `);

    server.close();
    process.exit(0);
  }
});

server.listen(PORT, () => {
  console.log(`\nOpening browser for Spotify authorization...\n`);
  console.log(`If browser doesn't open, visit:\n${authUrl.toString()}\n`);

  const platform = process.platform;
  const cmd = platform === "darwin" ? "open" : platform === "win32" ? "start" : "xdg-open";
  try {
    execSync(`${cmd} "${authUrl.toString()}"`);
  } catch {
    // Browser open failed, user can manually visit URL
  }
});
