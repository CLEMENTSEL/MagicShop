import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from './login.module.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connexion",
  description: "Page de connexion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={styles.body}>{children}</body>
    </html>
  );
}
