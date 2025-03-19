"use client";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { addDoc, collection, db } from "../utils/firebase";

export default function OrderDetailsPage() {
  const [subscriptionType, setSubscriptionType] = useState("");
  const [price, setPrice] = useState(0);
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [mealPreferences, setMealPreferences] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [cityQuarter, setCityQuarter] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const router = useRouter();

  // Function to validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!userName) newErrors.userName = "Name is required";
    if (!userPhone) newErrors.userPhone = "Phone number is required";
    if (!addressLine1) newErrors.addressLine1 = "Address Line 1 is required";
    if (!city) newErrors.city = "City is required";
    if (!province) newErrors.province = "Province is required";
    if (!zipcode) newErrors.zipcode = "Zipcode is required";
    if (!cityQuarter) newErrors.cityQuarter = "City Quarter is required";
    if (!startDate) newErrors.startDate = "Start Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const calculateEndDate = (start, subscriptionType) => {
    if (!start) return "";
    let date = new Date(start);
    let businessDaysCount = 0;
    let daysToAdd = subscriptionType === "monthly" ? 24 : 6; // 24 days for monthly, 6 days for weekly

    while (businessDaysCount < daysToAdd) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0) {
        businessDaysCount++;
      }
    }

    // Format the date as yyyy-MM-dd
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (startDate && subscriptionType) {
      const estimatedEndDate = calculateEndDate(startDate, subscriptionType);
      setEndDate(estimatedEndDate);
    }
  }, [startDate, subscriptionType]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const subscription = sessionStorage.getItem("subscriptionType");
      const subscriptionPrice = sessionStorage.getItem("price");

      if (subscription && subscriptionPrice) {
        setSubscriptionType(subscription);
        setPrice(Number(subscriptionPrice));
      }
    }
  }, [isMounted]);

  const handlePayment = async () => {
    // Validate form before proceeding
    const isValid = validateForm();
    if (!isValid) return; // Stop if validation fails

    try {
      // Get the current user from Firebase Authentication
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is logged in");
        return;
      }

      const orderData = {
        subscriptionType,
        price,
        addressLine1,
        city,
        province,
        zipcode,
        mealPreferences,
        startDate,
        endDate,
        userName,
        userPhone,
        cityQuarter,
        userId: user.uid,
        timestamp: new Date(),
      };

      // Add order data to Firestore collection and get the document reference
      const docRef = await addDoc(collection(db, "subscriptions"), orderData);

      // Redirect to the order confirmation page with the order ID
      router.push(`/order-confirmation?orderId=${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  if (!isMounted) return null;

  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (input.length <= 3) {
      input = input.replace(/(\d{3})(\d{0,})/, "$1-$2");
    } else if (input.length <= 6) {
      input = input.replace(/(\d{3})(\d{3})(\d{0,})/, "$1-$2-$3");
    } else {
      input = input.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    setUserPhone(input);
  };

  const extraTiffins = subscriptionType === "Weekly" ? "One" : "Four";

  return (
    <div className="flex-row">
      <Navbar />
      <main className="flex justify-center ">
        <div className="w-full flex space-x-8 p-1 px-10">
          <div className="w-full lg:w-7/12 p-4 lg:p-6 border rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Enter Your Details</h3>

            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              className="border px-3 py-2 mb-1 w-full"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName}</p>
            )}

            <input
              type="tel"
              value={userPhone}
              onChange={handlePhoneChange}
              placeholder="Your Phone Number"
              className="border px-3 py-2 mb-1 w-full"
            />
            {errors.userPhone && (
              <p className="text-red-500 text-sm">{errors.userPhone}</p>
            )}

            <h3 className="text-2xl font-bold mb-1">Enter Your Address</h3>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Address Line 1"
              className="border px-3 py-2 mb-1 w-full"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm">{errors.addressLine1}</p>
            )}

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="border px-3 py-2 mb-1 w-full"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}

            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Province"
              className="border px-3 py-2 mb-1 w-full"
            />
            {errors.province && (
              <p className="text-red-500 text-sm">{errors.province}</p>
            )}

            <input
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              placeholder="Zipcode"
              className="border px-3 py-2 mb-1 w-full"
            />
            {errors.zipcode && (
              <p className="text-red-500 text-sm">{errors.zipcode}</p>
            )}

            <div className="mb-1">
              <select
                value={cityQuarter}
                onChange={(e) => setCityQuarter(e.target.value)}
                className="border px-3 py-2 w-full"
              >
                <option value="">Select a quarter</option>
                <option value="Downtown">Downtown</option>
                <option value="NE">NE</option>
                <option value="NW">NW</option>
                <option value="SE">SE</option>
                <option value="SW">SW</option>
              </select>
              {errors.cityQuarter && (
                <p className="text-red-500 text-sm">{errors.cityQuarter}</p>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-1">Start Date</h3>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 mb-1 w-full"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate}</p>
            )}

            {startDate && (
              <div className="mb-1">
                <p className="text-lg">
                  Estimated End Date: <strong>{endDate}</strong> with{" "}
                  <strong>
                    {subscriptionType === "monthly"
                      ? "20 + 4 (free)"
                      : "5 + 1 (free)"}
                  </strong>{" "}
                  tiffins delivered.
                </p>
              </div>
            )}

            <textarea
              value={mealPreferences}
              onChange={(e) => setMealPreferences(e.target.value)}
              placeholder="Specify meal preferences (optional)"
              className="border px-3 py-2 mb-1 w-full"
            />
          </div>

          <div className="w-5/12 p-6  border rounded-lg shadow-lg">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4">Summary</h3>
              <div className="space-y-2">
                <div className="flex text-xl justify-between">
                  <p>{subscriptionType} Subscription :</p>
                  <p>
                    <strong>CAD ${price}</strong>
                  </p>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p className="text-xl ">{extraTiffins} Extra Tiffin(s) :</p>
                    <p>(promotional offer on subscriptions)</p>
                  </div>
                  <p className="text-xl">
                    <strong>Free</strong>
                  </p>
                </div>

                <div className="flex text-xl justify-between">
                  <p>Shipping:</p>
                  <p>
                    <strong>Free</strong>
                  </p>
                </div>
                <div className="flex text-xl justify-between">
                  <p>Tax (5%):</p>
                  <p>
                    <strong>CAD ${(price * 0.05).toFixed(2)}</strong>
                  </p>
                </div>
                <div className="flex text-xl justify-between">
                  <p>Total:</p>
                  <p>
                    <strong>CAD ${(price + price * 0.05).toFixed(2)}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={Object.keys(errors).length > 0} // Disable if there are errors
                className={`bg-green-500 hover:bg-green-600 text-white text-xl py-2 px-4 rounded-full text-center justify-center block ${
                  Object.keys(errors).length > 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
