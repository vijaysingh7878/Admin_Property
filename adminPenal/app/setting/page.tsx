import React from "react";
import Link from "next/link";
import { BsChatDotsFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { IoNotifications, IoLockClosed, IoArrowBack } from "react-icons/io5";

const settingsOptions = [
//   {
//     title: "Profile",
//     description: "Update your personal information and avatar.",
//     icon: <FaUserCircle className="text-2xl text-blue-600" />,
//     href: "/settings/profile",
//   },
//   {
//     title: "Notifications",
//     description: "Manage your notification preferences.",
//     icon: <IoNotifications className="text-2xl text-yellow-600" />,
//     href: "/settings/notifications",
//   },
  {
    title: "Chat",
    description: "Control chat behavior.",
    icon: <BsChatDotsFill className="text-2xl text-green-600" />,
    href: "/setting/chat",
  },
//   {
//     title: "Security",
//     description: "Change password or enable two-factor authentication.",
//     icon: <IoLockClosed className="text-2xl text-red-600" />,
//     href: "/settings/security",
//   },
];

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {settingsOptions.map((option, index) => (
          <Link
            href={option.href}
            key={index}
            className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">{option.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{option.title}</h2>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
