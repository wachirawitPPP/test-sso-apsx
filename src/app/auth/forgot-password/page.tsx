"use client";

import { Alert, Button, Label, TextInput, Card } from "flowbite-react";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Language } from "@/app/(DashboardLayout)/layout/vertical/header/Language";
import { useTranslation } from "react-i18next";


const TIMER_DURATION = 300; // Timer duration in seconds

// Reusable Alert Component
const AlertMessage = ({
  type,
  message,
}: {
  type: "success" | "failure";
  message: string;
}) => (
  <Alert
    color={type}
    icon={() => (
      <Icon
        icon={
          type === "success"
            ? "solar:check-circle-outline"
            : "solar:info-circle-outline"
        }
        className="me-3"
        height={20}
      />
    )}
  >
    {message}
  </Alert>
);

const ForgotPassword: React.FC = () => {
 
  // State Variables
  const [stepIndex, setStepIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState<any>();
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [otpKey, setOtpKey] = useState("");
  const [confirmedOtpKey, setConfirmedOtpKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { t } = useTranslation();

  // Timer Management
  useEffect(() => {
    if (stepIndex === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [stepIndex, timeLeft]);

  const resetTimer = () => setTimeLeft(TIMER_DURATION);

  // API Handlers
  const handleApiCall = async (url: string, data: object) => {
    try {
      const response = await axios.post(url, data);
      if (response.data.status === "success") {
        return response.data;
      } else {
        setError(response.data.message.split(",")[0].trim());
        return null;
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      return null;
    }
  };

  // Form Handlers
  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) return setError("Username is required");
    const response = await handleApiCall(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/getuserforget`,
      {
        search_text: username,
      }
    );
    if (response) {
      setUserData(response.data);
      setStepIndex(1);
      setError("");
    }
  };

  const handleContinue = async () => {
    if (!selectedMethod)
      return setError("Please select a method to receive OTP");
    const otpType = selectedMethod === "email" ? 2 : 1;
    const url =
      selectedMethod === "email"
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/sendotpbyemail`
        : `${process.env.NEXT_PUBLIC_API_URL}/auth/sendotpbysms`;

    const response = await handleApiCall(url, {
      us_id: userData?.us_id,
      otp_type: otpType,
    });
    console.log(response.status);
    if (response.status === "success") {
      setOtpKey(response.data.otp_key);
      resetTimer();
      setStepIndex(2);
      setError("");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp) return setError("OTP is required");
    const response = await handleApiCall(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyotp`,
      {
        us_id: userData?.us_id,
        otp_key: otpKey,
        otp_code: otp,
        otp_type: selectedMethod === "email" ? 2 : 1,
      }
    );
    if (response) {
      setConfirmedOtpKey(response.data.otpk_key);
      setStepIndex(3);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword)
      return setError("All fields are required");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    const response = await handleApiCall(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/resetpassword`,
      {
        us_id: userData?.us_id,
        otpk_key: confirmedOtpKey,
        password: newPassword,
      }
    );
    if (response) {
      setSuccessMessage("Password updated successfully!");
      setStepIndex(4);
    }
  };

  const formatTime = (time: number) =>
    `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
      time % 60
    ).padStart(2, "0")}`;

  // Render Steps
  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return (
          <form onSubmit={handleUsernameSubmit}>
            <div className="my-2">
              <Label htmlFor="username" value={t("Username")} />
            </div>
            <TextInput
              id="username"
              value={username}
              className="rounded-md"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button type="submit" color={"primary"} className="w-full mt-4">
              {t("Search")}
            </Button>
          </form>
        );
      case 1:
        return (
          <>
            {["email", "phone"].map((method) =>
              userData?.[method] ? (
                <Card
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`cursor-pointer my-2 ${
                    selectedMethod === method ? "border-primary border-2" : ""
                  }`}
                >
                  <span className="font-semibold">
                    {t(`${method}`).toUpperCase()}
                  </span>
                  <p className="text-lg">{userData[method]}</p>
                </Card>
              ) : null
            )}
            <Button
              color={"primary"}
              onClick={handleContinue}
              className="w-full mt-4"
              disabled={!selectedMethod}
            >
              Continue
            </Button>
          </>
        );
      case 2:
        return (
          <form onSubmit={handleOtpSubmit} className="">
            <div className="my-4">
              <span className="text-lg">
                {t("We sent a OTP to you at")} :
                <span className="text-lg text-primary">{email}</span>
              </span>
            </div>
            <div className="my-4">
              <Label htmlFor="otp" value="Enter OTP" />
              <span>
                {" "}
                {t("Ref No.")}: {otpKey || "-"}
              </span>
            </div>
            <TextInput
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="flex flex-row justify-between my-4">
              <p>
                {t("Haven't received OTP ?")}{" "}
                <span
                  onClick={handleContinue}
                  className="underline cursor-pointer text-primary"
                >
                  {t("Resend OTP")}
                </span>
              </p>
              <p>
                {timeLeft > 0
                  ? `Time remaining: ${formatTime(timeLeft)}`
                  : "OTP expired"}
              </p>
            </div>
            <Button
              type="submit"
              color={"primary"}
              className="w-full mt-4"
              disabled={timeLeft === 0}
            >
              {t("Verify")}
            </Button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handlePasswordUpdate}>
            <div className="my-2">
              <Label htmlFor="newPassword" value={t("New Password")} />
            </div>
            <TextInput
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="my-2">
              <Label htmlFor="confirmPassword" value={t("Confirm Password")} />
            </div>
            <TextInput
              className="rounded-md"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" color={"primary"} className="w-full mt-4">
              {t("Confirm")}
            </Button>
          </form>
        );
      case 4:
        return (
          <p className="text-center text-green-500">
            Password updated successfully!
          </p>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <Language />
        <h1 className="text-lg font-semibold text-center">
          {t("Forgot Password")}
        </h1>
        {error && <AlertMessage type="failure" message={error} />}
        {successMessage && (
          <AlertMessage type="success" message={successMessage} />
        )}
        {renderStep()}
        {stepIndex > 0 && stepIndex < 3 && (
          <Button
            color={"white"}
            onClick={() => setStepIndex(stepIndex - 1)}
            className="mt-4 w-full border-2 border-gray-200 rounded-md hover:bg-gray-100"
          >
            {t("Back")}
          </Button>
        )}
        <Link
          href="/auth/auth1/login"
          className="block text-center text-sm text-primary mt-4 underline"
        >
          {t("Back to Login")}
        </Link>
      </div>
    </div>
  );
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}
