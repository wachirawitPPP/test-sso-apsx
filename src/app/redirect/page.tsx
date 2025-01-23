"use client";
import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import axios from "axios";
import dynamic from "next/dynamic";
import VerifyAnimation from "../../../public/images/lottie/lottie-verify.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const Page = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const router = useRouter();

  const redirectToApp = async () => {
    if (search) {
      const token = localStorage.getItem("refresh_token");
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/loginsso`,
          null, // No request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Ap-Id": search, //
            },
          }
        );
        if (res.data.status === "success") {
          console.log("Login successful:", res.data);
          router.push(`${res.data.callback_url}?vrfc=${res.data.verify_code}`);
        } else if (res.data.status === "error") {
          console.log("Login failed:", res.data);
          router.push(`/auth/auth1/login?redirect=${search}`);
        }

        // Handle the response
      } catch (error) {
        // Handle the error
        console.error("Login failed:", error);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      redirectToApp();
    }
  }, [search]);
  return (
    <ProtectedRoute>
      <Suspense fallback={<div></div>}>
        <div className="w-72 h-72 mx-auto">
          <Lottie
            animationData={VerifyAnimation}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
          <p className="text-center text-2xl text-primary">
            Wait for verification...
          </p>
        </div>
      </Suspense>
    </ProtectedRoute>
  );
};

export default Page;
