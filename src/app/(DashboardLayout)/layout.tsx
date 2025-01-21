"use client";
import React, { useContext, useEffect } from "react";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Header from "./layout/vertical/header/Header";
import { Customizer } from "./layout/shared/customizer/Customizer";
import { CustomizerContext } from "@/app/context/customizerContext";
import { jwtDecode } from "jwt-decode";
// Define the shape of the context state

interface TokenPayload {
  exp: number; // Token expiration timestamp (in seconds)
  [key: string]: any; // Other optional claims
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decoded: TokenPayload = jwtDecode(token); // Decode the token
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
    return decoded.exp < currentTime; // Token is expired if `exp` is less than current time
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // Assume expired if token is invalid
  }
};



const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch("http://localhost:3001/auth/renew", {
      method: "POST",
      headers: { "Content-Type": "application/json","Authorization": "Bearer " + refreshToken},
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token); // Save new access token
      console.log("Token refreshed successfully.");
    } else {
      console.log("Failed to refresh token.");
      handleLogout();
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    handleLogout();
  }
};

const handleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "http://127.0.0.1:3000/auth/auth1"; // Redirect to login
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeLayout, isLayout } = useContext(CustomizerContext);
  useEffect(() => {
    const checkAndRefreshToken = () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (isTokenExpired(accessToken)) {
        console.log("Access token is expired.");

        // Handle token refresh logic
        if (refreshToken && !isTokenExpired(refreshToken)) {
          console.log("Refreshing token...");
          refreshAccessToken(refreshToken);
        } else {
          console.log("Refresh token is expired or missing. Logging out...");
          handleLogout();
        }
      } else {
        console.log("Access token is valid.");
      }
    };

    // Initial check
    checkAndRefreshToken();

    // Set interval to check every 20 seconds
    const intervalId = setInterval(checkAndRefreshToken, 20000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="flex w-full min-h-screen">
      <div className="page-wrapper flex w-full">
        {/* Header/sidebar */}
        {activeLayout == "vertical" ? <Sidebar /> : null}
        <div className="body-wrapper w-full bg-lightgray dark:bg-dark">
          {/* Top Header  */}
          {activeLayout == "horizontal" ? (
            <Header layoutType="horizontal" />
          ) : (
            <Header layoutType="vertical" />
          )}

          {/* Body Content  */}
          <div
            className={` ${isLayout == "full"
              ? "w-full py-[30px] md:px-[30px] px-5"
              : "container mx-auto  py-[30px]"
              } ${activeLayout == "horizontal" ? 'xl:mt-3' : ''}
            `}
          >
            {children}
          </div>
          <Customizer />
        </div>
      </div>
    </div>
  );
}
