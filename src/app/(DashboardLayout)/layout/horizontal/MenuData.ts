import { uniqueId } from "lodash";
interface MenuItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  column: number;
  children?: MenuItem[]; // Optional array of children
}

const Menuitems: MenuItem[] = [
  {
    id: uniqueId(),
    title: "App List",
    icon: "solar:user-id-broken",
    href: "/app-menu",
    column: 2,
    children: [
      // {
      //   id: uniqueId(),
      //   title: "จัดการข้อมูลส่วนตัว",
      //   icon: "solar:settings-bold",
      //   href: "",
      // },
    ],
  },

  {
    id: uniqueId(),
    title: "Profile",
    icon: "solar:user-id-broken",
    href: "/profile",
    column:2,
    children: [
      // {
      //   id: uniqueId(),
      //   title: "จัดการข้อมูลส่วนตัว",
      //   icon: "solar:settings-bold",
      //   href: "",
      // },
    ],
  },
];
export default Menuitems;
