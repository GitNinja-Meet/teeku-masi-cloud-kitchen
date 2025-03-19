"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { auth } from "../utils/firebase";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Basic validation
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      // Sign in with email and password (using Firebase Authentication)
      await signInWithEmailAndPassword(auth, username, password);
      alert("Login successful!");
      router.push("/admin-dashboard"); // Redirect to admin dashboard
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center px-6">
        <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded-full w-full"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Don’t have an admin account?{" "}
          <button
            onClick={() => router.push("/admin-register")}
            className="text-gray-900 font-medium hover:underline"
          >
            Register here
          </button>
        </p>
      </main>
      <Footer />
    </div>
  );
}
