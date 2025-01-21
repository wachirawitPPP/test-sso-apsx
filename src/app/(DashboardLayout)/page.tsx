import React from "react";
import CardBox from "../components/shared/CardBox";
import BreadcrumbComp from './layout/shared/breadcrumb/BreadcrumbComp'
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "page",
  },
];
const page = () => {
  
  return (
    <>
    <BreadcrumbComp title="page " items={BCrumb} />
      <CardBox>
        
        <h5 className="card-title">Sample page 1</h5>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s
        </p>
      </CardBox>
    </>
  );
};

export default page;
