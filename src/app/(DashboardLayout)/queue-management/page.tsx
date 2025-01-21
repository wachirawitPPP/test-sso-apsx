import BreadcrumbComp from "../layout/shared/breadcrumb/BreadcrumbComp";
import QueueTable from "./queue-table";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Page",
  },
];

export default function page() {
  return (
    <>
      <div className="w-full">
        <BreadcrumbComp title="จัดการคิว" items={BCrumb} />
        <QueueTable />
      </div>
    </>
  );
}
