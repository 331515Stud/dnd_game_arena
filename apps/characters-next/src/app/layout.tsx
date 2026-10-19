import type { Metadata } from "next";
import { EB_Garamond, Playfair_Display, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const fantasy = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-fantasy",
});

const book = EB_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-book",
});

export const metadata: Metadata = {
  title: "D&D Game Arena — путеводитель и листы персонажей",
  description: "Полное руководство по D&D 5e и конструктор листа персонажа с сохранением в архиве арены.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${fantasy.variable} ${book.variable}`}>
      <body className={`${sans.className} bg-slate-950 text-slate-100 antialiased`}>{children}</body>
    </html>
  );
}
