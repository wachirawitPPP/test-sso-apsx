"use client";
import React, { useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import CardBox from "../shared/CardBox";
import axios from "axios";
import { headers } from "next/headers";
import { Card } from "flowbite-react";

const AppMenu = () => {
  const [data, setData] = useState([]);

  const getApp = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "success") {
        setData(res.data.data.us_apps);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getApp();
  }, []);
  return (
    <Card className="">
      <p className="text-2xl text-primary font-semibold">รายการเข้าสู่ระบบ</p>
      <hr />
      <MenuCard appData={data} />
    </Card>
  );
};

export default AppMenu;
