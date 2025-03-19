"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function SubscriptionPage() {
  const [subscriptionType, setSubscriptionType] = useState("");
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null); // For handling errors
  const router = useRouter();

  const handleSubscription = async () => {
    if (!subscriptionType) {
      alert("Please select a subscription type.");
      return;
    }

    // Set price based on the subscription type
    const subscriptionPrice = subscriptionType === "Weekly" ? 70 : 280;
    setPrice(subscriptionPrice);

    // Store the selected data in sessionStorage
    sessionStorage.setItem("subscriptionType", subscriptionType);
    sessionStorage.setItem("price", subscriptionPrice);

    // Redirect to the order details page
    router.push("/order-details");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow flex flex-col items-center px-6 py-10">
        <h2 className="text-3xl font-bold mb-1">Choose Your Subscription</h2>
        <h5 className="text-xl  mb-6">
          Wohoo! Your saturday meal(s) are on us! 🎉
        </h5>

        {/* Subscription Cards */}
        <div className="space-y-6 w-full max-w-2xl">
          <label
            className={`flex items-center p-4 rounded-lg border ${
              subscriptionType === "Weekly"
                ? "border-gray-900"
                : "border-gray-300"
            } cursor-pointer hover:shadow-lg`}
          >
            <input
              type="radio"
              name="subscription"
              value="Weekly"
              checked={subscriptionType === "Weekly"}
              onChange={(e) => setSubscriptionType(e.target.value)}
              className="hidden"
            />
            <img
              src="teeku-masi-tiffin-image.jpeg"
              alt="Weekly Tiffins"
              className="w-24 h-24 rounded-md object-cover mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold">Weekly Tiffins</h3>
              <p className="text-sm text-gray-600">
                Enjoy freshly prepared, homemade tiffins delivered to you daily.
                Perfect for busy weekdays!
              </p>
              <p className="text-sm text-gray-600 font-style: italic font-bold">
                Saturday meal is on us!
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg ml-5 font-semibold">CAD $70</p>
            </div>
          </label>

          <label
            className={`flex items-center p-4 rounded-lg border ${
              subscriptionType === "Monthly"
                ? "border-gray-900"
                : "border-gray-300"
            } cursor-pointer hover:shadow-lg`}
          >
            <input
              type="radio"
              name="subscription"
              value="Monthly"
              checked={subscriptionType === "Monthly"}
              onChange={(e) => setSubscriptionType(e.target.value)}
              className="hidden"
            />
            <img
              src="/teeku-masi-tiffin-image.jpeg" // Replace with actual image path
              alt="Monthly Tiffins"
              className="w-24 h-24 rounded-md object-cover mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold">Monthly Tiffins</h3>
              <p className="text-sm text-gray-600">
                Get a full month of delicious, home-style tiffins delivered
                right to your door.
              </p>
              <p className="text-sm text-gray-600 font-style: italic font-bold">
                Saturday meals are on us!
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold ml-5">CAD $280</p>
            </div>
          </label>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Subscribe Button */}
        <button
          onClick={handleSubscription}
          className="mt-8 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
        >
          Next
        </button>
      </main>

      <Footer />
    </div>
  );
}
