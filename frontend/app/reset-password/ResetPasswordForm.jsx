"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-6 bg-red-100 rounded shadow">
        <p className="text-red-800 text-center">
          Token za resetovanje nedostaje.
        </p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      }
    );

    const data = await res.json();
    alert(data.message);

    if (res.ok) router.push("/login");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl mb-4 text-center">Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-3 mb-4 border rounded"
        required
      />
      <button className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">
        Update Password
      </button>
    </form>
  );
}
