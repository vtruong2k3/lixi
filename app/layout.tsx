import type { Metadata } from "next";
import "./globals.css";
import Providers from '@/components/Providers'
import Navigation from '@/components/Navigation'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: "Trun Community - Mỗi viên gạch, một tấm lòng",
  description: "Nền tảng thiện nguyện minh bạch ủng hộ Trừn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navigation />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
