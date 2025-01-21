import axios from "axios";
import { Modal, Label, TextInput, Button, Tabs } from "flowbite-react";
import React, { useState } from "react";
import Lottie from "lottie-react";
import CheckAnimation from "../../../../public/images/lottie/lottie-check.json";
import { UserData } from "@/utils/type/UserTypes";


interface UpdateProps {
  userData: UserData | null;
  type: string;
  setIsOpen: (value: boolean) => void;
}

const UpdateContact: React.FC<UpdateProps> = ({ userData, type,setIsOpen }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [updateType, setUpdateType] = useState<string>(type);
  const [newContact, setNewContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpKey, setOtpKey] = useState("");

  const isEmail = updateType === "email";

  const sendOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const endpoint = isEmail
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/sendotpbyemail`
        : `${process.env.NEXT_PUBLIC_API_URL}/auth/sendotpbysms`;

      const res = await axios.post(
        endpoint,
        {
          us_id: userData?.us_id,
          [isEmail ? "otp_email" : "otp_phone"]: newContact,
          otp_type: isEmail ? 4 : 5,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        setStepIndex(1);
        setOtpKey(res.data.data.otp_key);
      } else {
        setError(res.data.message.split(",")[0].trim());
      }
    } catch (err) {
      setError(`Failed to send OTP. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndUpdate = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyotp`,
        {
          us_id: userData?.us_id,
          otp_key: otpKey,
          otp_code: otp,
          otp_type: isEmail ? 4 : 3,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        const updateEndpoint = isEmail
          ? `${process.env.NEXT_PUBLIC_API_URL}/profile/email`
          : `${process.env.NEXT_PUBLIC_API_URL}/profile/phone`;

        await axios.put(
          updateEndpoint,
          {
            otpk_key: res.data.data.otpk_key,
            [isEmail ? "email" : "phone"]: newContact,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStepIndex(2);
      } else {
        setError(res.data.message.split(",")[0].trim());
      }
    } catch (err) {
      setError(`Failed to verify OTP. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            {error && <div className="text-rose-500">{error}</div>}
            <div className="mb-2">
              <div className="mb-2">
                <Label
                  htmlFor="newContact"
                  value={isEmail ? "New Email" : "New Phone Number"}
                />
              </div>
              <TextInput
                id="newContact"
                type="text"
                disabled={loading}
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                placeholder={`Enter new ${isEmail ? "email" : "phone number"}`}
                sizing="md"
                className="form-control"
              />
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                color="primary"
                disabled={loading || !newContact}
                onClick={sendOtp}
              >
                ยืนยัน
              </Button>
              <Button color="error" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            {error && <div className="text-rose-500">{error}</div>}
            <div className="mb-2">
              <p className="text-lg">
                We have sent OTP to{" "}
                <span className="text-primary">{newContact}</span>.
              </p>
              <p>Passcode expires in 5 minutes.</p>
            </div>
            <div className="mb-2">
              <div className="mb-2">
                <Label htmlFor="otp" value="OTP" />
              </div>
              <TextInput
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                sizing="md"
                className="form-control"
              />
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                color="primary"
                disabled={loading || !otp}
                onClick={verifyOtpAndUpdate}
              >
                ยืนยัน
              </Button>
              <Button color="error" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <div className="w-36 h-36 mx-auto">
              <Lottie
                animationData={CheckAnimation}
                loop={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <p className="text-lg font-semibold mt-4">
              {isEmail ? "Email" : "Phone number"} updated successfully!
            </p>
            <div className="flex justify-center mt-6">
              <Button
                color="primary"
                onClick={() =>setIsOpen(false)}
              >
                ปิด
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderStepContent()
};

export default UpdateContact;
