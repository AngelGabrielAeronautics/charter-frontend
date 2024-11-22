"use client";

import Image from "next/image";
import React, { Suspense } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import { Avatar, Flex, Layout, Menu, Result, Space, Spin } from "antd";

const { Header, Content, Footer } = Layout;

const layoutStyle: React.CSSProperties = {
  background: "#fff",
  height: "100vh",
  minHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  background: "#FFFFFFF0",
  // position: "sticky",
  position: "fixed",
  top: 0,
  zIndex: 1,
  width: "100%",
  height: "9vh",
  display: "flex",
  justifyContent: "end",
  padding: "0 2rem",
};
const contentStyle: React.CSSProperties = {
  background: "#EFEFEFF0",
  width: "100%",
  padding: "0",
  position: "absolute",
  // top: "9vh",
  height: "100vh",
};
const footerStyle: React.CSSProperties = {
  background: "#FFFFFFC2",
  position: "fixed",
  textAlign: "center",
  width: "100%",
  bottom: 0,
  height: "5vh",
  lineHeight: "5vh",
  padding: "0 1.5rem",
  zIndex: 1,
};

const UnauthenticatedLayout = ({ children }: Props) => {
  return (
    <Layout style={layoutStyle}>
      <Content style={contentStyle}>
        <Suspense
          fallback={
            <Flex justify="center" align="center" className="h-full w-full">
              <Result
                icon={
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 48 }} spin />
                    }
                  />
                }
                title="Loading..."
                subTitle="Please wait while we set things up"
              />
            </Flex>
          }
        >
          {children}
        </Suspense>
      </Content>
    </Layout>
  );
};

interface Props {
  children: React.ReactNode;
}

export default UnauthenticatedLayout;
