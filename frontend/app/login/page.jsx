"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormMessage from "../../components/FormMessage";

const API_URL = "http://18.215.64.181:30080";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.message);
        return;
      }

      setMessageType("success");
      setMessage("You are logged in.");
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (err) {
      setMessageType("error");
      setMessage(data.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="text"
          placeholder="E-mail"
          className="w-full p-3 mb-4 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormMessage message={message} type={messageType} />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer">
          Login
        </button>
        <p className="text-center mt-3 text-sm">
          <a href="/forgot-password" className="text-blue-600">
            Forgot Password?
          </a>
        </p>
        <p className="text-center mt-3 text-sm">
          Don’t have an account?
          <a href="/register" className="text-blue-600 ml-1">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
