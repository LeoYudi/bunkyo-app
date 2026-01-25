import type { Metadata } from "next";
import { CssBaseline } from '@mui/material';

import { MuiProvider } from './ui/MuiProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: "Bunkyo App",
  description: "Features used by Bunkyo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MuiProvider>
          <CssBaseline />
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
