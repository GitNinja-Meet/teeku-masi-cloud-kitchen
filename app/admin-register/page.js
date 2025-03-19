"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { auth, db } from "../utils/firebase";

export default function AdminRegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const generateCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit random code
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!firstName || !lastName || !email || !password || !securityCode) {
      setError("All fields are required.");
      return;
    }

    // Validate the security code
    if (securityCode !== "1511") {
      setError("Invalid security code.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);

      // Generate a 5-digit code and save admin details in Firestore
      const code = generateCode();
      await addDoc(collection(db, "admins"), {
        firstName,
        lastName,
        email,
        code,
      });

      setGeneratedCode(code); // Display the generated code
      setSuccess("Admin registered successfully!");
      setTimeout(() => {
        router.push("/admin-dashboard");
      }, 8000);
    } catch (error) {
      console.error("Error registering admin:", error);
      setError("Failed to register admin. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center px-6">
        <h2 className="text-3xl font-bold mb-6">Admin Registration</h2>
        <form className="w-full max-w-md" onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="securityCode">
              Security Code
            </label>
            <input
              type="password"
              id="securityCode"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && (
            <div className="mb-4">
              <p className="text-green-500 text-sm mb-2">
                {success} Your employee code is:{" "}
                <strong>{generatedCode}</strong>
              </p>
            </div>
          )}

          {!success && (
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded-full w-full"
            >
              Register
            </button>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}
