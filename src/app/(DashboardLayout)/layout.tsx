"use client";
import React, { useContext, useEffect } from "react";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Header from "./layout/vertical/header/Header";
import { Customizer } from "./layout/shared/customizer/Customizer";
import { CustomizerContext } from "@/app/context/customizerContext";
import { jwtDecode } from "jwt-decode";
import { Footer } from "flowbite-react";
import CardBox from "../components/shared/CardBox";
import Link from "next/link";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import ProtectedRoute from "../components/shared/ProtectedRoute";
// Define the shape of the context state

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeLayout, isLayout } = useContext(CustomizerContext);

  return (
    <ProtectedRoute>
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
              className={` ${
                isLayout == "full"
                  ? "w-full py-[30px] md:px-[30px] px-5"
                  : "container mx-auto  py-[30px]"
              } ${activeLayout == "horizontal" ? "xl:mt-3" : ""}
            `}
            >
              {children}
              <ProgressBar
                height="4px"
                color="var(--color-primary)"
                options={{ showSpinner: false }}
                shallowRouting
              />
            </div>

            <div className="mx-7">
              <footer>
                <CardBox className="mb-[30px]">
                  <div className=" flex flex-row gap-2">
                    <p>Copyright © 2025</p>
                    <Link
                      target="_blank"
                      href={"https://www.apsth.com/"}
                      className="text-primary text-sm font-medium"
                    >
                      APSX Platform | by APSTH
                    </Link>
                  </div>
                </CardBox>
              </footer>
            </div>

            <Customizer />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
