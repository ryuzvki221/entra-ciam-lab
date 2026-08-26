import { getCurrentSession } from "@/lib/auth";

import Link from "next/link";

export default async function Home() {
  const session = await getCurrentSession();

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-5 text-center">
              <h1 className="mb-3">Entra CIAM Lab</h1>

              {session ? (
                <>
                  <p className="text-muted mb-4">
                    Vous êtes connecté en tant que{" "}
                    <strong>
                      {session.name ?? session.email}
                    </strong>
                  </p>

                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      href="/account"
                      className="btn btn-primary"
                    >
                      Mon compte
                    </Link>

                    <form
                      action="/api/v1/auth/signOut"
                      method="post"
                      className="d-inline"
                    >
                      <button
                        type="submit"
                        className="btn btn-outline-danger"
                      >
                        Se déconnecter
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted mb-4">
                    Connectez-vous avec Microsoft Entra CIAM
                  </p>

                  <form
                    action="/api/v1/auth/signIn"
                    method="get"
                  >
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      Se connecter
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}