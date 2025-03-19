"use client";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { db } from "../utils/firebase"; // Import the Firestore instance

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // Get the orderId from the query parameter

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return; // Stop if no orderId is provided

      try {
        // Fetch the specific order by its ID
        const docRef = doc(db, "subscriptions", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const orderData = docSnap.data();
          setOrder(orderData);
        } else {
          console.error("No such document found!");
        }
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <h2 className="text-3xl font-bold mb-6">Order Confirmation</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Subscription Type</h3>
            <p>{order.subscriptionType}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Price</h3>
            <p>CAD ${order.price}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Delivery Address</h3>
            <p>{order.addressLine1}</p>
            <p>
              {order.city}, {order.province} {order.zipcode}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Meal Preferences</h3>
            <p>{order.mealPreferences || "None"}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Start Date</h3>
            <p>{order.startDate}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">End Date</h3>
            <p>{order.endDate}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
