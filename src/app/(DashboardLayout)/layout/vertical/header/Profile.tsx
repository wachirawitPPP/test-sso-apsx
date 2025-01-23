"use client";
import { Icon } from "@iconify/react";
import { Button, Dropdown } from "flowbite-react";
import React, { useEffect, useState } from "react";
import * as profileData from "./Data";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import SimpleBar from "simplebar-react";
const Profile = () => {
  const [data, setData] = useState<any>({
    username: "",
    fullname: "",
    email: "",
  });
  const { t } = useTranslation();

  const getUserData = async () => {
    return setData({
      username: localStorage.getItem("username"),
      fullname: localStorage.getItem("fullname"),
      email: localStorage.getItem("email"),
    });
  };

  useEffect(() => {
    // Access localStorage only on the client side
    getUserData();
  }, []);
  const signOut = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");
    window.location.href = "/auth/auth1/login";
  }

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6  rounded-sm"
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <Image
              src="/images/profile/user-1.jpg"
              alt="logo"
              height="35"
              width="35"
              className="rounded-full"
            />
          </span>
        )}
      >
        <div className="px-6">
          <h3 className="text-lg font-semibold text-ld">{t("User Profile")}</h3>
          <div className="flex items-center gap-6 pb-5 border-b dark:border-darkborder mt-5 mb-3">
            <Image
              src="/images/profile/user-1.jpg"
              alt="logo"
              height="80"
              width="80"
              className="rounded-full"
            />
            <div>
              <h5 className="card-title">{data?.fullname}</h5>
              {/* <span className="card-subtitle">Admin</span> */}
              <p className="card-subtitle mb-0 mt-1 flex items-center">
                <Icon
                  icon="solar:mailbox-line-duotone"
                  className="text-base me-1"
                />
                {data?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-6 px-6">
          <Button
            color={"primary"}
            as={Link}
            href="/auth/auth1/login"
            className="w-full"
            onClick={() => signOut()}
          >
            {t("Logout")}
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
