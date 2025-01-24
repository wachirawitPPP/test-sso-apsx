import React, { Suspense } from "react";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import SocialButtons from "../../authforms/SocialButtons";
import AuthLogin from "../../authforms/AuthLogin";
import LoginBg from "../../../../../public/images/backgrounds/BG_loging-01.png";
import LoginLogo from "/public/images/logos/logo-light.svg";
import LeftSidebarPart from "../LeftSidebarPart";
import Image from "next/image";
import type { Metadata } from "next";
import metaData from "../../../data/metaData.json";
export const metadata: Metadata = {
  title: metaData.title_web,
  description: metaData.description_web,
  keywords: metaData.keywords_web,
};

import Link from "next/link";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";
import { Language } from "@/app/(DashboardLayout)/layout/vertical/header/Language";
const Login = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div className="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-darkgray">
          <div className="xl:col-span-4 lg:col-span-4 col-span-12 bg-white lg:block hidden relative overflow-hidden  ">
            {/* <LeftSidebarPart /> */}
            <div className="absolute inset-0">
              <img
                src={"/images/backgrounds/BG_loging-01.png"}
                // width={0}
                // height={0}
                // priority={true}
                 alt="login-background"
                // // sizes="100vw"
                style={{ height: "100%", width: "auto" }}
              />
            </div>
          </div>
          <div className="xl:col-span-8 lg:col-span-8 col-span-12 sm:px-12 px-4">
            <div className="flex h-screen items-center px-3 lg:justify-start justify-center">
              <div className="max-w-[420px] w-full mx-auto">
                <div className="flex justify-center mb-6">
                  <Image
                    priority
                    src={LoginLogo}
                    width={300}
                    alt="Picture of the author"
                    className="border-2 border-primary rounded-md"
                  />
                </div>
                <div className="flex justify-center">
                  <h1 className="text-2xl">Login SSO</h1>
                </div>
                <div className="flex justify-end">
                  <Language />
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                  <AuthLogin />
                </Suspense>
                <div className="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-center">
                  <p>Copyright © 2025</p>
                  <Link
                    target="_blank"
                    href={"https://www.apsth.com/"}
                    className="text-primary text-sm font-medium"
                  >
                    APSX Platform | by APSTH
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
