"use client";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { db } from "../utils/firebase";

export default function FetchDeliveriesPage() {
  const [date, setDate] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFetchDeliveries = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }
    setError("");
    setLoading(true);
    setDeliveries([]);

    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const allDocs = await getDocs(collection(db, "subscriptions"));
      const fetchedDeliveries = allDocs.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (doc) =>
            new Date(doc.startDate) <= new Date(formattedDate) &&
            new Date(doc.endDate) >= new Date(formattedDate)
        );

      // Sort by cityQuarter
      const sortedDeliveries = fetchedDeliveries.sort((a, b) =>
        a.cityQuarter.localeCompare(b.cityQuarter)
      );

      setDeliveries(sortedDeliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError("Failed to fetch deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToAdminDashboard = () => {
    router.push("/admin-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Fetch Deliveries</h1>
          {/* Admin Dashboard Button */}
          <button
            onClick={goToAdminDashboard}
            className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Admin Dashboard
          </button>
        </div>
        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        {/* Fetch Deliveries Button */}
        <button
          onClick={handleFetchDeliveries}
          className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded mb-6"
        >
          Fetch Deliveries
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Loading Indicator */}
        {loading && <p>Loading deliveries...</p>}

        {/* Deliveries Table */}
        {!loading && deliveries.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Deliveries for {date}</h2>
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">
                    Customer Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    City Quarter
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Subscription Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery, index) => (
                  <tr
                    key={delivery.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.userName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.cityQuarter}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.subscriptionType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.addressLine1}, {delivery.city},{" "}
                      {delivery.zipcode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Deliveries Found */}
        {!loading && deliveries.length === 0 && (
          <p>No deliveries found for the selected date.</p>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
