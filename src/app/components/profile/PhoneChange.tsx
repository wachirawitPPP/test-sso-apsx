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

interface PhoneChangeProps {
  userData: UserData | null;
}

const PhoneChange: React.FC<PhoneChangeProps> = ({ userData }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [newPhone, setNewPhone] = useState("");
  const [error, setError] = useState("");

  const handlePhoneChange = async () => {
    console.log("New Phone:", newPhone);

    const token = localStorage.getItem("access_token");
    // Make API call to update phone number
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sendotpbysms`,
        {
          us_id: userData?.us_id,
          otp_phone: newPhone,
          otp_type: 3,
        }
      );

      if (res.data.status === "error") {
        setError(res.data.message.split(",")[0].trim());
      }

      setStepIndex(1);
    } catch (error) {}
  };
  return (
    <>
      <Modal.Body>
        {stepIndex === 0 && (
          <>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="newPhone" value="New Phone Number" />
              </div>
              <TextInput
                id="newPhone"
                className="form-control"
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Enter new phone number"
                sizing="md"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handlePhoneChange}>Save</Button>
              {/* <Button color="light" onClick={() => setIsPhoneModalOpen(false)}>
            Cancel
          </Button> */}
            </div>
          </>
        )}
        {stepIndex === 1 && (
          <>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="newPhone" value="New Phone Number" />
              </div>
              <TextInput
                id="newPhone"
                className="form-control"
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Enter new phone number"
                sizing="md"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handlePhoneChange}>Save</Button>
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

export default PhoneChange;
