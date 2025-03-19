"use client";
import { useRouter } from "next/navigation"; // Import Next.js Router
import { useEffect, useState } from "react"; // Import hooks
import Footer from "./components/footer"; // Import the Footer component
import Navbar from "./components/navbar"; // Import the Navbar component
import { auth } from "./utils/firebase"; // Firebase auth import

export default function HomePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in using Firebase Authentication
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleSubscriptionClick = () => {
    if (user) {
      router.push("/subscription"); // Navigate to subscription page if logged in
    } else {
      router.push("/signin"); // Navigate to sign-in page if not logged in
    }
  };

  const handleMenuClick = () => {
    if (user) {
      router.push("/menu"); // Navigate to subscription page if logged in
    } else {
      router.push("/signin"); // Navigate to sign-in page if not logged in
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Welcome to Teeku Masi's Cloud Kitchen
        </h2>
        <p className="text-gray-600 mb-6">
          Your favorite homemade meals, delivered fresh and tasty!
        </p>

        {/* Buttons for Subscription and Ordering */}
        <div className="flex space-x-4">
          <button
            onClick={handleSubscriptionClick}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
          >
            Start a Subscription
          </button>
          <button
            onClick={handleMenuClick}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full"
          >
            Order from Menu
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
