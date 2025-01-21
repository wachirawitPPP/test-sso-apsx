import CustomerTable from '@/app/(DashboardLayout)/customer/customer-table';
import { Metadata } from 'next';
import React from 'react';
import BreadcrumbComp from '../layout/shared/breadcrumb/BreadcrumbComp';

export const metadata: Metadata = {
    title: "Role Tables List",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Medical Records"
    },
];
const Page = () => {
    return (


        <div>
             <BreadcrumbComp title="Medical Records" items={BCrumb} />
             
            <CustomerTable/>
        </div>
    );
}

export default Page;
