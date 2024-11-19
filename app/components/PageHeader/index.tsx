import { useRouter } from "next/navigation";
import React from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Flex, Row, Space } from "antd";

const PageHeader = ({
  title,
  subtitle = "",
  isIndexView = true,
  actions = [],
}: Props) => {
  const router = useRouter();
  return (
    <Row>
      <Col span={12}>
        <h3 style={{ marginBottom: ".35rem" }}>
          {!isIndexView && (
            <ArrowLeftOutlined
              className="mr-2 cursor-pointer"
              onClick={() => router.back()}
            />
          )}{" "}
          {title}
        </h3>
        <p>{subtitle}</p>
      </Col>
      <Col span={12}>
        <Flex justify="end" gap="small">
          {...actions}
        </Flex>
      </Col>
    </Row>
  );
};

interface Props {
  title: string;
  subtitle?: string;
  isIndexView?: boolean;
  actions?: React.JSX.Element[];
}

export default PageHeader;
