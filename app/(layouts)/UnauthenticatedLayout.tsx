"use client";

import Image from "next/image";
import React from "react";

import { Avatar, Layout, Menu, Space } from "antd";

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
      {/* <Header style={headerStyle}>
				<Space>
					<Avatar>U</Avatar>
				</Space>
			</Header> */}
      <Content style={contentStyle}>{children}</Content>
      {/* <Footer style={footerStyle}>
				<strong>
					Developed by{" "}
					<a style={{ color: "#053C5B" }} target='_blank' href='https://levaretech.com'>
						LevTech
					</a>{" "}
					© 2024
				</strong>
			</Footer> */}
    </Layout>
  );
};

interface Props {
  children: React.ReactNode;
}

export default UnauthenticatedLayout;
