import localFont from "next/font/local";
import { CartProvider } from "./context/cartContext";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Teeku Masi's Cloud Kitchen",
  description: "Your favorite homemade meals, delivered fresh and tasty!",
  icons: {
    icon: "/teeku-masi-logo.png",
    shortcut: "/teeku-masi-logo.png",
    apple: "/teeku-masi-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
