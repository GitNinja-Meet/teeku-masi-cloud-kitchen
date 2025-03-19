"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { db } from "../utils/firebase";

export default function UpdateMenuPage() {
  const [menuItemsByCategory, setMenuItemsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  const categoryOrder = [
    "appetizers",
    "snacks",
    "vegetarian main course",
    "non vegetarian main course",
    "breads",
    "rices",
    "sides",
    "beverages",
  ];

  const categoryDisplayNames = {
    appetizers: "Appetizers",
    snacks: "Snacks",
    "vegetarian main course": "Vegetarian Main Course",
    "non vegetarian main course": "Non Vegetarian Main Course",
    breads: "Breads",
    rices: "Rices",
    sides: "Sides",
    beverages: "Beverages",
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(
          collection(db, "menuCategories")
        );
        const fetchedItems = {};

        for (const categoryDoc of categoriesSnapshot.docs) {
          const categoryName = categoryDoc.id;
          const menuItemsSnapshot = await getDocs(
            collection(db, "menuItems", categoryName, "items")
          );

          fetchedItems[categoryName] = menuItemsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setMenuItemsByCategory(fetchedItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to fetch menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleUpdateItemWithTransition = async (item, category) => {
    try {
      await handleUpdateItem(item, category);
    } catch (error) {
      console.error(
        "Error in handleUpdateItemWithTransition:",
        error?.message || error
      );
      setError("Failed to update item. Please check the console for details.");
    }
  };

  const handleUpdateItem = async (item, category) => {
    try {
      // Validate inputs
      if (!item.name || !item.description || !item.price) {
        setError("Name, description, and price are required.");
        return;
      }

      // Update Firestore
      const itemRef = doc(db, "menuItems", category, "items", item.id);
      await updateDoc(itemRef, {
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
      });

      // If the ID is being updated, create a new document and delete the old one
      if (item.id !== item.newId) {
        const newItemRef = doc(db, "menuItems", category, "items", item.newId);
        await setDoc(newItemRef, {
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
        });
        await deleteDoc(itemRef);
      }

      // Update state
      setMenuItemsByCategory((prevItems) => {
        const updatedItems = { ...prevItems };

        // Ensure the category exists
        if (!updatedItems[category]) {
          console.error(`Category ${category} not found in prevItems`);
          return prevItems;
        }

        // Update the item in the category
        updatedItems[category] = updatedItems[category].map((i) =>
          i.id === item.id ? { ...i, ...item, id: item.newId || i.id } : i
        );

        return updatedItems;
      });

      // Show success popup
      setShowSuccessPopup(true);

      // Hide the popup and reload the page after 2.5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.error("Error updating item:", error?.message || error);
      setError("Failed to update item. Please check the console for details.");
    }
  };

  const handleDeleteItem = async (item, category) => {
    try {
      const itemRef = doc(db, "menuItems", category, "items", item.id);
      await deleteDoc(itemRef);

      setMenuItemsByCategory((prevItems) => {
        const updatedItems = { ...prevItems };
        if (updatedItems[category]) {
          updatedItems[category] = updatedItems[category].filter(
            (i) => i.id !== item.id
          );
        }
        return updatedItems;
      });
    } catch (error) {
      console.error("Error deleting item:", error);
    }

    setTimeout(() => {
      setBlinkItemId(null);
      setDeletingItemId(null);
    }, 1500);
  };

  const goToAdminDashboard = () => {
    router.push("/admin-dashboard");
  };

  const SuccessPopup = () => {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-green-600 text-xl font-semibold">
            Item updated successfully!
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Update Menu</h1>
          <button
            onClick={goToAdminDashboard}
            className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Admin Dashboard
          </button>
        </div>
        {loading ? (
          <p>Loading menu items...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          categoryOrder.map((category) => {
            if (menuItemsByCategory[category]) {
              return (
                <div key={category} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    {categoryDisplayNames[category]}
                  </h2>
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100 ">
                        <th className="py-2 px-4 border-b w-14">ID</th>
                        <th className="py-2 px-4 border-b w-2/12">Name</th>
                        <th className="py-2 px-4 border-b w-6/12">
                          Description
                        </th>
                        <th className="py-2 px-4 border-b">Price</th>
                        <th className="py-2 px-4 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItemsByCategory[category].map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={item.newId || item.id}
                              onChange={(e) =>
                                setMenuItemsByCategory((prevItems) => {
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
                              className="border px-2 py-1 w-10 rounded"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                setMenuItemsByCategory((prevItems) => {
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
                          <td className="py-2 px-4 border-b w-1/4">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                setMenuItemsByCategory((prevItems) => {
                                  const updatedItems = { ...prevItems };
                                  updatedItems[category] = updatedItems[
                                    category
                                  ].map((i) =>
                                    i.id === item.id
                                      ? { ...i, description: e.target.value }
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
                              value={item.price}
                              onChange={(e) =>
                                setMenuItemsByCategory((prevItems) => {
                                  const updatedItems = { ...prevItems };
                                  updatedItems[category] = updatedItems[
                                    category
                                  ].map((i) =>
                                    i.id === item.id
                                      ? { ...i, price: e.target.value }
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
                                onClick={() => handleUpdateItem(item, category)}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                              >
                                Update
                              </button>

                              <button
                                onClick={() => handleDeleteItem(item, category)}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            return null;
          })
        )}
        {showSuccessPopup && <SuccessPopup />}
      </main>
      <Footer />
    </div>
  );
}
