"use client";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { db } from "../utils/firebase";

export default function AddMenuItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [id, setId] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // State for success transition
  const [idExists, setIdExists] = useState(false); // State to track if ID already exists
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const categoryRef = collection(db, "menuCategories");
      const categorySnapshot = await getDocs(categoryRef);
      const categoryList = categorySnapshot.docs.map((doc) => doc.id); // Get category names
      setCategories(categoryList);
    };

    fetchCategories();
  }, []);

  const handleAddItem = async () => {
    if (!name || !description || !price || !id || !category) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false); // Reset success message
    setIdExists(false); // Reset the ID exists state

    try {
      // Check if the ID already exists in the selected category
      const menuQuery = query(
        collection(db, "menuItems", category, "items"),
        where("id", "==", id)
      );
      const menuSnapshot = await getDocs(menuQuery);

      if (!menuSnapshot.empty) {
        // If the ID exists, show error and stop the process
        setIdExists(true);
        setLoading(false);
        return;
      }

      // Add new item to Firestore in the selected category using the item ID as the document name
      const newItem = {
        id,
        name,
        description,
        price: parseFloat(price),
      };

      // Use setDoc instead of addDoc to set the document ID as the item ID
      await setDoc(doc(db, "menuItems", category, "items", id), newItem);

      // Display success message and reset fields after a successful addition
      setSuccess(true);
      setName("");
      setDescription("");
      setPrice("");
      setId("");
      setCategory("");
    } catch (error) {
      console.error("Error adding item: ", error);
      setError("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToAdminDashboard = () => {
    router.push("/admin-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add New Items</h1>
          {/* Admin Dashboard Button */}
          <button
            onClick={goToAdminDashboard}
            className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Admin Dashboard
          </button>
        </div>
        {/* Add Menu Item Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 mb-4 transition duration-300 ease-in-out">
              Added successfully!
            </p>
          )}
          {idExists && (
            <p className="text-red-500 mb-4">
              ID already exists. Please use a unique ID.
            </p>
          )}

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="id">
              Item ID
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="Enter item ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="name">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="Enter item name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="Enter item description"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="price">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="Enter price"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="category">
              Select Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddItem}
            className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
