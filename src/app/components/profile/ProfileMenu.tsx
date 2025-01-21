"use client";
import { List } from "flowbite-react";
import React from "react";
import { Icon } from "@iconify/react";

// Define the menu item type
interface MenuItem {
  id: number;
  name: string;
  icon: string;
}

// Define the props for ProfileMenu
interface ProfileMenuProps {
  setSelectedMenu: (menuIndex: number) => void;
  selectedMenu: number; // Track which menu is selected
}

// Menu list data
const menu_list: MenuItem[] = [
  {
    id: 1,
    name: "Profile",
    icon: "solar:inbox-line-broken",
  },
  {
    id: 2,
    name: "Security & Privacy",
    icon: "solar:inbox-line-broken",
  },
  {
    id: 3,
    name: "Settings",
    icon: "solar:settings-gear-linear",
  },
];

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  setSelectedMenu,
  selectedMenu,
}) => {
  return (
    <List className="space-y-4">
      {menu_list.map((menu, index) => (
        <List.Item
          key={menu.id}
          className={`flex text-lg font-semibold  items-center gap-x-2 p-4 border-2 cursor-pointer rounded-md transition-all 
            ${selectedMenu === index ? "bg-blue-100 text-primary" : "hover:bg-gray-100"}
          `}
          onClick={() => setSelectedMenu(index)} // Pass the index to setSelectedMenu
        >
          <Icon icon={menu.icon} className="text-lg" />
          <span className="font-medium">{menu.name}</span>
        </List.Item>
      ))}
    </List>
  );
};

export default ProfileMenu;
