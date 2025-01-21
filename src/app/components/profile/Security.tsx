"use client";
import React, { useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";



import Lottie from "lottie-react";
import CheckAnimation from "../../../../public/images/lottie/lottie-check.json";
import UpdatePassword from "./UpdatePassword";
import TwoFactorAuth from "./TwoFactorAuth";
import { UserData } from "@/utils/type/UserTypes";
// import Disable2FA from "./Disable2FA";
// import UpdateContact from "./UpdateContact";

interface SecurityProps {
  userData: UserData | null;
  getUserData: () => Promise<void>;
}

const Security: React.FC<SecurityProps> = ({ userData,getUserData }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [enable2FAModalOpen, setEnable2FAModalOpen] = useState(false);
  const [disable2FAModalOpen, setDisble2FAModalOpen] = useState(false);

  return (
    <div className="md:w-full lg:w-8/12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Security Settings
      </h2>

      {/* Password Section */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor="password" value="Password" />
            <p className="text-gray-600 mt-2 text-primary">••••••••••••••••••••••••</p>
          </div>
          <Button color="primary" onClick={() => setIsPasswordModalOpen(true)}>
            Change
          </Button>
        </div>
      </div>

      {/* Phone Number Section */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor="us_phone" value="Phone Number" />
            <p className="text-gray-600 mt-2 text-primary">
              {userData?.us_phone || "No phone number linked"}
            </p>
          </div>
          <Button color="primary" onClick={() => setIsPhoneModalOpen(true)}>
            Change
          </Button>
        </div>
      </div>

      {/* Email Section */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor="email" value="Email" />
            <p className="text-gray-600 mt-2 text-primary">
              {userData?.us_email || "No email linked"}
            </p>
          </div>
          <Button color="primary" onClick={() => setIsEmailModalOpen(true)}>
            Change
          </Button>
        </div>
      </div>

      {/* 2FA Section */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor="2FA" value="Two Factors Authentication" />
            {userData?.us_tfa_active === 0 ? (
              <p className="text-gray-600 mt-2 text-primary">
                Enhance your account security with 2FA.
              </p>
            ) : (
              <p className="text-gray-600 mt-2 text-primary">
                Now Your account was protect with 2FA ✅
              </p>
            )}
          </div>
          {userData?.us_tfa_active === 0 ? (
            <Button
              color="primary"
              onClick={() => setEnable2FAModalOpen(true)}
            >
              enable
            </Button>
          ) : (
            <Button color="error" onClick={() => setDisble2FAModalOpen(true)}>
              Disable
            </Button>
          )}
        </div>
      </div>

      {/* Update Password */}
      <Modal
        show={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        size="2xl"
      >
        <Modal.Header className="bg-primary rounded-t-lg text-white">
          Change Password
        </Modal.Header>
        <Modal.Body>
          <UpdatePassword
            userData={userData}
            setIsOpen={setIsPasswordModalOpen}
          />
        </Modal.Body>
      </Modal>

      {/* Change Email Modal */}
      <Modal
        show={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        size="2xl"
      >
        <Modal.Header className="bg-primary rounded-t-lg text-white">
          Change Email
        </Modal.Header>
        {/* <Modal.Body>
          <UpdateContact
            type="email"
            userData={userData}
            setIsOpen={setIsEmailModalOpen}
          />
        </Modal.Body> */}
      </Modal>

      {/* Change Phone Modal */}
      <Modal
        show={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        size="2xl"
      >
        <Modal.Header className="bg-primary rounded-t-lg text-white">
          Change Phone Number
        </Modal.Header>
        {/* <Modal.Body>
          <UpdateContact
            type="phone"
            userData={userData}
            setIsOpen={setIsPhoneModalOpen}
          />
        </Modal.Body> */}
      </Modal>

      {/*Enable 2FA Modal */}
      <Modal
        show={enable2FAModalOpen}
        onClose={() => setEnable2FAModalOpen(false)}
        size="2xl"
      >
        <Modal.Header className="bg-primary rounded-t-lg text-white">
          Enable 2FA
        </Modal.Header>
        <Modal.Body>
          <TwoFactorAuth getUserData={getUserData} setIsOpen={setEnable2FAModalOpen} />
        </Modal.Body>
      </Modal>

      {/* Disable 2FA Modal */}
      <Modal
        show={disable2FAModalOpen}
        onClose={() => setDisble2FAModalOpen(false)}
        size="2xl"
      >
        <Modal.Header className="bg-primary rounded-t-lg text-white">
          Enable 2FA
        </Modal.Header>
        {/* <Modal.Body>
          <Disable2FA getUserData={getUserData} setIsOpen={setDisble2FAModalOpen} />
        </Modal.Body> */}
      </Modal>
    </div>
  );
};

export default Security;
