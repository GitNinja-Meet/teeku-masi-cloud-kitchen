"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { auth, db } from "../utils/firebase";

export default function MySubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [stoppingSubscription, setStoppingSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      // Fetch subscriptions for the current user
      const user = auth.currentUser;
      if (!user) return;

      const subscriptionsQuery = query(
        // Query subscriptions for the current user
        collection(db, "subscriptions"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(subscriptionsQuery);

      const fetchedSubscriptions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscriptions(fetchedSubscriptions);
      setLoading(false);
    };

    fetchSubscriptions();
  }, []);

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
  };

  const handleStop = (subscription) => {
    setStoppingSubscription(subscription);
  };

  const handleSaveChanges = async (updatedSubscription) => {
    // Save changes to the subscription
    try {
      await updateDoc(
        // Update the subscription in Firestore
        doc(db, "subscriptions", updatedSubscription.id),
        updatedSubscription
      );
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === updatedSubscription.id ? updatedSubscription : sub
        )
      );
      setEditingSubscription(null);
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handleCancelSubscription = async () => {
    // Cancel the subscription
    if (stoppingSubscription) {
      try {
        await deleteDoc(doc(db, "subscriptions", stoppingSubscription.id)); // Delete the subscription from Firestore
        setSubscriptions((prev) =>
          prev.filter((sub) => sub.id !== stoppingSubscription.id)
        );
        setStoppingSubscription(null);
      } catch (error) {
        console.error("Error deleting subscription:", error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Your Subscriptions</h1>
        {subscriptions.length === 0 ? (
          <p>You have no subscriptions.</p>
        ) : editingSubscription ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Edit Subscription</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveChanges(editingSubscription);
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Subscription Type */}
              <div className="flex flex-col">
                <label className="font-medium">Subscription Type:</label>
                <input
                  type="text"
                  value={editingSubscription.subscriptionType}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      subscriptionType: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* Start Date */}
              <div className="flex flex-col">
                <label className="font-medium">Start Date:</label>
                <input
                  type="date"
                  value={editingSubscription.startDate}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      startDate: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* Meal Preferences */}
              <div className="flex flex-col">
                <label className="font-medium">Meal Preferences:</label>
                <input
                  type="text"
                  value={editingSubscription.mealPreferences}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      mealPreferences: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* Address Line 1 */}
              <div className="flex flex-col">
                <label className="font-medium">Address Line 1:</label>
                <input
                  type="text"
                  value={editingSubscription.addressLine1}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      addressLine1: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* City */}
              <div className="flex flex-col">
                <label className="font-medium">City:</label>
                <input
                  type="text"
                  value={editingSubscription.city}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      city: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* City Quarter */}
              <div className="flex flex-col">
                <label className="font-medium">City Quarter:</label>
                <input
                  type="text"
                  value={editingSubscription.cityQuarter}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      cityQuarter: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* Province */}
              <div className="flex flex-col">
                <label className="font-medium">Province:</label>
                <input
                  type="text"
                  value={editingSubscription.province}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      province: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* Zip Code */}
              <div className="flex flex-col">
                <label className="font-medium">Zip Code:</label>
                <input
                  type="text"
                  value={editingSubscription.zipcode}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      zipcode: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* User Name */}
              <div className="flex flex-col">
                <label className="font-medium">User Name:</label>
                <input
                  type="text"
                  value={editingSubscription.userName}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      userName: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* User Phone */}
              <div className="flex flex-col">
                <label className="font-medium">User Phone:</label>
                <input
                  type="text"
                  value={editingSubscription.userPhone}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      userPhone: e.target.value,
                    })
                  }
                  className="border p-2"
                />
              </div>
              {/* Submit and Cancel Buttons */}
              <div className="col-span-2 flex justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSubscription(null)}
                  className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : stoppingSubscription ? (
          <div>
            <h2 className="text-xl font-bold">Cancel Subscription</h2>
            <p className="text-red-500">
              Are you sure you want to stop this subscription? This action
              cannot be undone, and <strong>no refunds</strong> will be issued.
            </p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setStoppingSubscription(null)}
                className="bg-green-600 hover:bg-green-800 text-white py-2 px-4 rounded"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelSubscription}
                className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        ) : (
          <ul>
            {subscriptions.map((subscription) => (
              <li
                key={subscription.id}
                className="border-b py-2 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Subscription Type:</strong>{" "}
                    {subscription.subscriptionType}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {subscription.startDate}
                  </p>
                  <p>
                    <strong>End Date:</strong> {subscription.endDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(subscription)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStop(subscription)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                  >
                    Stop
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}
