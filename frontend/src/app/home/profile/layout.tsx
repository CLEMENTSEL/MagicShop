import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '../../global.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Magic Shop 🔮",
  description: "Bienvenu sur le site web du magasin magique 🔮, faites vos choix!",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
