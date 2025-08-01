// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "../styles/globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Tracker",
  description: "Track top cryptocurrencies in real-time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}>
        {/* Navbar */}
        <nav className="p-4 shadow bg-white flex justify-between">
          <Link href="/" className="font-bold text-blue-600">
            🏠 Home
          </Link>
          <Link href="/watchlist" className="text-gray-600 hover:text-blue-500">
            ⭐ Watchlist
          </Link>
        </nav>

        {/* Page Content */}
        <main className="p-4 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
