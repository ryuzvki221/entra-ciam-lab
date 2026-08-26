"use client";

import { useState } from "react";
import { useAccount } from "../_hooks/useAccount";
import { ProfileField } from "./ProfileField";

const EDITABLE_FIELDS = [
    { id: "givenName", label: "First name" },
    { id: "surname", label: "Last name" },
];

const READONLY_FIELDS = [
    { id: "mail", label: "Email", type: "email" },
    { id: "orcidId", label: "ORCID" },
];

export default function AccountProfile({ session }) {

    const { account, loading, error, refresh } = useAccount();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);

    const [form, setForm] = useState({
        givenName: "",
        surname: "",
    });

    function startEditing() {
        if (!account) {
            return;
        }

        setForm({
            givenName: account.givenName ?? "",
            surname: account.surname ?? "",
        });

        setFormError(null);

        if (!session.C1Satisfied) {
            window.location.href = "/api/v1/auth/authorize";
            return;
        }

        setEditing(true);
    }

    function cancelEditing() {
        if (!account) {
            return;
        }

        setFormError(null);

        setForm({
            givenName: account.givenName ?? "",
            surname: account.surname ?? "",
        });

        setEditing(false);
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setFormError(null);

        try {
            const response = await fetch("/api/v1/users/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (response.status === 401) {
                const body = await response.json();

                if (body?.authorizeUrl) {
                    window.location.href = body.authorizeUrl;
                    return;
                }

                throw new Error("Unauthorized");
            }

            if (!response.ok) {
                throw new Error("Unable to update profile");
            }

            await refresh();

            setEditing(false);
        } catch (err) {
            console.error("Update profile failed:", err);
            setFormError("Impossible de mettre à jour votre profil.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="container py-5">
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !account) {
        return (
            <main className="container py-5">
                <div className="alert alert-danger">
                    Impossible de charger votre profil.
                </div>
            </main>
        );
    }

    return (
        <main className="container py-5">
            <div className="mb-5">
                <h1 className="mb-2">
                    Hello, {session.name || "User"}!
                </h1>

                <p className="text-muted mb-0">
                    Manage your account information.
                </p>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Profile information</h5>
                </div>

                <div className="card-body p-5">
                    {formError && (
                        <div className="alert alert-danger" role="alert">
                            {formError}
                        </div>
                    )}

                    <form id="profile-form" onSubmit={handleSubmit}>
                        <div className="row g-4">
                            {EDITABLE_FIELDS.map(({ id, label }) => (
                                <ProfileField
                                    key={id}
                                    id={id}
                                    label={label}
                                    value={editing ? form[id] : account[id] ?? ""}
                                    onChange={handleChange}
                                    editable={editing}
                                    disabled={saving}
                                />
                            ))}

                            {READONLY_FIELDS.map(({ id, label, type }) => (
                                <ProfileField
                                    key={id}
                                    id={id}
                                    label={label}
                                    type={type}
                                    value={account[id] ?? ""}
                                    editable={false}
                                />
                            ))}
                        </div>
                    </form>
                </div>

                <div className="card-footer bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-1">Manage your account</h6>
                            <p className="text-muted mb-0">
                                Update your profile or sign out.
                            </p>
                        </div>

                        <div className="d-flex gap-2">
                            {!editing ? (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={startEditing}
                                >
                                    Edit profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={cancelEditing}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        form="profile-form"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                </>
                            )}

                            <form action="/api/v1/auth/signOut" method="POST">
                                <button
                                    type="submit"
                                    className="btn btn-outline-danger"
                                >
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}