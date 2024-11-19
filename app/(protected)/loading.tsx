import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Result, Spin } from "antd";

export default function Loading() {
  return (
    <Flex justify="center" align="center" className="h-full w-full">
      <Result
        icon={
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        }
        title="Loading..."
        subTitle="Please wait while we set things up"
      />
    </Flex>
  );
}
