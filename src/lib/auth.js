import { client } from "./msal";
import { getSession, destroySession } from "./session";

const DEFAULT_SCOPES = ["openid", "profile", "offline_access"];

export async function signIn({
  scopes = [],
  prompt,
  claims = null,
  redirectUri = process.env.MSAL_REDIRECT_URI,
} = {}) {
  const options = {
    scopes: [...new Set([...DEFAULT_SCOPES, ...scopes])],
    redirectUri,
  };

  if (prompt) {
    options.prompt = prompt;
  }

  if (claims) {
    options.claims = JSON.stringify(claims);
  }

  return client.getAuthCodeUrl(options);
}

export async function signOut(account) {
  await destroySession();

  if (account) {
    await client.getTokenCache().removeAccount(account);
  }
}

export async function getAccountByOid(oid) {
  return await client.getTokenCache().getAccountByLocalId(oid);
}

export async function getCurrentSession() {
  const session = await getSession();

  if (!session?.oid) {
    return null;
  }

  return session;
}

export async function acquireTokenByCode({
  code,
  redirectUri = process.env.MSAL_REDIRECT_URI,
}) {
  if (!code) {
    throw new Error("Authorization code manquant");
  }

  return client.acquireTokenByCode({
    code,
    redirectUri,
  });
}
