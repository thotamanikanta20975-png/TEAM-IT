import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { ImageKitProvider } from "@imagekit/next";
import { THEME_STORAGE_KEY, DEFAULT_THEME } from "@/lib/theme";
import "./globals.css";

// Runs before first paint so a returning visitor's saved theme applies
// immediately — no flash of the default Harvest theme on load.
const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t&&t!==${JSON.stringify(DEFAULT_THEME)}){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

const display = Fraunces({
  variable: "--font-display",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodRescue — turn surplus food into someone's next meal",
  description:
    "FoodRescue connects food donors with verified NGOs and volunteers, using AI matching to rescue surplus food before it goes to waste.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}>
          {children}
        </ImageKitProvider>
      </body>
    </html>
  );
}
