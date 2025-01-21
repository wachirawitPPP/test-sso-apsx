'use client'
import React from "react";
import { Button } from "flowbite-react";
import axios from "axios";

interface Disable2FAProps {
  setIsOpen: (value: boolean) => void;
  getUserData: () => Promise<void>;
}

const Disable2FA: React.FC<Disable2FAProps> = ({ setIsOpen, getUserData }) => {
  const handleDisable = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/deletetfa`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (res.data.status === "success") {
        getUserData();
        setIsOpen(false);
      }
    } catch (error) {}
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Disable Two-Factor Authentication (2FA)
      </h3>
      <p className="text-gray-600 mb-2">
        Are you sure you want to disable Two-Factor Authentication for your
        account? This will remove an extra layer of security.
      </p>
      <div className="flex justify-center gap-4">
        {/* Cancel Button */}
        <Button
          color="light"
          onClick={() => setIsOpen(false)}
          className="px-6 py-2 rounded-md"
        >
          Cancel
        </Button>
        {/* Disable Button */}
        <Button color="error" onClick={handleDisable} className="px-6 py-2">
          Disable 2FA
        </Button>
      </div>
    </div>
  );
};

export default Disable2FA;
