import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Rate,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  TimePicker,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import { IoMdDownload } from "react-icons/io";
import { IoAirplane } from "react-icons/io5";
import { LiaPlaneDepartureSolid } from "react-icons/lia";
import short from "short-uuid";

import {
  formatToMoneyWithCurrency,
  formatUCTtoISO,
  getTimeFromDate,
} from "@/lib/helpers/formatters.helpers";
import { IAsset } from "@/lib/models/IAssets";
import { IOperator } from "@/lib/models/IOperators";
import {
  IQuotationRequestUpdateDTO,
  ITripLeg,
} from "@/lib/models/IQuotationRequest";
import { IQuotation } from "@/lib/models/IQuotations";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  deselectRecord,
  updateQuotationRequest,
} from "@/lib/state/quotationRequests/quotationRequests.slice";
import {
  accept,
  create,
  findByRequest,
  reject,
  resetActionStates,
  setSelectedQuotation,
} from "@/lib/state/quotations/quotations.slice";

const inputStyle: CSSProperties = { width: "100%" };

const QuotationRequestDrawer = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (arg: boolean) => void;
}) => {
  const [form] = Form.useForm();

  const [tripDetailsOpen, setTripDetailsOpen] = useState(false);
  const [operatorDetailsVisible, setOperatorDetailsVisible] = useState(false);
  const [operatorDetails, setOperatorDetails] = useState<IOperator>();
  const [quotationFormVisible, setQuotationFormVisible] = useState(false);

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { quotations, loading, success, selectedQuotation } = useAppSelector(
    (state) => state.quotations
  );
  const { selectedQuotationRequest } = useAppSelector(
    (state) => state.quotationsRequests
  );

  const { assets } = useAppSelector((state) => state.assets);

  const dispatch = useAppDispatch();

  const cancelRequest = () => {
    const payload: IQuotationRequestUpdateDTO = { status: "Cancelled" };
    dispatch(
      updateQuotationRequest({
        id: selectedQuotationRequest?._id as string,
        payload,
      })
    );
  };

  const acceptQuote = (id: string) => {
    dispatch(accept(id));
  };

  const rejectQuote = (id: string) => {
    dispatch(reject(id));
  };

  const showOperatorDetails = (operator: IOperator) => {
    setOperatorDetails(operator);
    setOperatorDetailsVisible(true);
  };

  const onOperatorDetailsClose = () => {
    setOperatorDetailsVisible(false);
    setOperatorDetails(undefined);
  };

  const showQuotationForm = () => {
    setQuotationFormVisible(true);
  };

  const onQuotationFormClose = () => {
    Modal.confirm({
      title: "Cancel Submission",
      content: "Are you sure you want to cancel this submission?",
      onOk: () => {
        form.resetFields();
        setQuotationFormVisible(false);
      },
      okText: "Yes",
      okButtonProps: { type: "primary", danger: false },
      cancelText: "No",
    });
  };

  useEffect(() => {
    if (success.createRecord) {
      form.resetFields();
      notification.success({
        message: "Quotation Submitted",
        description: "Your quotation has been submitted successfully.",
      });
      setQuotationFormVisible(false);
    }
    return () => { };
  }, [success.createRecord]);

  useEffect(() => {
    if (success.updateRecord && selectedQuotation) {
      form.resetFields();
      notification.success({
        message:
          selectedQuotation.status == "Accepted"
            ? "Quotation Accepted"
            : "Quotation Rejected",
        description:
          selectedQuotation.status == "Accepted"
            ? "You have successfully accepted a quotation on your request."
            : "You have successfully rejected a quotation on your request.",
      });
      setQuotationFormVisible(false);
      dispatch(resetActionStates());
      dispatch(setSelectedQuotation(undefined));
    }
    return () => { };
  }, [success.updateRecord, selectedQuotation, dispatch]);

  useEffect(() => {
    if (selectedQuotationRequest && selectedQuotationRequest._id) {
      dispatch(findByRequest(selectedQuotationRequest._id));
    }
  }, [selectedQuotationRequest, dispatch]);

  const submittedQuotation = () => {
    return quotations.find(
      (quotation) =>
        typeof quotation.operatorId == "object" &&
        quotation.operatorId._id == authenticatedUser?.operatorId
    );
  };

  return (
    <Drawer
      title="Quotation Request"
      placement="right"
      width={800}
      onClose={() => {
        setOpen(false);
        dispatch(deselectRecord());
      }}
      open={open}
      extra={
        <Space>
          {authenticatedUser &&
            ["Client", "Agency"].includes(authenticatedUser.role!) &&
            ["Quoted", "Pending"].includes(
              selectedQuotationRequest?.status!
            ) && (
              <Button danger onClick={cancelRequest}>
                Cancel Request
              </Button>
            )}
          {authenticatedUser &&
            authenticatedUser.role == "Operator" &&
            submittedQuotation() == undefined && (
              <Button
                type="primary"
                onClick={showQuotationForm}
                disabled={["Cancelled", "Fulfilled"].includes(
                  selectedQuotationRequest?.status!
                )}
              >
                Submit Quotation
              </Button>
            )}
        </Space>
      }
    >
      <h5>Request Details</h5>
      <Descriptions
        size="small"
        items={[
          {
            key: "Quotation Request Number",
            label: "Quotation Request Number",
            span: 2,
            children: <>{selectedQuotationRequest?.quotationRequestNumber}</>,
          },
          {
            key: "Number of Passengers",
            label: "Number of Passengers",
            span: 1,
            children: <>{selectedQuotationRequest?.numberOfPassengers.total}</>,
          },
          {
            key: "Pets Allowed",
            label: "Pets Allowed",
            span: 2,
            children: (
              <>{selectedQuotationRequest?.petsAllowed ? "YES" : "NO"}</>
            ),
          },
          {
            key: "Smoking Allowed",
            label: "Smoking Allowed",
            span: 1,
            children: (
              <>{selectedQuotationRequest?.smokingAllowed ? "YES" : "NO"}</>
            ),
          },
          {
            key: "Trip",
            label: "Trip Legs",
            span: 2,
            children: (
              <Tag
                color="blue"
                className="cursor-pointer"
                onClick={() => setTripDetailsOpen(true)}
              >
                <EyeOutlined /> {selectedQuotationRequest?.trip.length} Legs
              </Tag>
            ),
          },
          {
            key: "Status",
            label: "Status",
            span: 1,
            children: (
              <Tag
                color={
                  selectedQuotationRequest?.status == "Fulfilled"
                    ? "success"
                    : selectedQuotationRequest?.status == "Cancelled"
                      ? "error"
                      : selectedQuotationRequest?.status == "Quoted"
                        ? "blue"
                        : "warning"
                }
              >
                {selectedQuotationRequest?.status}
              </Tag>
            ),
          },
        ]}
      />
      <Divider style={{ margin: "1rem 0" }} />
      <h5 className="mt-4">Quotations Received</h5>
      <List
        className="quotations-list"
        loading={loading.listRecords}
        itemLayout="horizontal"
        dataSource={quotations}
        renderItem={(item: IQuotation, index) => {
          const aircraft = item.aircraftId as IAsset;

          const images = aircraft?.images || [];
          const featureImage = images[0] ? (
            <Image
              alt={images[0].name}
              width={60}
              height={60}
              src={`data:${images[0].mimetype};base64,${images[0].data}`}
              style={{ borderRadius: 8 }}
            />
          ) : undefined;

          return (
            <List.Item key={item._id}>
              <List.Item.Meta
                avatar={featureImage}
                title={
                  <Flex justify="space-between">
                    <span>{item.quotationNumber}</span>
                    <Tag
                      color={
                        item.status == "Accepted"
                          ? "success"
                          : item.status == "Rejected"
                            ? "error"
                            : "blue"
                      }
                    >
                      {item.status}
                    </Tag>
                  </Flex>
                }
                description={
                  <div className="mt-2">
                    <Descriptions
                      size="small"
                      items={[
                        {
                          key: "Operator",
                          label: "Operator",
                          span: 3,
                          children: (
                            <Flex>
                              <span>
                                {typeof item.operatorId == "object"
                                  ? item.operatorId.airline
                                  : item.operatorId}
                              </span>
                              <InfoCircleOutlined
                                className="ml-2"
                                onClick={() =>
                                  showOperatorDetails(
                                    item.operatorId as IOperator
                                  )
                                }
                              />
                            </Flex>
                          ),
                        },
                        {
                          key: "Aircraft",
                          label: "Aircraft",
                          span: 3,
                          children: (
                            <span>
                              {typeof item.aircraftId == "object"
                                ? item.aircraftId?.manufacturer
                                : item.aircraftId}
                              {" - "}
                              {typeof item.aircraftId == "object"
                                ? item.aircraftId?.model
                                : item.aircraftId}
                            </span>
                          ),
                        },
                        {
                          key: "Validity",
                          label: "Valid Until",
                          span: 2,
                          children: (
                            <>
                              {formatUCTtoISO(item.expirationDate.toString())}{" "}
                              {getTimeFromDate(item.expirationDate.toString())}
                            </>
                          ),
                        },
                        {
                          key: "Price",
                          label: "Price",
                          span: 1,
                          children: (
                            <>{formatToMoneyWithCurrency(item.price.amount)}</>
                          ),
                        },
                      ]}
                    />
                    {item.status == "Submitted" &&
                      authenticatedUser?.role != "Operator" && (
                        <Flex justify="start" gap={16} className="mt-4">
                          <Button
                            type="primary"
                            size="small"
                            style={{ padding: "14px 1rem" }}
                            onClick={() => acceptQuote(item._id!)}
                          >
                            Accept
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            style={{ padding: "14px 1rem" }}
                            onClick={() => rejectQuote(item._id!)}
                            danger
                          >
                            Reject
                          </Button>
                        </Flex>
                      )}
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <Drawer
        title="Trip Details"
        width={600}
        closable={true}
        onClose={() => {
          setTripDetailsOpen(false);
        }}
        open={tripDetailsOpen}
      >
        <List
          grid={{
            gutter: 16,
            column: 1,
          }}
          className="quotations-list"
          itemLayout="horizontal"
          dataSource={selectedQuotationRequest?.trip}
          renderItem={(item: ITripLeg, index) => {
            return (
              <List.Item>
                <Card>
                  <Flex justify="space-between">
                    <div>
                      <h5 className="mb-1">
                        {item.departureAirport?.shortLabel}
                      </h5>
                      <Flex align="center" gap={4}>
                        <LiaPlaneDepartureSolid />
                        <p>
                          {dayjs(item.dateOfDeparture).format("DD MMM YYYY")}
                        </p>
                      </Flex>
                      <Flex align="center" gap={4}>
                        <ClockCircleOutlined />
                        <p>{item.timeOfDeparture}</p>
                      </Flex>
                    </div>
                    <IoAirplane size={16} color="#0B3746" className="mt-1" />{" "}
                    <div className="text-end">
                      <h5>{item.arrivalAirport?.shortLabel}</h5>
                    </div>
                  </Flex>
                </Card>
              </List.Item>
            );
          }}
        />
      </Drawer>
      <Drawer
        title="Operator Details"
        width={600}
        closable={true}
        onClose={onOperatorDetailsClose}
        open={operatorDetailsVisible}
      >
        <Image
          alt=""
          width={512}
          height={512}
          src={
            operatorDetails?.logo?.data ?? "/images/logo-placeholder-image.png"
          }
          style={{ width: 80, height: 80, borderRadius: "50%" }}
        />
        <Typography.Title level={3} className="mb-0">
          {operatorDetails?.airline}
        </Typography.Title>
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          <p>
            Our commitment to personalized travel ensures every journey is
            seamless, private, and designed to meet the unique needs of our
            clients.
          </p>
          <Card
            style={{
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#f0eae3",
            }}
          >
            <Row gutter={16} align="middle" justify="center">
              <Col span={8}>
                <Flex
                  vertical
                  align="center"
                  justify="center"
                  style={{ textAlign: "center" }}
                >
                  <Image
                    alt=""
                    width={80}
                    height={80}
                    src="https://w7.pngwing.com/pngs/690/841/png-transparent-lufthansa-logo-lufthansa-cargo-flight-airline-logo-airline-miscellaneous-text-otto-firle.png"
                    // preview={false}
                    style={{ width: 80, height: 80, borderRadius: "50%" }}
                  />
                  <Typography.Title level={5}>Fly Blue</Typography.Title>
                </Flex>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <CheckCircleOutlined
                    style={{
                      fontSize: "63px",
                      color: "#52c41a",
                      marginTop: 10,
                    }}
                  />
                  <Typography.Title style={{ marginTop: 10 }} level={5}>
                    Verified Operator
                  </Typography.Title>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: "center" }}>
                  <Rate
                    style={{ color: "#0b3746", fontSize: 20, marginTop: 30 }}
                    disabled
                    defaultValue={4}
                  />
                  <Typography.Title style={{ marginTop: 30 }} level={5}>
                    Customer Satisfaction
                  </Typography.Title>
                </div>
              </Col>
            </Row>
          </Card>
          <Card
            style={{
              borderRadius: "20px",
              padding: ".5rem",
              border: "none",
              backgroundColor: "#f0eae3",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Text style={{ fontSize: 14 }} strong>
                Air Operator Certificate
              </Typography.Text>
              <IoMdDownload
                style={{
                  marginLeft: 8,
                  marginRight: 20,
                  marginTop: 10,
                  fontSize: 16,
                }}
              />
            </div>
            <Divider style={{ margin: "1rem 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Text style={{ fontSize: 14 }} strong>
                Certificate of Insurance
              </Typography.Text>
              <IoMdDownload
                style={{ marginLeft: 8, marginRight: 20, fontSize: 16 }}
              />
            </div>
            <Divider style={{ margin: "1rem 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography.Text style={{ fontSize: 14 }} strong>
                Certificate of Air Worthiness
              </Typography.Text>
              <IoMdDownload
                style={{ marginLeft: 8, marginRight: 20, fontSize: 16 }}
              />
            </div>
          </Card>
        </Space>
      </Drawer>
      <Drawer
        title="Submit Quotation"
        width={800}
        onClose={onQuotationFormClose}
        destroyOnClose={true}
        open={quotationFormVisible}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                form.validateFields().then((value) => form.submit());
              }}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          id="submit-quotation-form"
          form={form}
          onFinish={(values) => {
            const translator = short();
            const uid = translator.new();
            const payload: any = {
              quotationNumber: `QT-${uid}`,
              quotationRequestId: selectedQuotationRequest?._id,
              status: "Submitted",
              aircraftId: values.aircraftId,
              operatorId: authenticatedUser?.operatorId,
              flightDuration:
                values.flightDurationHours + values.flightDurationMinutes / 60,
              flightDetails: {
                operatorId: authenticatedUser?.operatorId,
                aircraftId: values.aircraftId,
                // departure: selectedQuotationRequest?.dateOfDeparture,
                duration: values.flightDurationHours,
                // departureAirport: selectedQuotationRequest?.departureAirport,
                // arrivalAirport: selectedQuotationRequest?.arrivalAirport,
                status: "Offered",
                arrivalDate: values.arrivalDate,
                arrivalMeetingArea: values.arrivalMeetingPlace,
                arrivalMeetingTime: values.arrivalMeetingTime,
                durationMinutes: values.flightDurationMinutes,
                flexibleDate: values.flexibleDate,
                flexibleDepartureTime: values.flexibleDepartureTime,
                flexibleRouting: values.flexibleRouting,
                checklist: {},
                notes: [],
                luggageWeightUnits: "kgs",
                maxLuggagePerPerson: 30,
                meetingArea: values.departureMeetingPlace,
                meetingTime: values.departureMeetingTime,
                offerExpiryHoursPriorToFlight:
                  values.offerExpiryHoursPriorToFlight,
                passengers: [],
                pricePerSeat: values.seatPrice,
              },
              price: {
                amount: values.seatPrice,
                currency: "USD",
                symbol: "$",
              },
              expirationDate: values.expirationDate.toISOString(),
              auditFields: {
                created_by: authenticatedUser?.displayName,
                created_by_reference: authenticatedUser?._id,
                date_created: new Date().toISOString(),
              },
            };
            dispatch(create(payload));
          }}
        >
          <Flex gap={16} style={{ width: "100%" }}>
            <Form.Item
              label="Aircraft Model"
              name="model"
              style={{ width: "100%" }}
              rules={[
                { required: true, message: "Please select the aircraft model" },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select"
                allowClear
                options={Array.from(
                  new Set(assets.map((asset) => asset.model))
                ).map((model) => ({
                  label: model,
                  value: model,
                  key: model,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Aircraft Registration"
              name="aircraftId"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Please select the aircraft registration number",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select"
                allowClear
                options={assets.map((asset) => ({
                  label: asset.registrationNumber,
                  value: asset._id,
                  key: asset._id,
                }))}
              />
            </Form.Item>
          </Flex>
          <Flex gap={16} style={{ width: "100%" }}>
            <Form.Item
              label="Seat Price"
              name="seatPrice"
              rules={[{ required: true }]}
              style={{ width: "33%" }}
            >
              <InputNumber
                min={0}
                step={100}
                addonBefore="$"
                addonAfter="USD"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Valid Until"
              name="expirationDate"
              rules={[{ required: true }]}
              style={{ width: "33%" }}
            >
              <DatePicker
                onChange={(date, dateString) => { }}
                minDate={dayjs().add(1, "day")}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Offer expiry hours prior to flight"
              name="offerExpiryHoursPriorToFlight"
              style={{ width: "33%" }}
            >
              <InputNumber
                min={0}
                max={30}
                step={1}
                addonAfter="hours"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Flex>
          <h5>Trip Legs</h5>
          <Collapse
            accordion
            items={selectedQuotationRequest?.trip.map(
              (tripLeg: ITripLeg, index: number) => {
                return {
                  key: index + 1,
                  label: <Flex justify="space-between">
                    <div>
                      <h5 className="mb-1">
                        {tripLeg.departureAirport?.shortLabel}
                      </h5>
                      <Flex align="center" gap={4}>
                        <LiaPlaneDepartureSolid />
                        <p className="mr-4">
                          {dayjs(tripLeg.dateOfDeparture).format("DD MMM YYYY")}
                        </p>
                        <ClockCircleOutlined />
                        <p>{tripLeg.timeOfDeparture}</p>
                      </Flex>
                    </div>
                    <IoAirplane size={16} color="#0B3746" className="mt-1" />{" "}
                    <div className="text-end">
                      <h5>{tripLeg.arrivalAirport?.shortLabel}</h5>
                    </div>
                  </Flex>,
                  children: (
                    <div>
                      <Flex gap={16} style={{ width: "100%" }}>
                        <Form.Item
                          label="Departure Date"
                          name="departureDate"
                          rules={[{ required: true }]}
                          style={{ width: "100%" }}
                        >
                          <DatePicker
                            defaultValue={dayjs(tripLeg.dateOfDeparture)}
                            defaultPickerValue={dayjs(tripLeg.dateOfDeparture)}
                            onChange={(date, dateString) => { }}
                            minDate={dayjs().add(1, "day")}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Departure Meeting Place"
                          name="departureMeetingPlace"
                          rules={[{ required: true }]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            style={{ width: "100%" }}
                            addonAfter={<EnvironmentOutlined />}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Departure Meeting Time"
                          name="departureMeetingTime"
                          rules={[{ required: true }]}
                          style={{ width: "100%" }}
                        >
                          <TimePicker
                            defaultValue={dayjs("12:08", "HH:mm")}
                            format={"HH:mm"}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Flex>
                      <Flex gap={16} style={{ width: "100%" }}>
                        <Form.Item
                          label="Arrival Date"
                          name="arrivalDate"
                          rules={[{ required: true }]}
                          style={{ width: "100%" }}
                        >
                          <DatePicker
                            onChange={(date, dateString) => { }}
                            minDate={dayjs().add(1, "day")}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Arrival Meeting Place"
                          name="arrivalMeetingPlace"
                          rules={[{ required: true }]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            style={{ width: "100%" }}
                            addonAfter={<EnvironmentOutlined />}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Arrival Meeting Time"
                          name="arrivalMeetingTime"
                          rules={[{ required: true }]}
                          style={{ width: "100%" }}
                        >
                          <TimePicker
                            defaultValue={dayjs("12:08", "HH:mm")}
                            format={"HH:mm"}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Flex>
                      <Row>
                        <Col span={16}>
                          <Form.Item
                            label="Flight Duration"
                            name="flightDuration"
                            rules={[{ required: true }]}
                            style={{ width: "100%" }}
                          >
                            <Flex gap={16} style={{ width: "100%" }}>
                              <Form.Item
                                noStyle
                                name="flightDurationHours"
                                style={{ width: "100%" }}
                              >
                                <InputNumber
                                  min={0}
                                  max={30}
                                  step={1}
                                  style={{ width: "100%" }}
                                  addonAfter="hours"
                                />
                              </Form.Item>
                              <Form.Item
                                noStyle
                                name="flightDurationMinutes"
                                style={{ width: "100%" }}
                              >
                                <InputNumber
                                  min={0}
                                  max={59}
                                  step={5}
                                  style={{ width: "100%" }}
                                  addonAfter="minutes"
                                />
                              </Form.Item>
                            </Flex>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Flex gap={16} style={{ width: "100%" }}>
                        <Form.Item
                          layout="horizontal"
                          label="Flexible Date"
                          name="flexibleDate"
                          style={{ width: "100%" }}
                        >
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            defaultValue={false}
                          />
                        </Form.Item>
                        <Form.Item
                          layout="horizontal"
                          label="Flexible Departure Time"
                          name="flexibleDepartureTime"
                          style={{ width: "100%" }}
                        >
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            defaultValue={false}
                          />
                        </Form.Item>
                        <Form.Item
                          layout="horizontal"
                          label="Flexible Routing"
                          name="flexibleRouting"
                          style={{ width: "100%" }}
                        >
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            defaultValue={false}
                          />
                        </Form.Item>
                      </Flex>
                    </div>
                  ),
                };
              }
            )}
          />
        </Form>
      </Drawer>
    </Drawer>
  );
};

export default QuotationRequestDrawer;
