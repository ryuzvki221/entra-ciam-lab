import { getCurrentSession, getAccountByOid } from "@/lib/auth";
import { getUserProfile, updateUserProfile } from "@/lib/microsoft-graph";

export class ProfileController {
  async getProfile() {
    const session = await getCurrentSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const account = await getAccountByOid(session.oid);

    if (!account) {
      throw new Error("Microsoft account not found");
    }

    return getUserProfile(account);
  }

  async updateProfile(data) {
    const session = await getCurrentSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const account = await getAccountByOid(session.oid);
    if (!account) {
      throw new Error("Microsoft account not found");
    }

    return updateUserProfile(account, data);
  }
}
