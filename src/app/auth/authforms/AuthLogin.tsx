"use client";

import {
  Alert,
  Button,
  Checkbox,
  Label,
  Modal,
  Spinner,
  TextInput,
} from "flowbite-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import axios from "axios";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { data: session, status } = useSession(); // Use session and status from next-auth
  const router = useRouter();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [TwoFACode, setTwoFACode] = useState("");
  const [TwoFAModal, setTwoFAModal] = useState(false);
  const [passCode, setPassCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle redirection after login
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to the dashboard or homepage
    }
  }, [status, router]);

 

  const getProfile = async (accessToken: string) => {
    const profile = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (profile.data.status === "success") {
      localStorage.setItem("fullname", profile.data.data.us_fullname);
      localStorage.setItem("username", profile.data.data.us_username);
      localStorage.setItem("email", profile.data.data.us_email);
      return profile.data.status;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Validate form inputs
    if (!username || !password) {
      setError("Username and Password are required");
      return;
    }
    console.log(username, password);

    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          username: username,
          password: password,
        }
      );

      if (result.data.status === "success") {
        if (result.data.access_token && result.data.refresh_token) {
          // console.log(result.data);
          localStorage.setItem("access_token", result.data.access_token);
          localStorage.setItem("refresh_token", result.data.refresh_token);
          const profile = await getProfile(result.data.access_token);
          if (profile === "success") {
            router.push("/");
            setLoading(false);
          }
        } else if (result.data.verify_code) {
          setTwoFAModal(true);
          setLoading(false);
          setTwoFACode(result.data.verify_code);
        }
      } else {
        setLoading(false);
        console.log("sso_auth_fail");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "loading") {
    // Show a loading state while session is being fetched
    return <p>Loading...</p>;
  }

  const verifyPasscode = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/verify`,
        {
          verify_code: TwoFACode,
          passcode: passCode,
        }
      );
      if (res.data.status === "success") {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        router.push("/");
      }
      setLoading(false);
    } catch (error) {}
  };

  return (
    <>
      {title && <p>{title}</p>}
      {subtext}

      {/* Error Alert */}
      {error && (
        <div className="mt-4">
          <Alert
            color="failure"
            icon={() => (
              <Icon
                icon="solar:info-circle-outline"
                className="me-3"
                height={20}
              />
            )}
          >
            {error}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        {/* Username Input */}
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            sizing="md"
            value={username}
            className={error ? "error-border" : ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
          </div>
          <TextInput
            id="password"
            type="password"
            sizing="md"
            value={password}
            className={error ? "error-border" : ""}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Remember Device */}
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember this Device
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-primary text-sm font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button color="primary" type="submit" className="w-full">
          {loading ? (
            <>
              <Spinner
                aria-label="Alternate spinner button example"
                size="sm"
              />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* {subtitle} */}
      <Modal
        show={TwoFAModal}
        onClose={() => {
          setTwoFAModal(false);
        }}
      >
        <Modal.Header className="bg-primary rounded-t-lg text-white">
          <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            {/* Instructions */}
            <h3 className="text-gray-800 font-medium mb-2">
              Enter the 6-Digit Passcode
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Please open your Two-Factor Authentication app and enter the
              6-digit passcode generated for your account.
            </p>

            {/* Passcode Input */}
            <div className="mb-4">
              <Label htmlFor="passCode" value="6-Digit Passcode" />
              <div className="flex justify-center mt-2">
                <TextInput
                  id="passCode"
                  type="text"
                  value={passCode}
                  onChange={(e) => setPassCode(e.target.value)}
                  placeholder="Enter your 6-digit passcode"
                  sizing="md"
                  className="form-control w-6/12 flex justify-center"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                disabled={loading}
                color="primary"
                onClick={verifyPasscode}
              >
                {loading ? (
                  <>
                    <Spinner
                      aria-label="Alternate spinner button example"
                      size="sm"
                    />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthLogin;
