"use client";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { useCart } from "../context/cartContext";
import { db } from "../utils/firebase";

export default function MenuPage() {
  const [addedItems, setAddedItems] = useState({});
  const [menuCategories, setMenuCategories] = useState({});
  const router = useRouter();
  const { cart, setCart } = useCart();

  // Custom category order for display
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

  // Mapping category to their capitalized version for UI
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
    const fetchMenuCategories = async () => {
      try {
        const fetchedCategories = {};

        // Fetch categories from the menuCategories collection
        const categoriesSnapshot = await getDocs(
          collection(db, "menuCategories")
        );

        // For each category, fetch its items
        for (const categoryDoc of categoriesSnapshot.docs) {
          const categoryName = categoryDoc.id;
          const categoryItems = [];

          // Fetch items from the menuItems/{categoryName}/items subcollection
          const itemsSnapshot = await getDocs(
            collection(db, "menuItems", categoryName, "items")
          );

          // Push the items to the category
          itemsSnapshot.forEach((itemDoc) => {
            categoryItems.push({
              id: itemDoc.id,
              ...itemDoc.data(),
            });
          });

          // Set the category and its items in the state
          fetchedCategories[categoryName] = categoryItems;
        }

        setMenuCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching menu categories and items:", error);
      }
    };

    fetchMenuCategories();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItems((prev) => ({
      ...prev,
      [item.id]: true, // Mark this specific item as added
    }));

    // Reset back to "Add to Cart" after 1.5 seconds for the specific item
    setTimeout(() => {
      setAddedItems((prev) => ({
        ...prev,
        [item.id]: false, // Reset the added state for this item
      }));
    }, 1500);
  };

  const removeFromCart = (itemId) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((cartItem) =>
            cartItem.id === itemId
              ? { ...cartItem, quantity: cartItem.quantity - 1 } // Reduce quantity
              : cartItem
          )
          .filter((cartItem) => cartItem.quantity > 0) // Remove only if quantity is 0
    );
  };

  const goToCheckout = () => {
    router.push("/checkout"); // Redirect to checkout page
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with cart */}
      <Navbar
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />

      {/* Main Content Layout */}
      <div className="flex flex-grow">
        {/* Sidebar with Styled Categories */}
        <aside className="w-1/6 p-4 h-screen border-r-2 border-gray-400 flex flex-col items-start overflow-y-auto md:flex sticky top-0">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categoryOrder.map(
              (category) =>
                menuCategories[category] && ( // Check if there are items for this category
                  <li
                    key={category}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 font-semibold text-gray-700 w-full"
                  >
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                      {category[0].toUpperCase()}
                    </span>
                    <a href={`#${category}`} className="hover:underline">
                      {categoryDisplayNames[category]}
                    </a>
                  </li>
                )
            )}
          </ul>
        </aside>

        {/* Menu Items */}
        <main className="flex-grow p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Menu</h1>

          {/* Menu Sections */}
          {categoryOrder.map(
            (category) =>
              menuCategories[category] && ( // Check if there are items for this category
                <div key={category} id={category} className="mb-8">
                  <h2 className="text-2xl font-bold border-b pb-2 mb-4">
                    {categoryDisplayNames[category]}
                  </h2>

                  {/* Horizontal List Layout */}
                  <div className="space-y-4">
                    {menuCategories[category].map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border p-4 rounded-lg shadow-sm bg-white"
                      >
                        <div className="flex flex-col">
                          <h3 className="text-lg font-bold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-semibold text-gray-800">
                            ${item.price}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-green-500 hover:bg-green-600 text-white text-lg px-4 py-2 rounded-lg transition relative z-10"
                            style={{ width: "fit-content" }} // Keep button width based on content
                          >
                            <span
                              className={`transition-all duration-500 ease-in-out flex justify-center items-center w-full`}
                              style={{ opacity: addedItems[item.id] ? 0 : 1 }} // Hide text when tick is shown
                            >
                              Add to Cart
                            </span>
                            <span
                              className={`transition-all duration-500 ease-in-out flex justify-center items-center w-full absolute top-2 left-0 ${
                                addedItems[item.id]
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              style={{ zIndex: addedItems[item.id] ? 1 : -1 }}
                            >
                              <span className="animate-ping text-lg">
                                Added!!
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
