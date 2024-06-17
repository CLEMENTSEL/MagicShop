import type { Metadata } from "next";
import '../../global.css';

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
