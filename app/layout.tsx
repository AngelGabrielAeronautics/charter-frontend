import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import React, { Suspense } from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import StoreProvider from "@/lib/state/store.provider";

import theme from "./(config)/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Charter",
  description:
    "Compare quotes from multiple charter operators with one simple request.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className={`${inter.className} h-screen`}>
        <StoreProvider>
          <AntdRegistry>
            <ConfigProvider theme={theme}>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </ConfigProvider>
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
