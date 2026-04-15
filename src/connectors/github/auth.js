import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const DEFAULT_AUTH_PATH = join(homedir(), ".aidos", "auth.json");
const DEFAULT_PENDING_PATH = join(homedir(), ".aidos", "pending_auth.json");
const SCOPES = "repo read:org";

const SETUP_MESSAGE = `The AIDOS GitHub connector needs a GitHub OAuth App Client ID to authenticate.

Setup steps:
1. Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Set any name and homepage URL. Set callback to https://localhost
3. Enable "Device Flow" on the app page
4. Copy the Client ID (starts with "Iv23li...")
5. Add it to your Claude Desktop config under mcpServers → aidos-github → env → AIDOS_GITHUB_CLIENT_ID
6. Restart Claude Desktop

Full instructions: https://github.com/shobman/aidos/blob/main/src/connectors/github/README.md`;

function invalidClientIdMessage(clientId) {
  const prefix = clientId ? clientId.slice(0, 6) : "(unknown)";
  return `The GitHub OAuth App Client ID appears to be invalid (GitHub returned 404).

Check that:
- The Client ID in your Claude Desktop config matches the one on your OAuth App page
- Device Flow is enabled on the OAuth App (there's a checkbox)
- The OAuth App hasn't been deleted

Your current Client ID starts with: ${prefix}...`;
}

function authPromptMessage(userCode, verificationUri, prefix = "Authentication required.") {
  return `${prefix}

Go to ${verificationUri} and enter code: ${userCode}

Once you've authorised, ask me to open the workspace again.`;
}

function getClientId() {
  const id = process.env.AIDOS_GITHUB_CLIENT_ID;
  return id && id.trim() ? id.trim() : null;
}

export async function loadToken(path = DEFAULT_AUTH_PATH) {
  try {
    const raw = await readFile(path, "utf8");
    const data = JSON.parse(raw);
    if (data?.access_token) return data;
    return null;
  } catch {
    return null;
  }
}

export async function saveToken(path = DEFAULT_AUTH_PATH, token) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify({ ...token, created_at: Date.now() }, null, 2), { mode: 0o600 });
}

async function clearFile(path) {
  try { await rm(path); } catch {}
}

async function loadPending(path) {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function savePending(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2), { mode: 0o600 });
}

async function initiateDeviceFlow(fetchFn, clientId) {
  const res = await fetchFn("https://github.com/login/device/code", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, scope: SCOPES }),
  });
  if (!res.ok) {
    if (res.status === 404) {
      return { error: "invalid_client_id" };
    }
    return { error: `device_code_${res.status}` };
  }
  const body = await res.json();
  const expiresIn = body.expires_in ?? 900;
  return {
    device_code: body.device_code,
    user_code: body.user_code,
    verification_uri: body.verification_uri,
    interval: body.interval ?? 5,
    expires_at: Date.now() + expiresIn * 1000,
  };
}

async function pollToken(fetchFn, clientId, deviceCode) {
  const res = await fetchFn("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      device_code: deviceCode,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    }),
  });
  return res.json();
}

async function validateToken(fetchFn, accessToken) {
  const res = await fetchFn("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function ensureAuth({
  path = DEFAULT_AUTH_PATH,
  pendingPath = DEFAULT_PENDING_PATH,
  fetchFn = fetch,
} = {}) {
  const clientId = getClientId();
  if (!clientId) {
    return { authenticated: false, message: SETUP_MESSAGE };
  }

  const cached = await loadToken(path);
  if (cached?.access_token) {
    const user = await validateToken(fetchFn, cached.access_token);
    if (user?.login) {
      return { authenticated: true, token: cached.access_token, login: user.login };
    }
    await clearFile(path);
  }

  const pending = await loadPending(pendingPath);
  if (pending) {
    if (Date.now() > pending.expires_at) {
      await clearFile(pendingPath);
    } else {
      const poll = await pollToken(fetchFn, clientId, pending.device_code);
      if (poll.access_token) {
        await saveToken(path, poll);
        await clearFile(pendingPath);
        const user = await validateToken(fetchFn, poll.access_token);
        return { authenticated: true, token: poll.access_token, login: user?.login || null };
      }
      if (poll.error === "authorization_pending" || poll.error === "slow_down") {
        return {
          authenticated: false,
          message: `Still waiting for authorisation. Go to ${pending.verification_uri} and enter code: ${pending.user_code}`,
        };
      }
      if (poll.error === "access_denied") {
        await clearFile(pendingPath);
        return {
          authenticated: false,
          message: "Authorisation was denied. Try again and make sure to click 'Authorise' on the GitHub page.",
        };
      }
      await clearFile(pendingPath);
    }
  }

  const newFlow = await initiateDeviceFlow(fetchFn, clientId);
  if (newFlow.error === "invalid_client_id") {
    return { authenticated: false, message: invalidClientIdMessage(clientId) };
  }
  if (newFlow.error) {
    return { authenticated: false, message: `Couldn't start GitHub authentication (${newFlow.error}). Try again in a moment.` };
  }
  await savePending(pendingPath, newFlow);
  return {
    authenticated: false,
    message: authPromptMessage(newFlow.user_code, newFlow.verification_uri),
  };
}
