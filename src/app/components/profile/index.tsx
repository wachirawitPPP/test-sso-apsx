"use client";
import React, { useEffect, useState } from "react";
import ProfileMenu from "./ProfileMenu";
import axios from "axios";
import ProfileSetting from "./ProfileSetting";
import Security from "./Security";

const ProfileApps: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState<number>(1); // Default index
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const getUserData = async () => {
    const token = localStorage.getItem("access_token");
    try {
      setLoading(true); // Start loading
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "success") {
        setUserData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    
      getUserData();
    
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left side menu */}
      <div className="md:w-2/4 lg:w-1/4 w-full p-4 border-2 rounded-md mb-4 lg:mb-0">
        <ProfileMenu
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        />
      </div>

      {/* Right side content */}
      <div className="flex-1 p-4">
        <div className="mt-4">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p> // Show loading message
          ) : (
            <>
              {selectedMenu === 0 && <ProfileSetting userData={userData} getUserData={getUserData} />}
              {selectedMenu === 1 && <Security userData={userData} getUserData={getUserData} />}
              {selectedMenu === 2 && <p>Here are your Settings.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileApps;
