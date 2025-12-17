"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormMessage from "../../components/FormMessage";

const API_URL = "http://18.215.64.181:30080";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessageType("success");
      setMessage("Registration successful.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setMessageType("error");
      setMessage("Server error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        noValidate
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="e-mail"
          className="w-full p-3 mb-4 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormMessage message={message} type={messageType} />

        <button className="cursor-pointer w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
          Create Account
        </button>

        <p className="text-center mt-3 text-sm">
          Already have an account?
          <a href="/login" className="text-blue-600 ml-1">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
