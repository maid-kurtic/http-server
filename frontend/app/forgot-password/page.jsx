"use client";
import { useState } from "react";
export const dynamic = "force-dynamic";
import FormMessage from "../../components/FormMessage";

const API_URL = "http://18.215.64.181:30080";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessageType("error");
      setMessage(data.message);
      return;
    }
    setMessageType("succes");
    setMessage(data.message);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl mb-4 text-center">Forgot Password</h2>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-4 border rounded"
        required
      />
      <FormMessage message={message} type={messageType} />

      <button className="cursor-pointer w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
        Send Reset Link
      </button>
    </form>
  );
}
