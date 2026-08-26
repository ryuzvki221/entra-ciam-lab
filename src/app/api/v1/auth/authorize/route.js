import { getCurrentSession, signIn } from "@/lib/auth";

const C1_CLAIMS = {
  access_token: {
    acrs: {
      essential: true,
      value: "c1",
    },
  },
};

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }


  const authorizationUrl = await signIn({
    scopes: ["User.ReadWrite"],
    prompt: "consent",
    claims: C1_CLAIMS,
  });

  return Response.redirect(authorizationUrl);
}
