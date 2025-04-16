import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./Provider";
import { icons } from "lucide-react";
import '@smastrom/react-rating/style.css'
import { config } from "@fortawesome/fontawesome-svg-core";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { CartUpdateProvider } from "./_context/CartUpdateContext";
config.autoAddCss = false;


export const metadata = {
  title: "Royal Spoon Foods and Events",
  description: "Home of Taste, Flavour for Royalties",
  icons:{
    icon: '/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
  <ClerkProvider>
    <html lang="en">
      <body className="font-poppins">
      <CartUpdateProvider>
        <Provider>{children}</Provider>
      </CartUpdateProvider>
      </body>
    </html>
  </ClerkProvider>
  );
}
