"use client";
import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import axios from "axios";
import dynamic from "next/dynamic";
import VerifyAnimation from "../../../public/images/lottie/lottie-verify.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const PageContent = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const router = useRouter();

  const redirectToApp = async () => {
    if (search) {
      const token = localStorage.getItem("refresh_token");
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/loginsso`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Ap-Id": search,
            },
          }
        );
        if (res.data.status === "success") {
          router.push(`${res.data.callback_url}?vrfc=${res.data.verify_code}`);
        } else if (res.data.status === "error") {
          router.push(`/auth/auth1/login?redirect=${search}`);
        }
      } catch (error) {
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
  );
};

const Page = () => {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
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
        }
      >
        <PageContent />
      </Suspense>
    </ProtectedRoute>
  );
};

export default Page;
