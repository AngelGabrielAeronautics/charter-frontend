"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, Col, Divider, Empty, Flex, Row, Space, Spin, Tag } from "antd";
import dayjs from "dayjs";
import { LiaPlaneDepartureSolid } from "react-icons/lia";
import {
  MdAirlineSeatReclineNormal,
  MdPets,
  MdSmokingRooms,
} from "react-icons/md";

import ClientAppBar from "@/app/components/ClientAppBar";

import { formatUCTtoISO } from "@/lib/helpers/formatters.helpers";
import { IQuotationRequest } from "@/lib/models/IQuotationRequest";
import { IAntCardStyle } from "@/lib/models/ant-card-style.interface";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  filterQuotationRequests,
  selectRecord,
} from "@/lib/state/quotationRequests/quotationRequests.slice";
import { filter } from "@/lib/state/quotations/quotations.slice";

import { eRoutes } from "../(config)/routes";
import QuotationRequestDrawer from "../components/Drawers/QuotationRequestDrawer";

const QuotationRequests = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { quotationRequests, isFetchingQuotationRequests } = useAppSelector(
    (state) => state.quotationsRequests
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.role! == "Operator") {
      router.replace(eRoutes.operatorQuotationRequests);
      return;
    }
    if (authenticatedUser && authenticatedUser.role! == "Administrator") {
      router.replace(eRoutes.adminQuotationRequests);
      return;
    }
  }, [router, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      const payload = { customerId: authenticatedUser._id };
      dispatch(filterQuotationRequests(payload));
    }

    return () => {};
  }, [dispatch, authenticatedUser]);

  const styles: IAntCardStyle = {
    body: {
      padding: 0,
    },
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#E9E2DB" }}>
      <ClientAppBar styles={{ padding: "1rem 2rem" }} />
      <div className="h-full min-h-full p-12">
        <h2 style={{ fontWeight: 500 }}>Quotation Requests</h2>
        <Spin spinning={isFetchingQuotationRequests}>
          <Divider style={{ margin: "1rem 0" }} />

          <Row gutter={16}>
            {quotationRequests.length > 0 ? (
              quotationRequests.map(
                (
                  record: IQuotationRequest,
                  _index: number,
                  _array: IQuotationRequest[]
                ) => {
                  if (!record._id) return;
                  return (
                    <Col span={6} key={record._id}>
                      <Card
                        key={record._id}
                        onClick={() => {
                          dispatch(selectRecord(record));
                          dispatch(filter({ quotationRequestId: record._id }));
                          setShowDrawer(true);
                        }}
                        hoverable
                        styles={styles}
                        style={{
                          marginBottom: "1rem",
                          backgroundColor: "#f9efe4",
                        }}
                      >
                        {/* <OperatorBanner id={record.operatorId} operators={operators} flag={record.arrivalAirport.flag} /> */}
                        <div style={{ padding: "0.5rem 0.75rem" }}>
                          <Flex justify="space-between">
                            <strong>{record.quotationRequestNumber}</strong>
                            {/* <IoAirplane />{" "} */}
                            {/* <strong>{record.arrivalAirport.shortLabel}</strong> */}
                            <Tag
                              color={
                                record.status == "Fulfilled"
                                  ? "success"
                                  : record.status == "Cancelled"
                                    ? "error"
                                    : record.status == "Quoted"
                                      ? "blue"
                                      : "warning"
                              }
                            >
                              {record.status}
                            </Tag>
                          </Flex>
                          {/* <Flex justify="space-between">
                          <strong>{record.departureAirport.shortLabel}</strong>
                          <IoAirplane />{" "}
                          <strong>{record.arrivalAirport.shortLabel}</strong>
                        </Flex> */}
                          <Divider style={{ margin: "0.5rem 0" }} />
                          <Space direction="vertical" className="w-full">
                            <Flex align="center" gap={4}>
                              <LiaPlaneDepartureSolid />
                              <p>
                                {dayjs(record.trip[0].dateOfDeparture).format(
                                  "DD MMM YYYY"
                                )}
                              </p>
                            </Flex>
                            <Flex align="center" justify="space-between" gap={4} className="w-full">
                              <Flex align="center" gap={4}>
                                <MdAirlineSeatReclineNormal />
                                <p>
                                  {record.numberOfPassengers.total} Passengers
                                </p>
                              </Flex>
                              <Flex align="center" justify="end" gap={4}>
                                {record.petsAllowed && <MdPets />}
                                {record.smokingAllowed && <MdSmokingRooms />}
                              </Flex>
                            </Flex>
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  );
                }
              )
            ) : (
              <Flex justify="center" className="w-full">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </Flex>
            )}
          </Row>
        </Spin>
        <QuotationRequestDrawer open={showDrawer} setOpen={setShowDrawer} />
      </div>
    </main>
  );
};

export default QuotationRequests;
