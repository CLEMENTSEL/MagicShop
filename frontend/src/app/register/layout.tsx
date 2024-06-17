import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from './register.module.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Page pour créer un compte",
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
