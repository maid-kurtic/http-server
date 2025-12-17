"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FormMessage from "../../components/FormMessage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-6 bg-red-100 rounded shadow">
        <p className="text-red-800 text-center">Token is not avaliable</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessageType("error");
      setMessage(data.message);
      return;
    }
    setMessageType("success");
    setMessage(data.message);
    setTimeout(() => {
      router.push("/login");
    }, 1500);
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
      <FormMessage message={message} type={messageType} />

      <button className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">
        Update Password
      </button>
    </form>
  );
}
