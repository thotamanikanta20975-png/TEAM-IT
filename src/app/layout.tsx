import type { Metadata } from "next";
import { Chakra_Petch, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ImageKitProvider } from "@imagekit/next";
import "./globals.css";

const display = Chakra_Petch({
  variable: "--font-display",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodRescue — AI-matched food rescue",
  description:
    "FoodRescue closes the rescue window on surplus food, matching donors to the nearest NGO and volunteer in minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}>
          {children}
        </ImageKitProvider>
      </body>
    </html>
  );
}
