import { acquireTokenByCode } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return new Response("Missing authorization code", {
        status: 400,
      });
    }

    const token = await acquireTokenByCode({ code });

    if (!token.account) {
      return new Response("MSAL account not found", {
        status: 401,
      });
    }

    await createSession(token.account);

    return Response.redirect(new URL("/account", request.url));
  } catch (error) {
    console.error("MSAL callback error:", error);

    return new Response("Authentication failed", {
      status: 500,
    });
  }
}
