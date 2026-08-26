import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "__Secure-auth.session";

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const secret = Buffer.from(process.env.AUTH_SECRET, "base64");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
};

export async function createSession(account) {
  if (!account?.idTokenClaims?.oid) {
    throw new Error("Compte Entra invalide");
  }

  const token = await new EncryptJWT({
    oid: account.idTokenClaims?.oid,
    name: account.name ?? null,
    C1Satisfied: account.idTokenClaims?.acrs?.includes("c1") ?? false,
  })
    .setProtectedHeader({
      alg: "dir",
      enc: "A256GCM",
    })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .encrypt(secret);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: SESSION_DURATION,
  });
}

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtDecrypt(token, secret);

    return {
      oid: payload.oid,
      name: payload.name,
      C1Satisfied: payload.C1Satisfied,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
}
