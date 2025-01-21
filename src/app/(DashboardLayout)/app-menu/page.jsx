import React from 'react';
import Appmenu from "@/app/components/app-menu";
import BreadcrumbComp from "../layout/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Applications",
    },
   
  ];

const Page = () => {
    return (
        <div>
            <BreadcrumbComp title="Applications" items={BCrumb} />
            <Appmenu></Appmenu>
        </div>
    );
}

export default Page;
