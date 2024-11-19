import { useEffect, useState } from "react";

import { CheckCircleFilled, CheckCircleTwoTone, CloseCircleFilled, CloseCircleTwoTone } from "@ant-design/icons";
import { Button, Col, Drawer, Flex, Row, Tag } from "antd";

import { IOperator } from "@/lib/models/IOperators";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  hideOperatorDrawer,
  vetProfileSection,
} from "@/lib/state/operators/operators.slice";

import AdminVettingTermsAndConditionsSection from "../../AdminOperatorVettingSections/TermsAndConditionsSection";
import AdminUserDetailsSection from "../../AdminOperatorVettingSections/UserDetailsSection";
import AppAnimate from "../../AppAnimate";
import CertificationsSection from "../../OperatorProfileSections/CertificationsSection";
import {
  StyledUserProfileContainer,
  StyledUserProfileTabs,
} from "./page.styled";

const styles = { fontSize: "14px" };

const OperatorVettingDrawer = () => {
  const [activeKey, setActiveKey] = useState("01");
  const [record, setRecord] = useState<IOperator>();

  const { drawers } = useAppSelector((state) => state.operators);
  const { authenticatedUser } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (drawers.operatorDetails.operator) {
      setRecord(drawers.operatorDetails.operator);
    }
    return () => {};
  }, [drawers.operatorDetails]);

  return (
    <Drawer id="operator-details-drawer"
      title="Vet Operator"
      width={1200}
      closable={true}
      onClose={() => dispatch(hideOperatorDrawer())}
      open={drawers?.operatorDetails.isOpen || false}
      extra={[
        <>
          {record?.status && <Tag color={record.status == "Verified" ? "#55c219" : undefined}>{record.status}</Tag>}
        </>
      ]}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <Row style={{ marginTop: 20 }}>
        <Col style={{ width: "100%" }}>
          <StyledUserProfileContainer>
            <AppAnimate animation="transition.slideUpIn" delay={200}>
              <StyledUserProfileTabs
                key="1"
                defaultActiveKey="01"
                tabPosition="left"
                items={[
                  {
                    label: (
                      <div
                        style={{
                          fontSize: "16px",
                          color: activeKey === "01" ? "white" : "#0b3746", width: "100%"
                        }}
                      >
                        <Flex justify="space-between" style={{ width: "100%" }}>
                          <p>Company Details</p>{" "}
                          {record?.vettingStatus?.companyDetails?.toString() == "approved" && <CheckCircleTwoTone twoToneColor="#55c219" style={{ marginLeft: "1.5rem" }} />}
                          {record?.vettingStatus?.companyDetails?.toString() == "rejected" && <CloseCircleTwoTone twoToneColor="#fa4f50" style={{ marginLeft: "1.5rem" }} />}
                        </Flex>
                      </div>
                    ),
                    key: "01",
                    children: [
                      <AdminUserDetailsSection record={record!} />,
                      <>
                        {record?.vettingStatus?.companyDetails.toString() ===
                          "pending" && (
                          <Flex style={{ marginTop: 20 }}>
                            <Button
                              style={{
                                marginRight: 15,
                                backgroundColor: "#ebe5df",
                              }}
                              type="default"
                              danger
                              onClick={() =>
                                dispatch(
                                  vetProfileSection({
                                    id: record?._id!,
                                    payload: {
                                      profileSection: "companyDetails",
                                      vettingAction: "rejected",
                                      vettedByUserId: authenticatedUser?._id!,
                                    },
                                  })
                                )
                              }
                            >
                              Reject
                            </Button>
                            <Button
                              type="primary"
                              onClick={() =>
                                dispatch(
                                  vetProfileSection({
                                    id: record?._id!,
                                    payload: {
                                      profileSection: "companyDetails",
                                      vettingAction: "approved",
                                      vettedByUserId: authenticatedUser?._id!,
                                    },
                                  })
                                )
                              }
                            >
                              Verify
                            </Button>
                          </Flex>
                        )}
                      </>,
                    ],
                  },
                  {
                    label: (
                      <div
                        style={{
                          ...styles,
                          color: activeKey === "02" ? "white" : "#0b3746", width: "100%"
                        }}
                      >
                        <Flex justify="space-between" style={{ width: "100%" }}>
                          <p>Documents</p>{" "}
                          {record?.vettingStatus?.documentation?.toString() == "approved" && <CheckCircleTwoTone twoToneColor="#55c219" style={{ marginLeft: "1.5rem" }} />}
                          {record?.vettingStatus?.documentation?.toString() == "rejected" && <CloseCircleTwoTone twoToneColor="#fa4f50" style={{ marginLeft: "1.5rem" }} />}
                        </Flex>
                      </div>
                    ),
                    key: "02",
                    children: [
                      <CertificationsSection />,
                      <>
                        {record?.vettingStatus?.documentation.toString() ===
                          "pending" && (
                          <Flex style={{ marginTop: 20 }}>
                            <Button
                              style={{
                                marginRight: 15,
                                backgroundColor: "#ebe5df",
                              }}
                              type="default"
                              danger
                              onClick={() =>
                                dispatch(
                                  vetProfileSection({
                                    id: record?._id!,
                                    payload: {
                                      profileSection: "documentation",
                                      vettingAction: "rejected",
                                      vettedByUserId: authenticatedUser?._id!,
                                    },
                                  })
                                )
                              }
                            >
                              Reject
                            </Button>
                            <Button
                              type="primary"
                              onClick={() =>
                                dispatch(
                                  vetProfileSection({
                                    id: record?._id!,
                                    payload: {
                                      profileSection: "documentation",
                                      vettingAction: "approved",
                                      vettedByUserId: authenticatedUser?._id!,
                                    },
                                  })
                                )
                              }
                            >
                              Verify
                            </Button>
                          </Flex>
                        )}
                      </>,
                    ],
                  },
                  {
                    label: (
                      <div
                        style={{
                          ...styles,
                          color: activeKey === "03" ? "white" : "#0b3746", width: "100%"
                        }}
                      >
                        <Flex justify="space-between" style={{ width: "100%" }}>
                          <p>Terms & Conditions</p>{" "}
                          {record?.vettingStatus?.termsAndConditions?.toString() == "approved" && <CheckCircleTwoTone twoToneColor="#55c219" style={{ marginLeft: "1.5rem" }} />}
                          {record?.vettingStatus?.termsAndConditions?.toString() == "rejected" && <CloseCircleTwoTone twoToneColor="#fa4f50" style={{ marginLeft: "1.5rem" }} />}
                        </Flex>
                      </div>
                    ),
                    key: "03",
                    children: [
                      <AdminVettingTermsAndConditionsSection />,
                      <>
                        {record?.vettingStatus?.termsAndConditions.toString() ===
                          "pending" && (
                          <Flex style={{ marginTop: 20 }}>
                            <Button
                              style={{
                                marginRight: 15,
                                backgroundColor: "#ebe5df",
                              }}
                              type="default"
                              danger
                              onClick={() =>
                                dispatch(
                                  vetProfileSection({
                                    id: record?._id!,
                                    payload: {
                                      profileSection: "termsAndConditions",
                                      vettingAction: "rejected",
                                      vettedByUserId: authenticatedUser?._id!,
                                    },
                                  })
                                )
                              }
                            >
                              Reject
                            </Button>
                            <Button
                              type="primary"
                              onClick={() =>
                                dispatch(
                                  vetProfileSection({
                                    id: record?._id!,
                                    payload: {
                                      profileSection: "termsAndConditions",
                                      vettingAction: "approved",
                                      vettedByUserId: authenticatedUser?._id!,
                                    },
                                  })
                                )
                              }
                            >
                              Verify
                            </Button>
                          </Flex>
                        )}
                      </>,
                    ],
                  },
                ]}
                onChange={(key) => setActiveKey(key)}
              />
            </AppAnimate>
          </StyledUserProfileContainer>
        </Col>
      </Row>
    </Drawer>
  );
};

export default OperatorVettingDrawer;
