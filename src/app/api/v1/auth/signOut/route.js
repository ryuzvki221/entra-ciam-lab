import { signOut, getCurrentSession, getAccountByOid } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return Response.redirect(new URL("/", request.url));
    }

    const account = await getAccountByOid(session.oid);

    if (!account) {
      return Response.json(
        { error: "Microsoft account not found" },
        { status: 404 },
      );
    }

    // Logout application
    await signOut(account);

    // Logout Entra
    const logout = new URL(process.env.AUTH_ENTRA_END_SESSION_ENDPOINT);

    logout.searchParams.set(
      "post_logout_redirect_uri",
      new URL("/", request.url).toString(),
    );

    return Response.redirect(logout);
  } catch (error) {
    console.error("Sign out error:", error);

    return Response.json({ error: "Unable to sign out" }, { status: 500 });
  }
}
