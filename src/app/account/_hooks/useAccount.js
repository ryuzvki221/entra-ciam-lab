"use client";

import { useEffect, useState } from "react";

export function useAccount() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function refresh() {
    const response = await fetch(
      "/api/v1/users/me",
    );

    if (!response.ok) {
      throw new Error(
        "Impossible de récupérer le profil",
      );
    }

    const data = await response.json();

    setAccount(data);

    return data;
  }

  useEffect(() => {
    fetch("/api/v1/users/me")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Impossible de récupérer le profil",
          );
        }

        return response.json();
      })
      .then(setAccount)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return {
    account,
    loading,
    error,
    refresh,
  };
}