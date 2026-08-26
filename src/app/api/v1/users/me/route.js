import { ProfileController } from "@/services/profile-controller";

const controller = new ProfileController();

export async function GET() {
  try {
    const profile = await controller.getProfile();

    return Response.json(profile);
  } catch (error) {
    if (error?.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/v1/users/me:", error);

    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json();

    await controller.updateProfile(data);

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error?.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error?.code === "InteractionRequiredAuthError") {
      const authorizeUrl = new URL("/api/v1/auth/authorize", request.url);

      return Response.json(
        { authorizeUrl: authorizeUrl.toString() },
        { status: 401 },
      );
    }

    console.error("PATCH /api/v1/users/me:", error);

    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
