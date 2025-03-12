import "./globals.scss";

export const metadata = {
  title: "Hite",
  description: "Platform with unusual Historical Tests.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
