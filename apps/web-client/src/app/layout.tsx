import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "./globals.css";
import { AppProvider } from "@/lib/providers";
import { appConfig } from "@ui-utils/config";
import { getUser } from "@ui-utils/server";

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUser();
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <AppProvider user={user}>{children}</AppProvider>
      </body>
    </html>
  );
}
