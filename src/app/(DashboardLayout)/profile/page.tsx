import { Card } from "flowbite-react";
import React from "react";
import BreadcrumbComp from "../layout/shared/breadcrumb/BreadcrumbComp";
import ProfileApps from "@/app/components/profile";

const BCrumb = [
  {
    to: "/app-menu",
    title: "Home",
  },
  {
    title: "Profile",
  },
  {
    title: "Profile Settings",
  },

];

const Page = () => {
  return (
    <div>
      <BreadcrumbComp title="Profile Settings" items={BCrumb} />
      <Card>
        <ProfileApps />
      </Card>
    </div>
  );
};

export default Page;
