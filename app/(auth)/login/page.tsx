"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Checkbox,
  CheckboxProps,
  Col,
  Form,
  Input,
  Row,
} from "antd";
// Ensure Firebase auth is correctly imported
import { FirebaseError } from "firebase/app";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  signInWithPopup,
} from "firebase/auth";

import themeColors from "@/app/(config)/colors";
import { eRoutes } from "@/app/(config)/routes";
import UnauthenticatedLayout from "@/app/(layouts)/UnauthenticatedLayout";
import { AppLogo } from "@/app/components/CustomIcon";

import { ISignInPayload } from "@/lib/firebase/auth.service";
import { auth } from "@/lib/firebase/firebase";
import { IQuotationRequest } from "@/lib/models/IQuotationRequest";
import { IAirport } from "@/lib/models/airport.model";
import { ISearchItem } from "@/lib/models/search.model";
import { createFederatedAccount, login } from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { create } from "@/lib/state/quotationRequests/quotationRequests.slice";

const socialButtonStyle = {
  width: "100%",
};

const Login = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState<string>("");
  const [pendingCredential, setPendingCredential] = useState<string>();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    isAuthenticated,
    authenticatedUser,
    authenticating,
    hasError,
    errorMessage = "Error: Something went wrong",
  } = useAppSelector((state) => state.auth);

  const { searchFlightCriteria } = useAppSelector((state) => state.flights);
  const { loading } = useAppSelector((state) => state.quotationsRequests);

  const submitQuotationRequest = () => {
    const trip = searchFlightCriteria.map((item: ISearchItem) => ({
      departureAirport: item.departureAirportObject as IAirport,
      arrivalAirport: item.arrivalAirportObject as IAirport,
      dateOfDeparture: new Date(item.departureDate),
      timeOfDeparture: item.departureTime,
    }));

    const payload: IQuotationRequest = {
      trip,
      customerId: authenticatedUser?._id as string,
      numberOfPassengers: {
        total: searchFlightCriteria[0].numberOfPassengers,
        adults: searchFlightCriteria[0].numberOfPassengers,
        children: searchFlightCriteria[0].numberOfPassengers,
        infants: searchFlightCriteria[0].numberOfPassengers,
      },
      petsAllowed: false,
      smokingAllowed: false,
    };

    dispatch(create(payload));
  };

  useEffect(() => {
    if (isAuthenticated && authenticatedUser) {
      const returnUrl = searchParams.get("returnUrl");
      const actionBeforeReturn = searchParams.get("beforeReturn");

      if (authenticatedUser.role) {
        if (returnUrl) {
          if (
            actionBeforeReturn &&
            actionBeforeReturn == "createQuotationRequest" &&
            searchFlightCriteria
          ) {
            !loading.createRecord && submitQuotationRequest();
          }
          router.push(returnUrl);
          return;
        }

        switch (authenticatedUser.role) {
          case "Client":
            router.replace(eRoutes.clientFlights);
            return;
          case "Agency":
            router.replace(eRoutes.agencyDashboard);
            return;
          case "Operator":
            router.replace(eRoutes.operatorDashboard);
            return;
          case "Administrator":
            router.replace(eRoutes.adminDashboard);
            return;
          default:
            router.replace(eRoutes.roleSelection);
            return;
        }
      } else {
        router.replace(eRoutes.roleSelection);
      }
    }
    return () => {};
  }, [isAuthenticated, authenticatedUser, searchParams, router, loading]);

  const handleSignIn = () => {
    if (email && password) {
      const data: ISignInPayload = { email, password };
      dispatch(login(data));
    }
  };

  const checkboxOnChange: CheckboxProps["onChange"] = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      const result: any = response.user;
      const user = {
        ...result.providerData[0],
        fid: result.uid,
        jwtToken: result.accessToken,
      };
      dispatch(createFederatedAccount(user));
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code == "auth/account-exists-with-different-credential") {
          const email = error.customData?.email as string;
          const existingProvider = await fetchSignInMethodsForEmail(
            auth,
            email
          );
          setMessage(
            `An account already exists with this email. Please sign in using ${existingProvider[0]}.`
          );
        } else {
          setMessage("Authentication Failed");
        }
      } else {
        setMessage("Authentication Failed");
      }
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      const result: any = response.user;
      const user = {
        ...result.providerData[0],
        fid: result.uid,
        jwtToken: result.accessToken,
      };
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code == "auth/account-exists-with-different-credential") {
          setPendingCredential("Facebook");
          const email = error.customData?.email as string;
          const existingProvider = await fetchSignInMethodsForEmail(
            auth,
            email
          );
          if (existingProvider.length > 0) {
            setMessage(
              `An account already exists with this email. Please sign in using ${existingProvider[0]}.`
            );
          } else {
            setMessage(`Sign-in using email and password or Google Sign-in.`);
          }
        } else {
          setMessage("Authentication Failed");
        }
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <UnauthenticatedLayout>
      <Row className="h-full">
        <Col span={9} style={{ backgroundColor: themeColors.background.login }}>
          <div
            className="flex flex-col items-center px-24 py-8"
            style={{ minHeight: "65vh" }}
          >
            <Form
              layout="vertical"
              name="sign-in-form"
              className="auth-form w-full self-center text-start"
            >
              <Link href={eRoutes.homePage}>
                <AppLogo src="/images/charter-blue.svg" />
              </Link>
              <h2 className="mb-2">Log in to your Account</h2>
              {/* <p>Welcome back! Select method to log in</p>
							<div className='mt-4' style={{ display: "flex", gap: "16px" }}>
								<Button icon={<GoogleIcon />} size='large' ghost style={socialButtonStyle} onClick={handleGoogleSignIn}>
									Google
								</Button>
								<Button icon={<FacebookIcon />} size='large' ghost style={socialButtonStyle} onClick={handleFacebookSignIn}>
									Facebook
								</Button>
							</div>
							<Divider>or continue with email</Divider> */}
              {hasError && (
                <Alert
                  message={errorMessage}
                  type="error"
                  showIcon
                  style={{ marginBottom: "1rem", fontWeight: 600 }}
                />
              )}
              <Form.Item label="Email Address">
                <Input
                  variant="filled"
                  size="large"
                  type="email"
                  allowClear
                  value={email}
                  placeholder="Email Address"
                  onChange={(event) => setEmail(event.target.value)}
                  prefix={<MailOutlined style={{ marginRight: ".5rem" }} />}
                />
              </Form.Item>
              <Form.Item label="Password">
                <Input.Password
                  // className='custom-field-input'
                  variant="filled"
                  size="large"
                  allowClear
                  value={password}
                  placeholder="Password"
                  onPressEnter={handleSignIn}
                  onChange={(event) => setPassword(event.target.value)}
                  prefix={<LockOutlined style={{ marginRight: ".5rem" }} />}
                />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Checkbox checked={rememberMe} onChange={checkboxOnChange}>
                  Remember me
                </Checkbox>
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  block
                  onClick={handleSignIn}
                  loading={authenticating}
                >
                  SIGN IN
                </Button>
              </Form.Item>
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register">Create an account</Link>
              </p>
              {message && <p>{message}</p>}
            </Form>
          </div>
        </Col>
        <Col span={15} className='bg-[url("/images/bg1.png")] bg-cover' />
      </Row>
    </UnauthenticatedLayout>
  );
};

export default Login;
