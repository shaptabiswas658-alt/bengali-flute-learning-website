import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাঁশির পাঠশালা | Bengali Flute Learning",
  description:
    "শুরু থেকে উন্নত পর্যায় পর্যন্ত বাংলায় বাঁশি শিক্ষা—ফিঙ্গারিং, ফুঁ কৌশল, ঐতিহাসিক সারগাম অনুশীলন এবং বাংলা গানের নোটেশন।",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
