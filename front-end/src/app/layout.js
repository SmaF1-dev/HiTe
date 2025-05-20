import "./globals.scss";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Hite",
  description: "Platform with unusual Historical Tests.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <ToastContainer position="top-right" autoClose={3000}/> */}
      <body>{children}</body>
    </html>
  );
}
