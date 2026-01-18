import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "udit-ui - Custom shadcn/ui Components",
  description: "A collection of custom shadcn/ui components for React applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                udit-ui
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/components/date-picker"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Components
                </Link>
                <a
                  href="https://github.com/joonheeu/udit-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
