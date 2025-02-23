import {
  ClerkProvider,
  SignInButton,
  SignedOut,
} from "@clerk/nextjs";
import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { ThemeProvider } from "@/context/Theme";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "../public/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
      >
        <ClerkProvider
          // appearance={{
          //   elements: {
          //     formButtonPrimary: "primary-gradient",
          //     footerActionLink: "primary-text-gradient hover:text-primary-500",
          //   },
          // }}
        >
          <SignedOut>
            <SignInButton />
          </SignedOut>
          
          {/* <ThemeProvider> */}
            {children}
          {/* </ThemeProvider> */}
        </ClerkProvider>
      </body>
    </html>
  );
}
