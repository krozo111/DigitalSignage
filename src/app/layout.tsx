import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/Toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yugo Signage",
  description: "Digital Signage Control Panel",
  icons: [
    { rel: "icon", url: "/favicon.png", type: "image/png" },
    { rel: "shortcut icon", url: "/favicon.png" },
    { rel: "apple-touch-icon", url: "/favicon.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
