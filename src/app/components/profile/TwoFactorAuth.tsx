'use client'
import React, { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import Image from "next/image";
import axios from "axios";

interface TwoFAProps {
  setIsOpen: (value: boolean) => void;
  getUserData: () => Promise<void>;
}

const TwoFactorAuth: React.FC<TwoFAProps> = ({ setIsOpen,getUserData }) => {
  const [verificationCode, setVerificationCode] = useState(""); // State for verification input
  const [qrCode, setQrCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const getVerificationCode = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const verifyCode = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/createtfa`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (verifyCode.data.status === "success") {
        setVerificationCode(verifyCode.data.data.verify_code);
        setQrCode(verifyCode.data.data.image);
      }
    } catch (error) {}
  };
  const handleVerify = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/verifytfa`,
        {
          verify_code: verificationCode,
          passcode: passcode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (res.data.status === "success") {
        getUserData()
        setIsOpen(false)
        alert("2FA Success");
      } else {
        // Handle error
      }
    } catch (error) {}
  };

  useEffect(() => {
    getVerificationCode();
  }, []);
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Enable Two-Factor Authentication (2FA)
      </h3>
      <p className="text-gray-600 mb-4">
        Use a 2FA app (like Google Authenticator) to scan the QR code below.
      </p>

      {/* Part 1: QR Code */}
      <div className="flex justify-center mb-6">
        <Image
          src={qrCode||""}
          alt="2FA QR Code"
          height={200}
          width={200}
          className="rounded-lg shadow-md"
        />
      </div>

      <p className="text-gray-600 mb-6">
        After scanning the QR code, use the 2FA app to generate a code and enter
        it below:
      </p>

      {/* Part 2: Verification Code Input */}
      <div className="mb-6">
        <Label htmlFor="passcode" value="Passcode Code" />
        <TextInput
          id="passcode"
          type="text"
          placeholder="Enter 6-digit code"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="mt-2 text-center"
        />
      </div>

      {/* Close and Verify Buttons */}
      <div className="flex justify-center gap-4">
        <Button color="primary" onClick={handleVerify}>
          Verify
        </Button>
        <Button color="error" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
