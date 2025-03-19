"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { auth, db } from "../utils/firebase";

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Check if the user is an admin by querying Firestore
        const adminQuery = query(
          collection(db, "admins"),
          where("email", "==", authUser.email) // Match admin by email
        );
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          setAdmin({
            ...authUser,
            adminCode: adminData.code,
            name: adminData.firstName + " " + adminData.lastName,
          });
          setUser(null); // Ensure user state is cleared
        } else {
          // If not an admin, treat as a normal user
          setUser(authUser);
          setAdmin(null); // Ensure admin state is cleared
        }
      } else {
        setUser(null);
        setAdmin(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (admin) {
      setAdminName(admin.name); // Set admin name when it's available
      setLoading(false);
    }
  }, [admin]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome, {adminName}</h1>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/fetch-deliveries" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-gray-200 transition">
              <h3 className="text-xl font-semibold mb-2">Delivery List</h3>
              <p>View and manage all deliveries for the selected date</p>
            </div>
          </Link>

          <Link href="/update-menu" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-gray-200 transition">
              <h3 className="text-xl font-semibold mb-2">Update Order Menu</h3>
              <p>Manage menu items and update availability.</p>
            </div>
          </Link>

          <Link href="/add-menu-item" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-gray-200 transition">
              <h3 className="text-xl font-semibold mb-2">Add Menu Items</h3>
              <p>
                Attract more customers by adding new items to your order menu.
              </p>
            </div>
          </Link>

          <Link href="/manage-inventory" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-gray-200 transition">
              <h3 className="text-xl font-semibold mb-2">Manage Inventory</h3>
              <p>Have a smooth flow in the kitchen, update inventory daily.</p>
            </div>
          </Link>
          {/* Add other feature cards as needed */}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
