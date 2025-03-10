"use client";

import {
  Alert,
  Button,
  Checkbox,
  HelperText,
  Label,
  Modal,
  Spinner,
  TextInput,
  Toast,
} from "flowbite-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import axios from "axios";
import toast from "react-hot-toast";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const id = searchParams.get("redirect");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [TwoFACode, setTwoFACode] = useState("");
  const [TwoFAModal, setTwoFAModal] = useState(false);
  const [passCode, setPassCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle redirection after login
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/app-menu"); // Redirect to the dashboard or homepage
  //   }
  // }, [status, router]);

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
    setError("");
    setLoading(true);
    // Validate form inputs
    if (!username || !password) {
      setError(t("Username and Password are required"));
      setLoading(false);
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
            if (id) {
              router.push(`/redirect?id=${id}`);
              setLoading(false);
            } else {
              router.push("/app-menu");
              setLoading(false);
            }
          }
        } else if (result.data.verify_code) {
          setTwoFAModal(true);
          setLoading(false);
          setTwoFACode(result.data.verify_code);
        }
      } else if (result.data.status === "error") {
        toast.error(t("Invalid username and password"), {
          position: "top-right",
          duration: 5000,
          style: {
            minWidth: "300px",
            padding: "25px",
            border: "1px solid red"
          },
        });
        setLoading(false);
        console.log("sso_auth_fail");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // if (status === "loading") {
  //   // Show a loading state while session is being fetched
  //   return <p>Loading...</p>;
  // }

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
        const profile = await getProfile(res.data.access_token);
        if (profile === "success") {
          if (id) {
            router.push(`/redirect?id=${id}`);
            setLoading(false);
          } else {
            router.push("/app-menu");
            setLoading(false);
          }
        }
      }
    } catch (error) {}
  };

  return (
    <>
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
            <Label htmlFor="username" value={t("Username")} />
          </div>
          <TextInput
            id="username"
            type="text"
            sizing="md"
            value={username}
            className={error ? "form-rounded-md-error" : "form-rounded-md"}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{t("Enter Username")}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="password" value={t("Password")} />
          </div>
          <TextInput
            id="password"
            type="password"
            sizing="md"
            color="failure"
            value={password}
            className={error ? "form-rounded-md-error" : "form-rounded-md"}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{t("Enter Password")}</p>
          )}
        </div>

        {/* Remember Device */}
        <div className="flex justify-between my-5">
          <Link
            href="/auth/forgot-password"
            className="text-primary text-sm font-medium"
          >
            {t("Forgot Password")}?
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
            t("Log in")
          )}
        </Button>
      </form>
      <Modal
        show={TwoFAModal}
        onClose={() => {
          setTwoFAModal(false);
        }}
      >
        <Modal.Header className="bg-primary rounded-t-lg text-white">
          <h2 className="text-lg font-semibold text-white">
            Two-Factor Authentication
          </h2>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            {/* Instructions */}
            <h3 className="text-gray-800 font-medium mb-2">
              ป้อนรหัสผ่าน 6 หลัก
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              กรุณาเปิดแอปการยืนยันตัวตนสองขั้นตอนของคุณ และป้อนรหัสผ่าน 6
              หลักที่สร้างขึ้นสำหรับบัญชีของคุณ
            </p>

            {/* Passcode Input */}
            <div className="mb-4">
              <div className="flex justify-center mt-2">
                <TextInput
                  id="passCode"
                  type="text"
                  value={passCode}
                  onChange={(e) => setPassCode(e.target.value)}
                  placeholder=" ป้อนรหัสผ่าน 6 หลัก"
                  sizing="md"
                  className="form-rounded-md w-6/12 flex justify-center"
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
