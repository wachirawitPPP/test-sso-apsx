import axios from "axios";
import { Modal, Label, TextInput, Button } from "flowbite-react";
import React, { useState } from "react";
interface UserData {
  id: number;
  us_id: string;
  us_username: string;
  us_email: string;
  us_fullname: string;
  us_phone: string;
  us_photo: string;
  us_status: number;
}

interface EmailChangeProps {
  userData: UserData | null;
}

const EmailChnage: React.FC<EmailChangeProps> = ({ userData }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpKey, setOtpKey] = useState("");

  const otp_data = {
    us_id: userData?.us_id,
    otp_key: "SDxKifu",
    otp_type: 4,
  };

  const handleEmailChange = async () => {
    console.log("New Email:", newEmail);
    setError("");

    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sendotpbyemail`,
        {
          us_id: userData?.us_id,
          otp_email: newEmail,
          otp_type: 4,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status === "success") {
        setStepIndex(1);
        setOtpKey(res.data.data.otp_key);
        setLoading(false);
      }

      setError(res.data.message.split(",")[0].trim());
      setLoading(false);
    } catch (error) {}
  };
  return (
    <>
      <Modal.Body>
        {stepIndex === 0 && (
          <>
            {error && <div className="text-rose-500">{error}</div>}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="newEmail" value="New Email" />
              </div>
              <TextInput
                id="newEmail"
                className="form-control"
                type="text"
                disabled={loading}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
                sizing="md"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                color={"primary"}
                disabled={loading}
                onClick={handleEmailChange}
              >
                ยืนยัน
              </Button>
              {/* <Button color="light" onClick={() => setIsPhoneModalOpen(false)}>
            Cancel
          </Button> */}
            </div>
          </>
        )}
        {stepIndex === 1 && (
          <>
            <div>
              <div className="mb-2">
                <p className="text-lg">
                  We have sent OTP to{" "}
                  <span className="text-primary">{newEmail}</span>{" "}
                </p>
                <p>Passcode have durations for 5 minutes</p>
              </div>
              <div className="mb-2 block">
                <Label htmlFor="otp" value="OTP" />
                <p>
                  Ref No. : <span className="text-primary">{otpKey}</span>
                </p>
              </div>
              <TextInput
                id="otp"
                className="form-control"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                sizing="md"
              />
            </div>
            <div className="flex justify-end mt-4">
              {/* <Button color={"primary"} onClick={handleEmailChange}>
                Save
              </Button> */}
              {/* <Button color="light" onClick={() => setIsPhoneModalOpen(false)}>
             Cancel
           </Button> */}
            </div>
          </>
        )}
      </Modal.Body>
    </>
  );
};

export default EmailChnage;
