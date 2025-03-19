"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { db } from "../utils/firebase";

export default function ManageInventoryPage() {
  const [inventoryItemsByCategory, setInventoryItemsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const router = useRouter();

  // Define the order of inventory categories
  const categoryOrder = [
    "bakery",
    "beverages",
    "condiments",
    "dairy",
    "frozen",
    "fruits",
    "grains",
    "meat",
    "spices",
    "vegetables",
  ];

  // Fetch all inventory categories and their corresponding items from the database
  useEffect(() => {
    const fetchInventoryItems = async () => {
      setLoading(true);
      try {
        const fetchedItems = {};

        // Loop through each category and fetch items for it
        for (const category of categoryOrder) {
          const inventoryItemsSnapshot = await getDocs(
            collection(db, "inventoryItems", category, "items")
          );

          // Store the items for this category in the fetchedItems object
          fetchedItems[category] = inventoryItemsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setInventoryItemsByCategory(fetchedItems);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        setError("Failed to fetch inventory items.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  // Handle update item logic with transition
  const handleUpdateItemWithTransition = async (item, category) => {
    setUpdatingItemId(item.id); // Set the item ID being updated
    await handleUpdateItem(item, category); // Update item
    setUpdatingItemId(null); // Reset after update
  };

  const handleUpdateItem = async (item, category) => {
    try {
      const itemRef = doc(db, "inventoryItems", category, "items", item.id);
      await updateDoc(itemRef, {
        name: item.name,
        quantity: parseInt(item.quantity),
      });

      setInventoryItemsByCategory((prevItems) => {
        const updatedItems = { ...prevItems };
        updatedItems[category] = updatedItems[category].map((i) =>
          i.id === item.id ? { ...i, ...item } : i
        );
        return updatedItems;
      });
    } catch (error) {
      console.error("Error updating item:", error);
      setError("Failed to update item.");
    }
  };

  // Handle Delete functionality
  const handleDeleteItem = async (item, category) => {
    setDeletingItemId(item.id); // Set the item being deleted

    try {
      // Delete the item from Firestore
      const itemRef = doc(db, "inventoryItems", category, "items", item.id);
      await deleteDoc(itemRef);

      // Optionally, remove it from the UI immediately for a smoother experience
      setInventoryItemsByCategory((prevItems) => {
        const updatedItems = { ...prevItems };
        updatedItems[category] = updatedItems[category].filter(
          (i) => i.id !== item.id
        );
        return updatedItems;
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      // Handle any error if deletion fails
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
          <h1 className="text-3xl font-bold">Manage Inventory</h1>
          {/* Admin Dashboard Button */}
          <button
            onClick={goToAdminDashboard}
            className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Admin Dashboard
          </button>
        </div>
        {/* Display Inventory Items by Category */}
        {loading ? (
          <p>Loading inventory items...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          categoryOrder.map(
            (category) =>
              inventoryItemsByCategory[category] && (
                <div key={category} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b w-10">ID</th>
                        <th className="py-2 px-4 border-b w-4/5">Name</th>
                        <th className="py-2 px-4 border-b">Quantity</th>
                        <th className="py-2 px-4 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItemsByCategory[category].map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={item.newId || item.id}
                              onChange={(e) =>
                                setInventoryItemsByCategory((prevItems) => {
                                  const updatedItems = { ...prevItems };
                                  updatedItems[category] = updatedItems[
                                    category
                                  ].map((i) =>
                                    i.id === item.id
                                      ? { ...i, newId: e.target.value }
                                      : i
                                  );
                                  return updatedItems;
                                })
                              }
                              className="border px-2 py-1 rounded w-10"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                setInventoryItemsByCategory((prevItems) => {
                                  const updatedItems = { ...prevItems };
                                  updatedItems[category] = updatedItems[
                                    category
                                  ].map((i) =>
                                    i.id === item.id
                                      ? { ...i, name: e.target.value }
                                      : i
                                  );
                                  return updatedItems;
                                })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                          </td>
                          <td className="py-2 px-4 border-b w-28">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                setInventoryItemsByCategory((prevItems) => {
                                  const updatedItems = { ...prevItems };
                                  updatedItems[category] = updatedItems[
                                    category
                                  ].map((i) =>
                                    i.id === item.id
                                      ? { ...i, quantity: e.target.value }
                                      : i
                                  );
                                  return updatedItems;
                                })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex space-x-2 justify-center">
                              <button
                                onClick={() =>
                                  handleUpdateItemWithTransition(item, category)
                                }
                                className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition ${
                                  updatingItemId === item.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={updatingItemId === item.id}
                              >
                                {updatingItemId === item.id
                                  ? "Updating..."
                                  : "Update"}
                              </button>

                              <button
                                onClick={() => handleDeleteItem(item, category)}
                                className={`bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition ${
                                  deletingItemId === item.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={deletingItemId === item.id}
                              >
                                {deletingItemId === item.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
          )
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
