import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {`r`n  metadataBase: new URL("https://dimdim-website.vercel.app"),`r`n  title: "dimdim - Windows eye-strain break reminders",
  description:
    "A lightweight npm CLI that runs a native Windows screen fader to remind you to blink and rest your eyes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><script
  defer
  data-website-id="6a4fe90e003d52c3ef48"
  data-domain="dimdim-website.vercel.app"
  src="https://www.insightly.live/script.js">
  </script>
        <script
    src="https://cdn.databuddy.cc/databuddy.js"
    data-client-id="5b123f41-71f1-4f00-b6d4-acca81b30a99"
    crossOrigin="anonymous"
    async
  ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

