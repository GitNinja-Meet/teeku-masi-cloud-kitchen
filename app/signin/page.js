"use client"; // Ensure the component is treated as a client-side component

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Firebase authentication
import { useRouter } from "next/navigation"; // Using next/navigation for Next.js 13
import { useEffect } from "react"; // Import useEffect to check login status
import Footer from "../components/footer"; // Assuming you have a Footer component
import Navbar from "../components/navbar"; // Assuming you have a Navbar component
import { auth } from "../utils/firebase"; // Adjust the path as needed

export default function SignInPage() {
  const router = useRouter();

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      router.push("/"); // Redirect to subscription page after successful login
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  // Check if user is already logged in and redirect to subscription page
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If user is logged in, redirect to the subscription page
        router.push("/");
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-6">
        <h2 className="text-3xl font-bold mb-6">Sign In</h2>

        {/* Sign-in buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full p-5 bg-green-500 text-white py-2 rounded-full hover:bg-green-600"
          >
            Sign in with Google
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
