import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import React from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import StoreProvider from "@/lib/state/store.provider";

import theme from "./(config)/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
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
