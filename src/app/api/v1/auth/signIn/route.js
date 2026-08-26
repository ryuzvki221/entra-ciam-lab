import { signIn } from "@/lib/auth";

export async function GET() {
  try {
    const authUrl = await signIn({
      prompt: "select_account",
    });

    return Response.redirect(authUrl);
  } catch (error) {
    console.error("MSAL login error:", error);
    return new Response("Unable to start authentication", { status: 500 });
  }
}
