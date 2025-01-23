import { Button, Card } from "flowbite-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

interface MenuCardProps {
  appData: AppData[];
}

interface AppData {
  ap_id: string;
  ap_name_en: string;
  ap_name_th: string;
  ap_logo: string;
  ap_url: string;
}



const MenuCard: React.FC<MenuCardProps> = ({ appData }) => {
  const router = useRouter();

  // Example: fetch app data from an API endpoint
  const handleLogin = async (ap_id: string) => {
    const token = localStorage.getItem("refresh_token");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/loginsso`,
        null, // No request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Ap-Id": ap_id, //
          },
        }
      );
      if (res.data.status === "success") {
        console.log("Login successful:", res.data);
        router.push(`${res.data.callback_url}?vrfc=${res.data.verify_code}`);
      }
      console.log("Login failed:", res.data);

      // Handle the response
    } catch (error) {
      // Handle the error
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="flex flex-wrap mt-2 min-h-72">
      {appData && appData.length > 0 ? (
        appData.map((app, index) => (
          <div key={index} className=" lg:w-4/12 p-2">
            <Card className="rounded-md border border-gray-300">
              <div className="flex flex-row">
                {/* App Logo */}
                <div className="flex-shrink-0 border-2 border-primary rounded-md">
                  <Image
                    src={
                      "https://i.pinimg.com/736x/16/3d/cb/163dcb920d747eb5e11490f8551561b8.jpg"
                    }
                    alt={`${app.ap_name_en} logo`}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>

                {/* App Details */}
                <div className="ml-4 flex flex-col justify-between w-full">
                  {/* App Name and URL */}
                  <div className="flex flex-col items-end">
                    <h2 className="text-lg font-bold text-primary">
                      {app.ap_name_en}
                    </h2>
                  </div>

                  {/* Divider */}
                  <hr className="my-2" />

                  {/* Bottom Section */}
                  <div className="flex justify-end items-center">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => handleLogin(app.ap_id)}
                    >
                      เข้าใช้งานระบบ →
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))
      ) : (
        <div className="w-full flex justify-center h-72">
          <p className="text-lg">ไม่พบรายการ</p>
        </div>
      )}
    </div>
  );
};

export default MenuCard;
